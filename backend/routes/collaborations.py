from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Collaboration, Industry, Academician, Notification
from utils.auth_helper import jwt_required

collaborations_bp = Blueprint('collaborations', __name__, url_prefix='/api/collaborations')

@collaborations_bp.route('', methods=['GET'])
@jwt_required
def get_collaborations(current_user):
    status_filter = request.args.get('status')
    type_filter = request.args.get('type')
    
    query = Collaboration.query
    
    if current_user.role == 'industry' and current_user.industry_profile:
        query = query.filter_by(industry_id=current_user.industry_profile.id)
    elif current_user.role == 'academician' and current_user.academician_profile:
        query = query.filter_by(academician_id=current_user.academician_profile.id)
        
    if status_filter and status_filter != 'all':
        query = query.filter_by(status=status_filter)
    if type_filter and type_filter != 'all':
        query = query.filter_by(type=type_filter)
        
    collabs = query.order_by(Collaboration.created_at.desc()).all()
    return jsonify({
        'collaborations': [c.to_dict() for c in collabs],
        'total': len(collabs)
    })


@collaborations_bp.route('', methods=['POST'])
@jwt_required
def create_collaboration(current_user):
    data = request.get_json() or {}
    
    title = data.get('title', '').strip()
    collab_type = data.get('type', 'workshop')
    description = data.get('description', '').strip()
    
    if not title or not description:
        return jsonify({'error': 'Title and description are required'}), 400
        
    target_topics = data.get('target_topics', 'Skill Development')
    proposed_date = data.get('proposed_date', 'Next Month')
    
    industry_id = data.get('industry_id')
    academician_id = data.get('academician_id')
    
    initiator_role = current_user.role
    
    if current_user.role == 'industry':
        industry_id = current_user.industry_profile.id if current_user.industry_profile else 1
        if not academician_id:
            first_acad = Academician.query.first()
            academician_id = first_acad.id if first_acad else 1
    elif current_user.role == 'academician':
        academician_id = current_user.academician_profile.id if current_user.academician_profile else 1
        if not industry_id:
            first_ind = Industry.query.first()
            industry_id = first_ind.id if first_ind else 1
    else: # admin
        industry_id = industry_id or 1
        academician_id = academician_id or 1
        
    collab = Collaboration(
        industry_id=industry_id,
        academician_id=academician_id,
        initiator_role=initiator_role,
        type=collab_type,
        title=title,
        description=description,
        target_topics=target_topics,
        proposed_date=proposed_date,
        status='pending'
    )
    db.session.add(collab)
    
    # Notify Recipient
    recipient_user_id = None
    if initiator_role == 'industry':
        acad = Academician.query.get(academician_id)
        if acad:
            recipient_user_id = acad.user_id
    else:
        ind = Industry.query.get(industry_id)
        if ind:
            recipient_user_id = ind.user_id
            
    if recipient_user_id:
        notif = Notification(
            user_id=recipient_user_id,
            title=f"New Collaboration Proposal: {title}",
            message=f"Received a new {collab_type.replace('_', ' ').title()} partnership proposal from {current_user.email}.",
            type="collab_request",
            action_url="/academician/collaborations" if initiator_role == 'industry' else "/industry/collaborations"
        )
        db.session.add(notif)
        
    db.session.commit()
    return jsonify({
        'message': 'Collaboration proposal dispatched successfully',
        'collaboration': collab.to_dict()
    }), 201


@collaborations_bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required
def update_collaboration_status(current_user, id):
    collab = Collaboration.query.get_or_404(id)
    data = request.get_json() or {}
    new_status = data.get('status', '').lower()
    response_note = data.get('response_note', '')
    
    if new_status not in ['pending', 'accepted', 'rejected', 'completed']:
        return jsonify({'error': 'Invalid status'}), 400
        
    collab.status = new_status
    if response_note:
        collab.response_note = response_note
    collab.updated_at = datetime.utcnow()
    
    # Send Notification to initiator
    initiator_user_id = None
    if collab.initiator_role == 'industry' and collab.industry_partner:
        initiator_user_id = collab.industry_partner.user_id
    elif collab.initiator_role == 'academician' and collab.academic_partner:
        initiator_user_id = collab.academic_partner.user_id
        
    if initiator_user_id:
        notif = Notification(
            user_id=initiator_user_id,
            title=f"Collaboration {new_status.capitalize()}: {collab.title}",
            message=f"Your proposal for '{collab.title}' has been {new_status}.",
            type="collab_status"
        )
        db.session.add(notif)
        
    db.session.commit()
    return jsonify({
        'message': f'Collaboration status updated to {new_status}',
        'collaboration': collab.to_dict()
    })


@collaborations_bp.route('/partners', methods=['GET'])
def get_available_partners():
    industries = Industry.query.all()
    academicians = Academician.query.all()
    return jsonify({
        'industries': [{'id': i.id, 'name': i.company_name, 'sector': i.sector, 'location': i.location} for i in industries],
        'academicians': [{'id': a.id, 'name': a.name, 'institution': a.institution, 'department': a.department} for a in academicians]
    })
