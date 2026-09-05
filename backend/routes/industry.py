from flask import Blueprint, request, jsonify
import json
from datetime import datetime
from models import db, Industry, Opportunity, Application, Interview, Student, Notification
from utils.auth_helper import jwt_required, roles_required
from services.matching_service import calculate_candidate_match

industry_bp = Blueprint('industry', __name__, url_prefix='/api/industry')

@industry_bp.route('/dashboard', methods=['GET'])
@jwt_required
def get_dashboard_metrics(current_user):
    industry = current_user.industry_profile
    if not industry:
        # Fallback to demo industry
        industry = Industry.query.first()
        
    postings = Opportunity.query.filter_by(industry_id=industry.id).all()
    posting_ids = [p.id for p in postings]
    
    total_apps = Application.query.filter(Application.opportunity_id.in_(posting_ids)).count() if posting_ids else 0
    shortlisted_apps = Application.query.filter(Application.opportunity_id.in_(posting_ids), Application.status == 'shortlisted').count() if posting_ids else 0
    interview_apps = Application.query.filter(Application.opportunity_id.in_(posting_ids), Application.status == 'interview').count() if posting_ids else 0
    hired_apps = Application.query.filter(Application.opportunity_id.in_(posting_ids), Application.status == 'selected').count() if posting_ids else 0
    
    recent_apps = Application.query.filter(Application.opportunity_id.in_(posting_ids)).order_by(Application.applied_at.desc()).limit(6).all() if posting_ids else []
    
    return jsonify({
        'company_name': industry.company_name,
        'sector': industry.sector,
        'active_postings_count': len([p for p in postings if p.status == 'active']),
        'total_postings_count': len(postings),
        'total_applications_count': total_apps,
        'shortlisted_count': shortlisted_apps,
        'interviews_scheduled_count': interview_apps,
        'hired_count': hired_apps,
        'recent_applications': [a.to_dict() for a in recent_apps]
    })


@industry_bp.route('/postings', methods=['GET'])
@jwt_required
def get_my_postings(current_user):
    industry = current_user.industry_profile or Industry.query.first()
    postings = Opportunity.query.filter_by(industry_id=industry.id).order_by(Opportunity.created_at.desc()).all()
    return jsonify({
        'postings': [p.to_dict() for p in postings],
        'total': len(postings)
    })


@industry_bp.route('/candidates', methods=['GET'])
@jwt_required
def search_candidates(current_user):
    """
    Search & rank candidate pool with automated AI match scoring against industry criteria.
    """
    skill_filter = request.args.get('skill')
    branch_filter = request.args.get('branch')
    college_filter = request.args.get('college')
    min_cgpa = request.args.get('min_cgpa')
    opp_id = request.args.get('opportunity_id') # calculate match against specific job
    
    query = Student.query
    
    if branch_filter and branch_filter != 'All':
        query = query.filter(Student.branch.ilike(f'%{branch_filter}%'))
    if college_filter and college_filter != 'All':
        query = query.filter(Student.college.ilike(f'%{college_filter}%'))
    if min_cgpa:
        try:
            query = query.filter(Student.cgpa >= float(min_cgpa))
        except ValueError:
            pass
            
    students = query.all()
    
    # Target opportunity for match benchmarking
    target_opp = None
    if opp_id:
        target_opp = Opportunity.query.get(opp_id)
    if not target_opp:
        industry = current_user.industry_profile or Industry.query.first()
        target_opp = Opportunity.query.filter_by(industry_id=industry.id, status='active').first()
        
    candidates = []
    for s in students:
        s_dict = s.to_dict()
        if target_opp:
            match_res = calculate_candidate_match(s, target_opp)
            s_dict['match_score'] = match_res['match_score']
            s_dict['match_breakdown'] = match_res['breakdown']
            s_dict['benchmark_job_title'] = target_opp.title
        else:
            s_dict['match_score'] = min(98.0, max(55.0, round(s.cgpa * 10.5, 1)))
            s_dict['match_breakdown'] = {'summary': 'General profile competency match.'}
            s_dict['benchmark_job_title'] = 'Active Industry Demand'
            
        # If skill filter applied, check if student has skill
        if skill_filter and skill_filter != 'All':
            has_sk = any(skill_filter.lower() in (ss.get('name') or '').lower() for ss in s_dict['skills'])
            if not has_sk:
                continue
                
        candidates.append(s_dict)
        
    candidates.sort(key=lambda x: x.get('match_score', 0), reverse=True)
    
    return jsonify({
        'candidates': candidates,
        'total': len(candidates),
        'benchmark_job': target_opp.title if target_opp else 'General Evaluation'
    })


@industry_bp.route('/applications', methods=['GET'])
@jwt_required
def get_industry_applications(current_user):
    industry = current_user.industry_profile or Industry.query.first()
    status_filter = request.args.get('status')
    opp_id = request.args.get('opportunity_id')
    
    postings = Opportunity.query.filter_by(industry_id=industry.id).all()
    posting_ids = [p.id for p in postings]
    
    if not posting_ids:
        return jsonify({'applications': [], 'total': 0})
        
    query = Application.query.filter(Application.opportunity_id.in_(posting_ids))
    if status_filter and status_filter != 'all':
        query = query.filter_by(status=status_filter)
    if opp_id:
        query = query.filter_by(opportunity_id=opp_id)
        
    apps = query.order_by(Application.match_score.desc(), Application.applied_at.desc()).all()
    return jsonify({
        'applications': [a.to_dict() for a in apps],
        'total': len(apps)
    })


@industry_bp.route('/applications/<int:id>/status', methods=['PUT'])
@jwt_required
def update_application_status(current_user, id):
    app = Application.query.get_or_404(id)
    data = request.get_json() or {}
    new_status = data.get('status', '').lower()
    
    if new_status not in ['applied', 'shortlisted', 'interview', 'selected', 'rejected']:
        return jsonify({'error': 'Invalid status'}), 400
        
    app.status = new_status
    app.updated_at = datetime.utcnow()
    
    # Send Notification to Student
    status_titles = {
        'shortlisted': '🎉 Profile Shortlisted!',
        'interview': '📅 Interview Scheduled!',
        'selected': '🏆 Congratulations! Selected / Offered!',
        'rejected': 'Application Status Update'
    }
    
    status_msgs = {
        'shortlisted': f"Great news! {app.opportunity.industry.company_name if app.opportunity and app.opportunity.industry else 'The company'} has shortlisted your application for '{app.opportunity.title}'.",
        'interview': f"An interview has been scheduled for your application '{app.opportunity.title}'. Check details in your tracker.",
        'selected': f"Congratulations! You have been selected for '{app.opportunity.title}'. Welcome aboard!",
        'rejected': f"Thank you for applying to '{app.opportunity.title}'. Keep developing your skills for future openings."
    }
    
    if app.student and app.student.user_id:
        notif = Notification(
            user_id=app.student.user_id,
            title=status_titles.get(new_status, 'Application Updated'),
            message=status_msgs.get(new_status, f"Status changed to {new_status}."),
            type='application_status',
            action_url='/student/applications'
        )
        db.session.add(notif)
        
    db.session.commit()
    return jsonify({
        'message': f'Application status updated to {new_status}',
        'application': app.to_dict()
    })


@industry_bp.route('/applications/<int:id>/schedule-interview', methods=['POST'])
@jwt_required
def schedule_interview(current_user, id):
    app = Application.query.get_or_404(id)
    data = request.get_json() or {}
    
    scheduled_at = data.get('scheduled_at', '2026-09-15 15:00 IST')
    meeting_link = data.get('meeting_link', 'https://meet.google.com/sih-ayush-2024')
    mode = data.get('mode', 'Online Video Conference')
    notes = data.get('notes', 'Please be prepared to present your portfolio and discuss domain skills.')
    
    # Create or update interview
    interview = Interview(
        application_id=app.id,
        scheduled_at=scheduled_at,
        meeting_link=meeting_link,
        mode=mode,
        notes=notes,
        status='scheduled'
    )
    app.status = 'interview'
    db.session.add(interview)
    
    # Notify Student
    if app.student and app.student.user_id:
        notif = Notification(
            user_id=app.student.user_id,
            title="📅 Interview Scheduled!",
            message=f"Interview scheduled for '{app.opportunity.title}' on {scheduled_at} via {mode}.",
            type="interview",
            action_url="/student/applications"
        )
        db.session.add(notif)
        
    db.session.commit()
    return jsonify({
        'message': 'Interview scheduled successfully',
        'interview': interview.to_dict(),
        'application': app.to_dict()
    }), 201
