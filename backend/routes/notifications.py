from flask import Blueprint, request, jsonify
from models import db, Notification
from utils.auth_helper import jwt_required

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@notifications_bp.route('', methods=['GET'])
@jwt_required
def get_notifications(current_user):
    notifs = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.created_at.desc()).limit(25).all()
    unread_count = Notification.query.filter_by(user_id=current_user.id, is_read=False).count()
    return jsonify({
        'notifications': [n.to_dict() for n in notifs],
        'unread_count': unread_count
    })

@notifications_bp.route('/<int:id>/read', methods=['PUT'])
@jwt_required
def mark_notification_read(current_user, id):
    notif = Notification.query.filter_by(id=id, user_id=current_user.id).first()
    if not notif:
        return jsonify({'error': 'Notification not found'}), 404
        
    notif.is_read = True
    db.session.commit()
    return jsonify({'message': 'Notification marked as read'})

@notifications_bp.route('/read-all', methods=['PUT'])
@jwt_required
def mark_all_read(current_user):
    Notification.query.filter_by(user_id=current_user.id, is_read=False).update({'is_read': True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read'})
