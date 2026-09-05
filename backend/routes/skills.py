from flask import Blueprint, request, jsonify
from models import db, Skill, CareerRole
from utils.auth_helper import jwt_required, roles_required

skills_bp = Blueprint('skills', __name__, url_prefix='/api')

@skills_bp.route('/skills', methods=['GET'])
def get_skills():
    category = request.args.get('category')
    search = request.args.get('search')
    ayush_only = request.args.get('ayush')
    
    query = Skill.query
    if category and category != 'All':
        query = query.filter_by(category=category)
    if ayush_only == 'true':
        query = query.filter_by(is_ayush_specialized=True)
    if search:
        query = query.filter(Skill.name.ilike(f'%{search}%') | Skill.description.ilike(f'%{search}%'))
        
    skills = query.order_by(Skill.name.asc()).all()
    return jsonify({
        'skills': [s.to_dict() for s in skills],
        'total': len(skills)
    })

@skills_bp.route('/skills/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Skill.category).distinct().all()
    return jsonify({
        'categories': [c[0] for c in categories if c[0]]
    })

@skills_bp.route('/skills', methods=['POST'])
@jwt_required
def create_skill(current_user):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    category = data.get('category', 'Technical').strip()
    
    if not name:
        return jsonify({'error': 'Skill name is required'}), 400
        
    existing = Skill.query.filter(Skill.name.ilike(name)).first()
    if existing:
        return jsonify({'error': 'Skill already exists in database', 'skill': existing.to_dict()}), 409
        
    skill = Skill(
        name=name,
        category=category,
        description=data.get('description', f'{name} core proficiency'),
        demand_level=data.get('demand_level', 'High'),
        difficulty_level=data.get('difficulty_level', 'Intermediate'),
        is_ayush_specialized=data.get('is_ayush_specialized', False)
    )
    db.session.add(skill)
    db.session.commit()
    
    return jsonify({'message': 'Skill created successfully', 'skill': skill.to_dict()}), 201

@skills_bp.route('/career-roles', methods=['GET'])
def get_career_roles():
    roles = CareerRole.query.all()
    return jsonify({
        'roles': [r.to_dict() for r in roles]
    })
