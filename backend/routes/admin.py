from flask import Blueprint, request, jsonify
from models import db, User, Student, Industry, Academician, Skill, Opportunity, Application, Collaboration
from utils.auth_helper import jwt_required, roles_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/statistics', methods=['GET'])
@jwt_required
def get_admin_statistics(current_user):
    total_students = Student.query.count()
    total_industries = Industry.query.count()
    total_academicians = Academician.query.count()
    total_skills = Skill.query.count()
    
    active_internships = Opportunity.query.filter_by(type='internship', status='active').count()
    active_jobs = Opportunity.query.filter_by(type='job', status='active').count()
    
    total_applications = Application.query.count()
    shortlisted_apps = Application.query.filter_by(status='shortlisted').count()
    interview_apps = Application.query.filter_by(status='interview').count()
    placed_students = Application.query.filter_by(status='selected').count()
    
    total_collabs = Collaboration.query.count()
    active_collabs = Collaboration.query.filter_by(status='accepted').count()
    
    # Growth & placement metrics
    placement_rate = round((placed_students / max(1, total_applications)) * 100, 1)
    
    # Sector breakdown
    sectors = db.session.query(Industry.sector, db.func.count(Industry.id)).group_by(Industry.sector).all()
    sector_data = [{'name': s[0] or 'General', 'value': s[1]} for s in sectors]
    
    # Application funnel
    funnel = [
        {'stage': 'Total Applications', 'count': total_applications},
        {'stage': 'Shortlisted Profiles', 'count': shortlisted_apps},
        {'stage': 'Interviews Scheduled', 'count': interview_apps},
        {'stage': 'Offers / Placed', 'count': placed_students}
    ]
    
    return jsonify({
        'total_students': total_students,
        'total_industries': total_industries,
        'total_academicians': total_academicians,
        'total_skills': total_skills,
        'active_internships': active_internships,
        'active_jobs': active_jobs,
        'total_opportunities': active_internships + active_jobs,
        'total_applications': total_applications,
        'placed_students': placed_students,
        'placement_success_rate': placement_rate,
        'total_collaborations': total_collabs,
        'active_collaborations': active_collabs,
        'industry_sector_breakdown': sector_data,
        'application_funnel': funnel
    })


@admin_bp.route('/users', methods=['GET'])
@jwt_required
def get_all_users(current_user):
    role_filter = request.args.get('role')
    search = request.args.get('search')
    
    query = User.query
    if role_filter and role_filter != 'All':
        query = query.filter_by(role=role_filter)
    if search:
        query = query.filter(User.email.ilike(f'%{search}%'))
        
    users = query.order_by(User.created_at.desc()).all()
    return jsonify({
        'users': [u.to_dict() for u in users],
        'total': len(users)
    })


@admin_bp.route('/opportunities', methods=['GET'])
@jwt_required
def get_all_opportunities(current_user):
    opps = Opportunity.query.order_by(Opportunity.created_at.desc()).all()
    return jsonify({
        'opportunities': [o.to_dict() for o in opps],
        'total': len(opps)
    })
