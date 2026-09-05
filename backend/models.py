from datetime import datetime
import json
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # student, industry, academician, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student_profile = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    industry_profile = db.relationship('Industry', backref='user', uselist=False, cascade='all, delete-orphan')
    academician_profile = db.relationship('Academician', backref='user', uselist=False, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
        
    def to_dict(self):
        profile = {}
        if self.role == 'student' and self.student_profile:
            profile = self.student_profile.to_dict()
        elif self.role == 'industry' and self.industry_profile:
            profile = self.industry_profile.to_dict()
        elif self.role == 'academician' and self.academician_profile:
            profile = self.academician_profile.to_dict()
            
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'profile': profile
        }


class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    college = db.Column(db.String(200), nullable=False)
    course = db.Column(db.String(100), nullable=False)  # B.Tech, BAMS, MD (Ayurveda), M.Tech, BCA, MCA
    branch = db.Column(db.String(100), nullable=False)  # CSE, Ayurvedic Pharmacology, IT, Dravyaguna, Data Science
    year = db.Column(db.String(20), nullable=False)    # 1st Year, 2nd Year, 3rd Year, Final Year, Graduate
    cgpa = db.Column(db.Float, nullable=False, default=7.5)
    career_interest = db.Column(db.String(200), nullable=True) # Data Analytics, Ayurvedic Clinical Research, AI Engineer
    target_role = db.Column(db.String(100), nullable=True)    # Target career role
    bio = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(100), nullable=True, default='New Delhi')
    resume_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student_skills = db.relationship('StudentSkill', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    applications = db.relationship('Application', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        skills_list = [ss.to_dict() for ss in self.student_skills.all()]
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email': self.user.email if self.user else None,
            'name': self.name,
            'phone': self.phone,
            'college': self.college,
            'course': self.course,
            'branch': self.branch,
            'year': self.year,
            'cgpa': self.cgpa,
            'career_interest': self.career_interest,
            'target_role': self.target_role,
            'bio': self.bio,
            'location': self.location,
            'resume_url': self.resume_url,
            'skills': skills_list,
            'created_at': self.created_at.isoformat()
        }


class Industry(db.Model):
    __tablename__ = 'industries'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    company_name = db.Column(db.String(150), nullable=False)
    official_email = db.Column(db.String(120), nullable=False)
    sector = db.Column(db.String(100), nullable=False) # AYUSH & Healthcare, IT & Software, Pharma, AI/ML, Biotech
    company_size = db.Column(db.String(50), nullable=False) # 1-50, 51-200, 201-1000, 1000+
    location = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(150), nullable=True)
    description = db.Column(db.Text, nullable=True)
    verified = db.Column(db.Boolean, default=True)
    logo_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    opportunities = db.relationship('Opportunity', backref='industry', lazy='dynamic', cascade='all, delete-orphan')
    collaborations_sent = db.relationship('Collaboration', foreign_keys='Collaboration.industry_id', backref='industry_partner', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'company_name': self.company_name,
            'official_email': self.official_email,
            'sector': self.sector,
            'company_size': self.company_size,
            'location': self.location,
            'website': self.website,
            'description': self.description,
            'verified': self.verified,
            'logo_url': self.logo_url,
            'opportunities_count': self.opportunities.count(),
            'created_at': self.created_at.isoformat()
        }


class Academician(db.Model):
    __tablename__ = 'academicians'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    institution = db.Column(db.String(200), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(100), nullable=False) # Professor, Dean, HOD, Training & Placement Officer
    expertise_areas = db.Column(db.Text, nullable=True) # JSON or comma-separated
    bio = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    collaborations = db.relationship('Collaboration', foreign_keys='Collaboration.academician_id', backref='academic_partner', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email': self.user.email if self.user else None,
            'name': self.name,
            'institution': self.institution,
            'department': self.department,
            'designation': self.designation,
            'expertise_areas': self.expertise_areas.split(',') if self.expertise_areas else [],
            'bio': self.bio,
            'created_at': self.created_at.isoformat()
        }


class Skill(db.Model):
    __tablename__ = 'skills'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    category = db.Column(db.String(50), nullable=False) 
    # Programming, Data Science, AI/ML, Web Development, Cloud, Cybersecurity, 
    # Healthcare & AYUSH, Pharmacology, Clinical Research, Management, Soft Skills
    description = db.Column(db.Text, nullable=True)
    demand_level = db.Column(db.String(20), default='High') # Very High, High, Medium, Moderate
    difficulty_level = db.Column(db.String(20), default='Intermediate') # Beginner, Intermediate, Advanced
    is_ayush_specialized = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'demand_level': self.demand_level,
            'difficulty_level': self.difficulty_level,
            'is_ayush_specialized': self.is_ayush_specialized
        }


class StudentSkill(db.Model):
    __tablename__ = 'student_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'), nullable=False)
    proficiency_level = db.Column(db.String(20), default='Intermediate') # Beginner, Intermediate, Advanced, Expert
    rating = db.Column(db.Integer, default=3) # 1 to 5 stars
    verified = db.Column(db.Boolean, default=True)
    endorsements = db.Column(db.Integer, default=1)
    
    skill = db.relationship('Skill', backref='student_associations')
    
    def to_dict(self):
        return {
            'id': self.id,
            'skill_id': self.skill_id,
            'name': self.skill.name if self.skill else None,
            'category': self.skill.category if self.skill else None,
            'demand_level': self.skill.demand_level if self.skill else 'High',
            'proficiency_level': self.proficiency_level,
            'rating': self.rating,
            'verified': self.verified,
            'endorsements': self.endorsements
        }


class CareerRole(db.Model):
    __tablename__ = 'career_roles'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=True, nullable=False)
    domain = db.Column(db.String(100), nullable=False) # Technology, AYUSH & Healthcare, Data & AI, Management
    description = db.Column(db.Text, nullable=True)
    required_skills = db.Column(db.Text, nullable=False) # JSON list of skill names
    typical_salary = db.Column(db.String(50), default='6 - 12 LPA')
    job_demand = db.Column(db.String(20), default='High')
    
    def to_dict(self):
        skills = []
        try:
            skills = json.loads(self.required_skills)
        except Exception:
            skills = [s.strip() for s in self.required_skills.split(',') if s.strip()]
            
        return {
            'id': self.id,
            'title': self.title,
            'domain': self.domain,
            'description': self.description,
            'required_skills': skills,
            'typical_salary': self.typical_salary,
            'job_demand': self.job_demand
        }


class Opportunity(db.Model):
    __tablename__ = 'opportunities'
    
    id = db.Column(db.Integer, primary_key=True)
    industry_id = db.Column(db.Integer, db.ForeignKey('industries.id', ondelete='CASCADE'), nullable=False)
    type = db.Column(db.String(20), nullable=False) # 'internship' or 'job'
    title = db.Column(db.String(150), nullable=False)
    department = db.Column(db.String(100), nullable=True) # Tech, R&D, Clinical, Analytics
    description = db.Column(db.Text, nullable=False)
    required_skills = db.Column(db.Text, nullable=False) # JSON list of skill names
    preferred_skills = db.Column(db.Text, nullable=True) # JSON list
    branch_eligibility = db.Column(db.String(255), nullable=True, default='All Branches')
    min_cgpa = db.Column(db.Float, default=6.0)
    experience_level = db.Column(db.String(50), default='Fresher') # Fresher, 0-1 years, 1-3 years
    location = db.Column(db.String(100), nullable=False)
    work_mode = db.Column(db.String(20), default='Hybrid') # Remote, On-site, Hybrid
    stipend_salary = db.Column(db.String(100), nullable=False) # "₹25,000 / month" or "₹8 - 12 LPA"
    duration = db.Column(db.String(50), nullable=True) # "3 Months", "6 Months", "Full Time"
    openings = db.Column(db.Integer, default=3)
    deadline = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='active') # active, closed, draft
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    applications = db.relationship('Application', backref='opportunity', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self, student=None):
        req_skills = []
        pref_skills = []
        try:
            req_skills = json.loads(self.required_skills)
        except Exception:
            req_skills = [s.strip() for s in self.required_skills.split(',') if s.strip()]
            
        if self.preferred_skills:
            try:
                pref_skills = json.loads(self.preferred_skills)
            except Exception:
                pref_skills = [s.strip() for s in self.preferred_skills.split(',') if s.strip()]
                
        data = {
            'id': self.id,
            'industry_id': self.industry_id,
            'company_name': self.industry.company_name if self.industry else 'Enterprise Partner',
            'company_logo': self.industry.logo_url if self.industry else None,
            'company_location': self.industry.location if self.industry else None,
            'sector': self.industry.sector if self.industry else 'General',
            'type': self.type,
            'title': self.title,
            'department': self.department,
            'description': self.description,
            'required_skills': req_skills,
            'preferred_skills': pref_skills,
            'branch_eligibility': self.branch_eligibility,
            'min_cgpa': self.min_cgpa,
            'experience_level': self.experience_level,
            'location': self.location,
            'work_mode': self.work_mode,
            'stipend_salary': self.stipend_salary,
            'duration': self.duration,
            'openings': self.openings,
            'deadline': self.deadline,
            'status': self.status,
            'applications_count': self.applications.count(),
            'created_at': self.created_at.isoformat()
        }
        return data


class Application(db.Model):
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunities.id', ondelete='CASCADE'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    match_score = db.Column(db.Float, default=0.0)
    match_breakdown = db.Column(db.Text, nullable=True) # JSON with skill, edu, exp, cgpa, loc breakdown
    status = db.Column(db.String(30), default='applied') 
    # applied, shortlisted, interview, selected, rejected
    cover_note = db.Column(db.Text, nullable=True)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    interviews = db.relationship('Interview', backref='application', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        breakdown = {}
        if self.match_breakdown:
            try:
                breakdown = json.loads(self.match_breakdown)
            except Exception:
                pass
                
        interview_data = None
        latest_interview = self.interviews.order_by(Interview.id.desc()).first()
        if latest_interview:
            interview_data = latest_interview.to_dict()
            
        return {
            'id': self.id,
            'opportunity_id': self.opportunity_id,
            'opportunity': self.opportunity.to_dict() if self.opportunity else None,
            'student_id': self.student_id,
            'student': self.student.to_dict() if self.student else None,
            'match_score': round(self.match_score, 1),
            'match_breakdown': breakdown,
            'status': self.status,
            'cover_note': self.cover_note,
            'interview': interview_data,
            'applied_at': self.applied_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Interview(db.Model):
    __tablename__ = 'interviews'
    
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id', ondelete='CASCADE'), nullable=False)
    scheduled_at = db.Column(db.String(100), nullable=False) # e.g. "2026-09-15 14:00 IST"
    meeting_link = db.Column(db.String(255), nullable=True)
    mode = db.Column(db.String(50), default='Online Video (Google Meet / Teams)')
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='scheduled') # scheduled, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'scheduled_at': self.scheduled_at,
            'meeting_link': self.meeting_link,
            'mode': self.mode,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }


class Collaboration(db.Model):
    __tablename__ = 'collaborations'
    
    id = db.Column(db.Integer, primary_key=True)
    industry_id = db.Column(db.Integer, db.ForeignKey('industries.id', ondelete='CASCADE'), nullable=True)
    academician_id = db.Column(db.Integer, db.ForeignKey('academicians.id', ondelete='CASCADE'), nullable=True)
    initiator_role = db.Column(db.String(20), nullable=False) # 'industry' or 'academician'
    type = db.Column(db.String(50), nullable=False) 
    # internship_partnership, placement_drive, research_collaboration, industry_project, workshop, guest_lecture, curriculum_consultation, faculty_development
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    target_topics = db.Column(db.String(255), nullable=True) # e.g. "Ayurvedic AI, Power BI, Clinical Trials"
    proposed_date = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), default='pending') # pending, accepted, rejected, completed
    response_note = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'industry_id': self.industry_id,
            'industry_name': self.industry_partner.company_name if self.industry_partner else 'Industry Partner',
            'industry_sector': self.industry_partner.sector if self.industry_partner else None,
            'academician_id': self.academician_id,
            'academician_name': self.academic_partner.name if self.academic_partner else 'Faculty Lead',
            'institution': self.academic_partner.institution if self.academic_partner else 'Academic Institute',
            'initiator_role': self.initiator_role,
            'type': self.type,
            'title': self.title,
            'description': self.description,
            'target_topics': self.target_topics,
            'proposed_date': self.proposed_date,
            'status': self.status,
            'response_note': self.response_note,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default='info') # info, application_status, interview, match_alert, collab_request
    is_read = db.Column(db.Boolean, default=False)
    action_url = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'action_url': self.action_url,
            'created_at': self.created_at.isoformat()
        }
