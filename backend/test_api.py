import json
from app import create_app
from models import db, User, Student, Opportunity, Application

def test_api():
    print("🧪 Running Backend REST API & Demo Workflow Verification...")
    app = create_app()
    client = app.test_client()
    
    # 1. Health check
    res = client.get('/api/health')
    assert res.status_code == 200, f"Health check failed: {res.data}"
    print("  ✓ Health check passed")
    
    # 2. Demo login as Student
    res = client.post('/api/auth/demo-login', json={'role': 'student'})
    assert res.status_code == 200, f"Student demo login failed: {res.data}"
    student_token = res.json['token']
    student_headers = {'Authorization': f'Bearer {student_token}'}
    print("  ✓ Student demo login successful (Rahul Sharma)")
    
    # 3. Get Student Profile & Skills
    res = client.get('/api/students/profile', headers=student_headers)
    assert res.status_code == 200
    assert res.json['student']['name'] == 'Rahul Sharma'
    print("  ✓ Student profile retrieved")
    
    # 4. Perform Skill Gap Analysis for 'Data Analyst'
    res = client.get('/api/students/skill-gap?target_role=Data+Analyst', headers=student_headers)
    assert res.status_code == 200
    gap_data = res.json
    print(f"  ✓ Skill Gap for Data Analyst: Score={gap_data['current_score']}%, Gap={gap_data['gap_score']}%")
    print(f"    - Missing skills: {[m['name'] for m in gap_data['missing_skills']]}")
    print(f"    - Matched skills: {[m['name'] for m in gap_data['matched_skills']]}")
    assert len(gap_data['learning_roadmap']) > 0
    print("  ✓ Personalized learning roadmap generated")
    
    # 5. Get Recommended Opportunities for Student
    res = client.get('/api/students/recommendations?type=internship', headers=student_headers)
    assert res.status_code == 200
    opps = res.json['opportunities']
    assert len(opps) > 0
    top_opp = opps[0]
    print(f"  ✓ Top recommended internship: '{top_opp['title']}' at '{top_opp['company_name']}' with {top_opp['match_score']}% Match")
    
    # 6. Demo Login as Industry
    res = client.post('/api/auth/demo-login', json={'role': 'industry'})
    assert res.status_code == 200
    ind_token = res.json['token']
    ind_headers = {'Authorization': f'Bearer {ind_token}'}
    print("  ✓ Industry demo login successful (AyuHealth Tech)")
    
    # 7. Search Candidates as Industry
    res = client.get('/api/industry/candidates', headers=ind_headers)
    assert res.status_code == 200
    candidates = res.json['candidates']
    assert len(candidates) > 0
    print(f"  ✓ Candidate search returned {len(candidates)} ranked candidates. Top candidate: {candidates[0]['name']} ({candidates[0]['match_score']}%)")
    
    # 8. Post New Opportunity as Industry
    new_opp_payload = {
        'title': 'Ayurvedic AI & ML Research Intern',
        'type': 'internship',
        'department': 'R&D',
        'description': 'Develop NLP models for extracting insights from ancient botanical formulations.',
        'required_skills': ['Python', 'Natural Language Processing', 'Herbal Informatics'],
        'branch_eligibility': 'CSE, IT, BAMS',
        'min_cgpa': 7.5,
        'location': 'New Delhi',
        'work_mode': 'Hybrid',
        'stipend_salary': '₹30,000 / month',
        'duration': '6 Months'
    }
    res = client.post('/api/opportunities', headers=ind_headers, json=new_opp_payload)
    assert res.status_code == 201
    new_opp_id = res.json['opportunity']['id']
    print(f"  ✓ Industry successfully created new opportunity (ID: {new_opp_id})")
    
    # 9. Student Applies to New Opportunity
    res = client.post(f'/api/opportunities/{new_opp_id}/apply', headers=student_headers, json={'cover_note': 'I have strong Python and NLP passion.'})
    assert res.status_code == 201
    app_id = res.json['application']['id']
    match_score = res.json['application']['match_score']
    print(f"  ✓ Student applied! Automated match score: {match_score}%")
    
    # 10. Industry Shortlists Candidate and Schedules Interview
    res = client.put(f'/api/industry/applications/{app_id}/status', headers=ind_headers, json={'status': 'shortlisted'})
    assert res.status_code == 200
    print("  ✓ Industry shortlisted candidate")
    
    res = client.post(f'/api/industry/applications/{app_id}/schedule-interview', headers=ind_headers, json={
        'scheduled_at': '2026-09-22 11:00 IST',
        'meeting_link': 'https://meet.google.com/ayush-sih-demo',
        'mode': 'Google Meet Video Interview'
    })
    assert res.status_code == 201
    print("  ✓ Industry scheduled interview with meeting link")
    
    # 11. Student Checks Notifications
    res = client.get('/api/notifications', headers=student_headers)
    assert res.status_code == 200
    notifs = res.json['notifications']
    assert len(notifs) > 0
    print(f"  ✓ Student received interview notification: '{notifs[0]['title']}'")
    
    # 12. Demo Login as Academician
    res = client.post('/api/auth/demo-login', json={'role': 'academician'})
    assert res.status_code == 200
    acad_token = res.json['token']
    acad_headers = {'Authorization': f'Bearer {acad_token}'}
    print("  ✓ Academician demo login successful (Dr. Priya Sharma - AIIA)")
    
    # 13. Academician Checks Cohort Skill Analytics & Curriculum Insights
    res = client.get('/api/academician/curriculum-insights', headers=acad_headers)
    assert res.status_code == 200
    insights = res.json
    print(f"  ✓ Academician Curriculum Insights: {len(insights['curriculum_recommendations'])} actionable recommendations generated based on live industry gap.")
    
    # 14. Academician Proposes Workshop Collaboration
    res = client.post('/api/collaborations', headers=acad_headers, json={
        'title': 'Faculty-Industry Joint Workshop on AI & Herbal Informatics',
        'type': 'workshop',
        'description': '3-day capacity building workshop for faculty and scholars at AIIA.',
        'target_topics': 'Python, Herbal Informatics, Clinical Trials',
        'proposed_date': '2026-11-15'
    })
    assert res.status_code == 201
    print("  ✓ Academician created collaboration proposal")
    
    # 15. Demo Login as Admin
    res = client.post('/api/auth/demo-login', json={'role': 'admin'})
    assert res.status_code == 200
    admin_token = res.json['token']
    admin_headers = {'Authorization': f'Bearer {admin_token}'}
    
    res = client.get('/api/admin/statistics', headers=admin_headers)
    assert res.status_code == 200
    stats = res.json
    print(f"  ✓ Admin statistics verified: {stats['total_students']} students, {stats['total_industries']} companies, {stats['total_opportunities']} opportunities, {stats['placement_success_rate']}% placement success.")
    
    print("\n🎉 ALL 15 BACKEND TESTS & DEMO WORKFLOW STEPS PASSED PERFECTLY!\n")

if __name__ == '__main__':
    test_api()
