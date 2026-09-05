from flask import Blueprint, request, jsonify
from models import db, Student, Skill, StudentSkill, Opportunity, Application
from utils.auth_helper import jwt_required, roles_required
from services.matching_service import analyze_student_skill_gap, calculate_candidate_match

students_bp = Blueprint('students', __name__, url_prefix='/api/students')

@students_bp.route('/profile', methods=['GET'])
@jwt_required
def get_profile(current_user):
    student = current_user.student_profile
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
        
    return jsonify({
        'student': student.to_dict()
    })

@students_bp.route('/profile', methods=['PUT'])
@jwt_required
def update_profile(current_user):
    student = current_user.student_profile
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
        
    data = request.get_json() or {}
    student.name = data.get('name', student.name)
    student.phone = data.get('phone', student.phone)
    student.college = data.get('college', student.college)
    student.course = data.get('course', student.course)
    student.branch = data.get('branch', student.branch)
    student.year = data.get('year', student.year)
    if 'cgpa' in data:
        student.cgpa = float(data['cgpa'])
    student.career_interest = data.get('career_interest', student.career_interest)
    student.target_role = data.get('target_role', student.target_role)
    student.bio = data.get('bio', student.bio)
    student.location = data.get('location', student.location)
    student.resume_url = data.get('resume_url', student.resume_url)
    
    db.session.commit()
    return jsonify({
        'message': 'Profile updated successfully',
        'student': student.to_dict()
    })

@students_bp.route('/skills', methods=['GET'])
@jwt_required
def get_student_skills(current_user):
    student = current_user.student_profile
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
        
    skills = [ss.to_dict() for ss in student.student_skills.all()]
    return jsonify({
        'skills': skills,
        'total': len(skills)
    })

@students_bp.route('/skills', methods=['POST'])
@jwt_required
def add_student_skill(current_user):
    student = current_user.student_profile
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
        
    data = request.get_json() or {}
    skill_name = data.get('skill_name', '').strip()
    skill_id = data.get('skill_id')
    proficiency = data.get('proficiency_level', 'Intermediate')
    rating = int(data.get('rating', 3))
    
    skill = None
    if skill_id:
        skill = Skill.query.get(skill_id)
    elif skill_name:
        skill = Skill.query.filter(Skill.name.ilike(skill_name)).first()
        if not skill:
            skill = Skill(
                name=skill_name,
                category=data.get('category', 'Technical'),
                description=f"{skill_name} skill competency",
                demand_level='High'
            )
            db.session.add(skill)
            db.session.flush()
            
    if not skill:
        return jsonify({'error': 'Please provide a valid skill name or ID'}), 400
        
    # Check if student already has this skill
    existing_ss = StudentSkill.query.filter_by(student_id=student.id, skill_id=skill.id).first()
    if existing_ss:
        existing_ss.proficiency_level = proficiency
        existing_ss.rating = rating
        db.session.commit()
        return jsonify({
            'message': 'Skill proficiency updated',
            'skill': existing_ss.to_dict()
        })
    else:
        new_ss = StudentSkill(
            student_id=student.id,
            skill_id=skill.id,
            proficiency_level=proficiency,
            rating=rating,
            verified=True,
            endorsements=1
        )
        db.session.add(new_ss)
        db.session.commit()
        return jsonify({
            'message': 'Skill added to profile',
            'skill': new_ss.to_dict()
        }), 201

@students_bp.route('/skills/<int:id>', methods=['DELETE'])
@jwt_required
def delete_student_skill(current_user, id):
    student = current_user.student_profile
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
        
    ss = StudentSkill.query.filter_by(id=id, student_id=student.id).first()
    if not ss:
        return jsonify({'error': 'Skill not found in student profile'}), 404
        
    db.session.delete(ss)
    db.session.commit()
    return jsonify({'message': 'Skill removed successfully'})

@students_bp.route('/skill-gap', methods=['GET'])
@jwt_required
def get_skill_gap(current_user):
    student = current_user.student_profile
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
        
    target_role = request.args.get('target_role') or student.target_role or "Data Analyst"
    analysis = analyze_student_skill_gap(student, target_role)
    return jsonify(analysis)

@students_bp.route('/recommendations', methods=['GET'])
@jwt_required
def get_recommended_opportunities(current_user):
    student = current_user.student_profile
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
        
    type_filter = request.args.get('type') # 'internship' or 'job' or None
    query = Opportunity.query.filter_by(status='active')
    if type_filter and type_filter in ['internship', 'job']:
        query = query.filter_by(type=type_filter)
        
    opportunities = query.all()
    
    # Check existing applications
    applied_ids = {a.opportunity_id for a in student.applications.all()}
    
    scored_opps = []
    for opp in opportunities:
        match_res = calculate_candidate_match(student, opp)
        opp_dict = opp.to_dict()
        opp_dict['match_score'] = match_res['match_score']
        opp_dict['match_breakdown'] = match_res['breakdown']
        opp_dict['has_applied'] = opp.id in applied_ids
        scored_opps.append(opp_dict)
        
    # Sort descending by match score
    scored_opps.sort(key=lambda x: x['match_score'], reverse=True)
    
    return jsonify({
        'opportunities': scored_opps,
        'total': len(scored_opps)
    })

@students_bp.route('/applications', methods=['GET'])
@jwt_required
def get_my_applications(current_user):
    student = current_user.student_profile
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
        
    apps = student.applications.order_by(Application.applied_at.desc()).all()
    return jsonify({
        'applications': [a.to_dict() for a in apps],
        'total': len(apps)
    })
