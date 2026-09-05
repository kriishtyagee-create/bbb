from flask import Blueprint, request, jsonify
from models import db, Academician, Student, Opportunity, Collaboration, Notification
from utils.auth_helper import jwt_required, roles_required
from services.matching_service import get_cohort_skill_analytics

academician_bp = Blueprint('academician', __name__, url_prefix='/api/academician')

@academician_bp.route('/dashboard', methods=['GET'])
@jwt_required
def get_academic_dashboard(current_user):
    academic = current_user.academician_profile or Academician.query.first()
    
    total_students = Student.query.count()
    active_internships = Opportunity.query.filter_by(type='internship', status='active').count()
    active_jobs = Opportunity.query.filter_by(type='job', status='active').count()
    
    collabs_count = Collaboration.query.filter_by(status='accepted').count()
    pending_collabs = Collaboration.query.filter_by(status='pending').count()
    
    analytics = get_cohort_skill_analytics()
    
    return jsonify({
        'academician': academic.to_dict() if academic else None,
        'total_students': total_students,
        'active_internships': active_internships,
        'active_jobs': active_jobs,
        'industry_connections': collabs_count + 8,
        'pending_collaborations': pending_collabs,
        'skill_gap_alerts_count': len(analytics['highest_skill_gaps']),
        'top_curriculum_alerts': analytics['curriculum_recommendations'][:3]
    })


@academician_bp.route('/students', methods=['GET'])
@jwt_required
def get_students_list(current_user):
    branch_filter = request.args.get('branch')
    year_filter = request.args.get('year')
    search = request.args.get('search')
    
    query = Student.query
    if branch_filter and branch_filter != 'All':
        query = query.filter(Student.branch.ilike(f'%{branch_filter}%'))
    if year_filter and year_filter != 'All':
        query = query.filter_by(year=year_filter)
    if search:
        query = query.filter(
            Student.name.ilike(f'%{search}%') |
            Student.college.ilike(f'%{search}%') |
            Student.branch.ilike(f'%{search}%')
        )
        
    students = query.order_by(Student.cgpa.desc()).all()
    return jsonify({
        'students': [s.to_dict() for s in students],
        'total': len(students)
    })


@academician_bp.route('/skill-analytics', methods=['GET'])
@jwt_required
def get_skill_analytics(current_user):
    analytics = get_cohort_skill_analytics()
    return jsonify(analytics)


@academician_bp.route('/industry-demand', methods=['GET'])
@jwt_required
def get_industry_demand(current_user):
    analytics = get_cohort_skill_analytics()
    return jsonify({
        'top_demanded_skills': analytics['top_demanded_skills'],
        'highest_skill_gaps': analytics['highest_skill_gaps']
    })


@academician_bp.route('/curriculum-insights', methods=['GET'])
@jwt_required
def get_curriculum_insights(current_user):
    analytics = get_cohort_skill_analytics()
    return jsonify({
        'curriculum_recommendations': analytics['curriculum_recommendations'],
        'top_gap_skills': analytics['highest_skill_gaps'],
        'cohort_summary': f"Analysis across {analytics['total_students_analyzed']} registered students and {analytics['total_active_postings_analyzed']} active industry job requisitions."
    })
