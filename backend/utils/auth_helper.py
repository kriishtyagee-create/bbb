import jwt
from functools import wraps
from flask import request, jsonify, current_app
from datetime import datetime, timedelta
from models import User

def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    secret = current_app.config.get('JWT_SECRET_KEY', 'sih_26044_jwt_key_ayush_2024')
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token

def decode_token(token):
    secret = current_app.config.get('JWT_SECRET_KEY', 'sih_26044_jwt_key_ayush_2024')
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Missing authorization header'}), 401
            
        parts = auth_header.split()
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            return jsonify({'error': 'Invalid token format. Expected Bearer <token>'}), 401
            
        token = parts[1]
        payload = decode_token(token)
        if not payload:
            return jsonify({'error': 'Token is invalid or expired'}), 401
            
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 401
            
        return f(current_user=user, *args, **kwargs)
    return decorated

def roles_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return jsonify({'error': 'Missing authorization header'}), 401
                
            parts = auth_header.split()
            if len(parts) != 2 or parts[0].lower() != 'bearer':
                return jsonify({'error': 'Invalid token header'}), 401
                
            payload = decode_token(parts[1])
            if not payload:
                return jsonify({'error': 'Token is invalid or expired'}), 401
                
            user = User.query.get(payload['user_id'])
            if not user or user.role not in allowed_roles:
                return jsonify({'error': f'Access forbidden: requires one of {allowed_roles}'}), 403
                
            return f(current_user=user, *args, **kwargs)
        return decorated
    return decorator
