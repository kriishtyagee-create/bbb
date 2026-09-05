from flask import Blueprint, request, jsonify
import json
from models import db, Opportunity, Application, Student, Industry, Notification
from utils.auth_helper import jwt_required, roles_required, decode_token
from services.matching_service import calculate_candidate_match

opportunities_bp = Blueprint('opportunities', __name__, url_prefix='/api')

@opportunities_bp.route('/opportunities', methods=['GET'])
def get_opportunities():
    opp_type = request.args.get('type') # 'internship' or 'job'
    location = request.args.get('location')
    work_mode = request.args.get('work_mode')
    sector = request.args.get('sector')
    search = request.args.get('search')
    
    query = Opportunity.query.filter_by(status='active')
    
    if opp_type:
        query = query.filter_by(type=opp_type)
    if work_mode and work_mode != 'All':
        query = query.filter_by(work_mode=work_mode)
    if location and location != 'All':
        query = query.filter(Opportunity.location.ilike(f'%{location}%'))
    if search:
        query = query.filter(
            Opportunity.title.ilike(f'%{search}%') |
            Opportunity.description.ilike(f'%{search}%') |
            Opportunity.required_skills.ilike(f'%{search}%')
        )
        
    opps = query.order_by(Opportunity.created_at.desc()).all()
    
    # Check if a student is requesting so we can attach match score and has_applied
    student = None
    applied_ids = set()
    auth_header = request.headers.get('Authorization')
    if auth_header and len(auth_header.split()) == 2:
        payload = decode_token(auth_header.split()[1])
        if payload and payload.get('role') == 'student':
            student = Student.query.filter_by(user_id=payload.get('user_id')).first()
            if student:
                applied_ids = {a.opportunity_id for a in student.applications.all()}
                
    result = []
    for opp in opps:
        d = opp.to_dict()
        if student:
            match_res = calculate_candidate_match(student, opp)
            d['match_score'] = match_res['match_score']
            d['match_breakdown'] = match_res['breakdown']
            d['has_applied'] = opp.id in applied_ids
        else:
            d['match_score'] = 85.0
            d['has_applied'] = False
        result.append(d)
        
    if student:
        result.sort(key=lambda x: x.get('match_score', 0), reverse=True)
        
    return jsonify({
        'opportunities': result,
        'total': len(result)
    })


@opportunities_bp.route('/opportunities/<int:id>', methods=['GET'])
def get_opportunity(id):
    opp = Opportunity.query.get_or_404(id)
    d = opp.to_dict()
    
    # Calculate match if token exists
    auth_header = request.headers.get('Authorization')
    if auth_header and len(auth_header.split()) == 2:
        payload = decode_token(auth_header.split()[1])
        if payload and payload.get('role') == 'student':
            student = Student.query.filter_by(user_id=payload.get('user_id')).first()
            if student:
                match_res = calculate_candidate_match(student, opp)
                d['match_score'] = match_res['match_score']
                d['match_breakdown'] = match_res['breakdown']
                d['has_applied'] = Application.query.filter_by(opportunity_id=opp.id, student_id=student.id).first() is not None
                
    return jsonify({'opportunity': d})


@opportunities_bp.route('/opportunities', methods=['POST'])
@jwt_required
def create_opportunity(current_user):
    if current_user.role not in ['industry', 'admin']:
        return jsonify({'error': 'Only industry partners or admins can post opportunities'}), 403
        
    industry = current_user.industry_profile
    if not industry and current_user.role == 'industry':
        return jsonify({'error': 'Industry profile not found'}), 404
        
    data = request.get_json() or {}
    
    title = data.get('title', '').strip()
    opp_type = data.get('type', 'internship').lower()
    description = data.get('description', '').strip()
    
    if not title or not description:
        return jsonify({'error': 'Title and description are required'}), 400
        
    required_skills = data.get('required_skills', [])
    if isinstance(required_skills, list):
        req_skills_str = json.dumps(required_skills)
    else:
        req_skills_str = json.dumps([s.strip() for s in str(required_skills).split(',') if s.strip()])
        
    pref_skills = data.get('preferred_skills', [])
    if isinstance(pref_skills, list):
        pref_skills_str = json.dumps(pref_skills)
    else:
        pref_skills_str = json.dumps([s.strip() for s in str(pref_skills).split(',') if s.strip()])
        
    ind_id = industry.id if industry else 1
    
    opp = Opportunity(
        industry_id=ind_id,
        type=opp_type,
        title=title,
        department=data.get('department', 'General / Core'),
        description=description,
        required_skills=req_skills_str,
        preferred_skills=pref_skills_str,
        branch_eligibility=data.get('branch_eligibility', 'All Branches'),
        min_cgpa=float(data.get('min_cgpa', 6.0)),
        experience_level=data.get('experience_level', 'Fresher'),
        location=data.get('location', 'New Delhi / Hybrid'),
        work_mode=data.get('work_mode', 'Hybrid'),
        stipend_salary=data.get('stipend_salary', '₹25,000 / month'),
        duration=data.get('duration', '3-6 Months'),
        openings=int(data.get('openings', 3)),
        deadline=data.get('deadline', '30 Days from posting'),
        status='active'
    )
    db.session.add(opp)
    db.session.commit()
    
    return jsonify({
        'message': 'Opportunity posted successfully',
        'opportunity': opp.to_dict()
    }), 201


@opportunities_bp.route('/opportunities/<int:id>/apply', methods=['POST'])
@jwt_required
def apply_opportunity(current_user, id):
    student = current_user.student_profile
    if not student:
        return jsonify({'error': 'Only students can apply for opportunities'}), 403
        
    opp = Opportunity.query.get_or_404(id)
    
    # Check if already applied
    existing = Application.query.filter_by(opportunity_id=opp.id, student_id=student.id).first()
    if existing:
        return jsonify({'error': 'You have already applied for this opportunity', 'application': existing.to_dict()}), 409
        
    data = request.get_json() or {}
    cover_note = data.get('cover_note', f"Excited to apply for {opp.title} at {opp.industry.company_name if opp.industry else 'your organization'}.")
    
    # Compute real-time match score & breakdown
    match_result = calculate_candidate_match(student, opp)
    
    app = Application(
        opportunity_id=opp.id,
        student_id=student.id,
        match_score=match_result['match_score'],
        match_breakdown=json.dumps(match_result['breakdown']),
        status='applied',
        cover_note=cover_note
    )
    db.session.add(app)
    
    # Notify Industry Partner
    if opp.industry and opp.industry.user_id:
        notif = Notification(
            user_id=opp.industry.user_id,
            title=f"New Applicant: {student.name} ({match_result['match_score']}% Match)",
            message=f"{student.name} from {student.college} applied for '{opp.title}'. Skill Match: {match_result['breakdown']['skill_match_percent']}%.",
            type="application_alert",
            action_url=f"/industry/applications"
        )
        db.session.add(notif)
        
    # Notify Student Confirmation
    std_notif = Notification(
        user_id=current_user.id,
        title=f"Application Submitted: {opp.title}",
        message=f"Your application to {opp.industry.company_name if opp.industry else 'the company'} was submitted successfully with a {match_result['match_score']}% match score.",
        type="application_status",
        action_url=f"/student/applications"
    )
    db.session.add(std_notif)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Application submitted successfully',
        'application': app.to_dict()
    }), 201


@opportunities_bp.route('/match/calculate', methods=['POST'])
def calculate_match_preview():
    """
    Public API to test match algorithm dynamically.
    Takes student skills and opportunity requirements.
    """
    data = request.get_json() or {}
    student_id = data.get('student_id')
    opp_id = data.get('opportunity_id')
    
    if student_id and opp_id:
        std = Student.query.get(student_id)
        opp = Opportunity.query.get(opp_id)
        if std and opp:
            return jsonify(calculate_candidate_match(std, opp))
            
    return jsonify({
        'match_score': 88.5,
        'breakdown': {
            'skill_match_percent': 90.0,
            'education_match_percent': 100.0,
            'experience_match_percent': 80.0,
            'interest_match_percent': 90.0,
            'location_match_percent': 100.0,
            'cgpa_match_percent': 85.0,
            'summary': 'Demonstration of weighted smart candidate matching formula.'
        }
    })
