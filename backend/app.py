import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from models import db, User
from seed_data import seed_database

# Import Blueprints
from routes.auth import auth_bp
from routes.students import students_bp
from routes.industry import industry_bp
from routes.academicians import academician_bp
from routes.opportunities import opportunities_bp
from routes.collaborations import collaborations_bp
from routes.skills import skills_bp
from routes.notifications import notifications_bp
from routes.admin import admin_bp

def create_app():
    app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Initialize DB
    db.init_app(app)
    
    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(industry_bp)
    app.register_blueprint(academician_bp)
    app.register_blueprint(opportunities_bp)
    app.register_blueprint(collaborations_bp)
    app.register_blueprint(skills_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(admin_bp)
    
    # Create DB tables & Seed if not initialized
    with app.app_context():
        db.create_all()
        if not User.query.first():
            print("Database empty. Auto-seeding initial SIH demo data...")
            seed_database()
            
    # API Health Endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'portal': 'SIH 2024 PS 26044: Portal for Academia-Industry Collaboration',
            'organization': 'Ministry of Ayush / All India Institute of Ayurveda',
            'theme': 'Smart Automation',
            'database': 'Connected',
            'users_count': User.query.count()
        })
        
    # Serve SPA Frontend in production / combined mode
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        elif os.path.exists(os.path.join(app.static_folder, 'index.html')):
            return send_from_directory(app.static_folder, 'index.html')
        else:
            return jsonify({
                'message': 'SIH PS 26044 Academia-Industry Skill Portal Backend API is active.',
                'api_docs': '/api/health',
                'frontend_status': 'Development server running on Vite or build frontend with npm run build.'
            })
            
    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"🚀 Starting SIH PS 26044 Backend Server on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
