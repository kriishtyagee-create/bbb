from flask import Blueprint, request, jsonify
from models import db, User, Student, Industry, Academician, Notification
from utils.auth_helper import generate_token, jwt_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'student').lower()
    
    if not email or not password or not role:
        return jsonify({'error': 'Email, password, and role are required'}), 400
        
    if role not in ['student', 'industry', 'academician', 'admin']:
        return jsonify({'error': 'Invalid role specified'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email already exists'}), 409
        
    user = User(email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.flush() # get user.id
    
    # Create Role-Specific Profile
    if role == 'student':
        student = Student(
            user_id=user.id,
            name=data.get('name', 'Student Candidate'),
            phone=data.get('phone', ''),
            college=data.get('college', 'All India Institute of Ayurveda (AIIA)'),
            course=data.get('course', 'B.Tech / BAMS'),
            branch=data.get('branch', 'Data Science & Ayurvedic Informatics'),
            year=data.get('year', '3rd Year'),
            cgpa=float(data.get('cgpa', 8.2)),
            career_interest=data.get('career_interest', 'Data Analyst'),
            target_role=data.get('target_role', 'Data Analyst'),
            bio=data.get('bio', 'Aspiring professional passionate about technology and innovation.')
        )
        db.session.add(student)
        
    elif role == 'industry':
        industry = Industry(
            user_id=user.id,
            company_name=data.get('company_name', 'Tech/Healthcare Enterprise'),
            official_email=email,
            sector=data.get('sector', 'AYUSH & Healthcare'),
            company_size=data.get('company_size', '51-200'),
            location=data.get('location', 'New Delhi'),
            website=data.get('website', 'https://example.com'),
            description=data.get('description', 'Pioneering healthcare and smart automation solutions.')
        )
        db.session.add(industry)
        
    elif role == 'academician':
        academician = Academician(
            user_id=user.id,
            name=data.get('name', 'Dr. Professor'),
            institution=data.get('institution', 'All India Institute of Ayurveda'),
            department=data.get('department', 'Dravyaguna & Clinical Pharmacology'),
            designation=data.get('designation', 'Associate Professor & Training Coordinator'),
            expertise_areas=data.get('expertise_areas', 'Herbal Informatics, Clinical Trials, AI in Healthcare'),
            bio=data.get('bio', 'Dedicated to bridging academic curriculum with modern industry needs.')
        )
        db.session.add(academician)
        
    # Welcome Notification
    welcome_notif = Notification(
        user_id=user.id,
        title="Welcome to SIH Skill-Bridge Portal! 🚀",
        message=f"Your account as a {role.capitalize()} has been successfully created. Explore skill mapping and opportunities.",
        type="info"
    )
    db.session.add(welcome_notif)
    db.session.commit()
    
    token = generate_token(user.id, user.role)
    return jsonify({
        'message': 'Registration successful',
        'token': token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
        
    token = generate_token(user.id, user.role)
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    })


@auth_bp.route('/demo-login', methods=['POST'])
def demo_login():
    """
    Instant 1-Click login for live SIH hackathon presentations.
    Roles: student, industry, academician, admin
    """
    data = request.get_json() or {}
    role = data.get('role', 'student').lower()
    
    # Preferred demo accounts from seed data
    demo_emails = {
        'student': 'rahul.sharma@aiia.gov.in',
        'industry': 'careers@ayuhealthtech.com',
        'academician': 'priya.sharma@aiia.gov.in',
        'admin': 'admin@ayush.gov.in'
    }
    
    target_email = demo_emails.get(role, 'rahul.sharma@aiia.gov.in')
    user = User.query.filter_by(email=target_email).first()
    
    # Fallback to any user of that role if specific email not found
    if not user:
        user = User.query.filter_by(role=role).first()
        
    if not user:
        return jsonify({'error': f'No demo user found for role {role}'}), 404
        
    token = generate_token(user.id, user.role)
    return jsonify({
        'message': f'Logged in as demo {role}',
        'token': token,
        'user': user.to_dict()
    })


@auth_bp.route('/me', methods=['GET'])
@jwt_required
def get_current_user(current_user):
    return jsonify({
        'user': current_user.to_dict()
    })


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    return jsonify({
        'message': f'If an account with {email} exists, a password reset link has been dispatched to your email.'
    })
