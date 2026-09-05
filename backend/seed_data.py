import json
from datetime import datetime, timedelta
from models import db, User, Student, Industry, Academician, Skill, StudentSkill, CareerRole, Opportunity, Application, Interview, Collaboration, Notification

def seed_database():
    print("🌱 Initializing Database Seeding...")
    db.create_all()
    
    # Check if data already exists
    if User.query.first():
        print("Database already contains data. Clearing old records for a fresh seed...")
        db.drop_all()
        db.create_all()

    # ==========================================
    # 1. CENTRAL SKILL REPOSITORY (36+ Skills)
    # ==========================================
    skills_data = [
        # Programming
        ("Python", "Programming", "Core Python programming, OOP, scripting and backend development.", "High", "Intermediate", False),
        ("C++", "Programming", "System-level programming, memory management and algorithms.", "High", "Advanced", False),
        ("Java", "Programming", "Enterprise application development and object-oriented architectures.", "High", "Intermediate", False),
        ("SQL", "Programming", "Relational database queries, indexing, joins and analytics.", "High", "Intermediate", False),
        ("JavaScript", "Programming", "Modern ES6+ JS for web apps and dynamic interfaces.", "High", "Intermediate", False),
        ("TypeScript", "Programming", "Static typing for scalable JavaScript architectures.", "High", "Intermediate", False),
        ("Go", "Programming", "High concurrency microservices and cloud tooling.", "Medium", "Advanced", False),
        
        # Data Science & AI/ML
        ("Data Structures & Algorithms", "Data Science", "Core problem solving, time complexity and optimized data structures.", "High", "Advanced", False),
        ("Machine Learning", "AI/ML", "Supervised, unsupervised algorithms, scikit-learn and modeling.", "High", "Advanced", False),
        ("Deep Learning", "AI/ML", "Neural networks, CNNs, transformers and model training.", "High", "Advanced", False),
        ("Natural Language Processing", "AI/ML", "Text mining, tokenization, embeddings and LLM fine-tuning.", "High", "Advanced", False),
        ("Power BI", "Data Science", "Business intelligence dashboards, DAX queries and data reporting.", "High", "Intermediate", False),
        ("Tableau", "Data Science", "Interactive visual analytics and enterprise KPI tracking.", "High", "Intermediate", False),
        ("Pandas & NumPy", "Data Science", "Data manipulation, numerical computing and feature engineering.", "High", "Intermediate", False),
        ("PyTorch", "AI/ML", "Deep learning framework for tensor computation and neural architectures.", "High", "Advanced", False),
        ("Big Data Analytics", "Data Science", "Distributed processing with Spark and cloud data lakes.", "Medium", "Advanced", False),
        
        # Web & Cloud
        ("React.js", "Web Development", "Component-based UI development, hooks and state management.", "High", "Intermediate", False),
        ("Node.js", "Web Development", "Asynchronous server-side JavaScript runtime and REST APIs.", "High", "Intermediate", False),
        ("REST API Design", "Web Development", "Designing scalable, secure API endpoints with JSON standards.", "High", "Intermediate", False),
        ("Docker & Kubernetes", "Cloud", "Containerization, orchestration and microservice deployment.", "High", "Advanced", False),
        ("AWS Cloud", "Cloud", "Cloud architecture, EC2, S3, RDS, Lambda and serverless services.", "High", "Intermediate", False),
        ("Cybersecurity Fundamentals", "Cybersecurity", "Network security, OWASP top 10, encryption and auth.", "High", "Intermediate", False),
        ("Git & GitHub", "Programming", "Version control, branching strategies and collaborative workflow.", "High", "Beginner", False),
        
        # Healthcare & Ministry of Ayush / AIIA Specialized
        ("Ayurvedic Pharmacology (Dravyaguna)", "Healthcare & AYUSH", "Identification, properties, action and pharmacology of Ayurvedic medicinal herbs.", "High", "Advanced", True),
        ("Clinical Research & GCP", "Healthcare & AYUSH", "Good Clinical Practice guidelines, ethical trials and protocols.", "High", "Advanced", True),
        ("Herbal Informatics", "Healthcare & AYUSH", "Computational databases of phytocompounds, active constituents and docking.", "High", "Advanced", True),
        ("AYUSH Digital Health & Telemedicine", "Healthcare & AYUSH", "EHR standards, teleconsultation protocols and digital AYUSH portals.", "High", "Intermediate", True),
        ("Pharmacovigilance", "Healthcare & AYUSH", "Adverse drug reaction monitoring for herbal and conventional pharmaceuticals.", "High", "Intermediate", True),
        ("Biostatistics in Clinical Trials", "Healthcare & AYUSH", "Hypothesis testing, survival analysis and statistical trial validation.", "High", "Advanced", True),
        ("Medical Data Analytics", "Healthcare & AYUSH", "Electronic health record analysis, patient outcomes and clinical metrics.", "High", "Intermediate", True),
        ("Botanical Taxonomy & Standardization", "Healthcare & AYUSH", "Herbarium techniques, microscopic analysis and HPTLC fingerprinting.", "Medium", "Intermediate", True),
        ("Traditional Knowledge Digital Library (TKDL)", "Healthcare & AYUSH", "Documentation and patent search in ancient medical repositories.", "High", "Intermediate", True),
        
        # Management & Soft Skills
        ("Agile & Scrum", "Management", "Sprint planning, backlog grooming and iterative product delivery.", "High", "Beginner", False),
        ("Technical Leadership", "Management", "Team guidance, code reviews and architectural decisions.", "High", "Advanced", False),
        ("Scientific Writing & Publication", "Research", "Drafting research manuscripts, peer-review papers and patents.", "High", "Intermediate", True),
        ("Clinical Communication", "Soft Skills", "Patient-doctor communication, empathy and professional bedside manners.", "High", "Beginner", True)
    ]
    
    skill_objects = {}
    for name, cat, desc, demand, diff, is_ayush in skills_data:
        sk = Skill(
            name=name,
            category=cat,
            description=desc,
            demand_level=demand,
            difficulty_level=diff,
            is_ayush_specialized=is_ayush
        )
        db.session.add(sk)
        skill_objects[name] = sk
        
    db.session.flush()

    # ==========================================
    # 2. CAREER ROLES WITH SKILL REQUIREMENTS
    # ==========================================
    career_roles_data = [
        ("Data Analyst", "Technology & Analytics", "Transforms data into actionable insights for business and clinical intelligence.", 
         json.dumps(["Python", "SQL", "Power BI", "Pandas & NumPy", "Git & GitHub"]), "₹7 - 12 LPA", "High"),
         
        ("Ayurvedic Clinical Researcher", "Healthcare & AYUSH", "Conducts evidence-based clinical trials and pharmacological research under AYUSH protocols.", 
         json.dumps(["Clinical Research & GCP", "Ayurvedic Pharmacology (Dravyaguna)", "Biostatistics in Clinical Trials", "Medical Data Analytics", "Scientific Writing & Publication"]), "₹8 - 14 LPA", "High"),
         
        ("Full Stack AI Developer", "Software & AI", "Builds intelligent web portals, integrates LLM microservices and modern responsive frontends.", 
         json.dumps(["Python", "React.js", "REST API Design", "Machine Learning", "Docker & Kubernetes", "Git & GitHub"]), "₹10 - 18 LPA", "High"),
         
        ("Healthcare Informatics Specialist", "AYUSH & MedTech", "Bridges electronic medical records, clinical analytics and tele-AYUSH platforms.", 
         json.dumps(["Medical Data Analytics", "AYUSH Digital Health & Telemedicine", "Python", "SQL", "Cybersecurity Fundamentals"]), "₹8 - 15 LPA", "High"),
         
        ("Machine Learning Engineer", "AI/ML", "Designs scalable neural models, feature engineering pipelines and deep learning algorithms.", 
         json.dumps(["Python", "Machine Learning", "Deep Learning", "PyTorch", "Data Structures & Algorithms"]), "₹12 - 22 LPA", "High"),
         
        ("Ayurvedic Pharmacovigilance Associate", "Healthcare & Pharma", "Monitors safety profiles, drug interactions and regulatory filings for herbal therapeutics.", 
         json.dumps(["Ayurvedic Pharmacology (Dravyaguna)", "Pharmacovigilance", "Clinical Research & GCP", "Scientific Writing & Publication"]), "₹6 - 10 LPA", "Medium"),
         
        ("Cloud & DevOps Architect", "Infrastructure", "Automates CI/CD pipelines, container orchestration and multi-cloud resilience.", 
         json.dumps(["AWS Cloud", "Docker & Kubernetes", "Go", "Cybersecurity Fundamentals", "REST API Design"]), "₹12 - 24 LPA", "High"),
         
        ("Herbal Formulation & QA Analyst", "Pharma & Biotech", "Performs drug standardization, bioactive profiling and quality compliance.", 
         json.dumps(["Botanical Taxonomy & Standardization", "Herbal Informatics", "Traditional Knowledge Digital Library (TKDL)", "Scientific Writing & Publication"]), "₹7 - 11 LPA", "Medium")
    ]
    
    for title, domain, desc, req_skills, sal, demand in career_roles_data:
        cr = CareerRole(
            title=title,
            domain=domain,
            description=desc,
            required_skills=req_skills,
            typical_salary=sal,
            job_demand=demand
        )
        db.session.add(cr)

    # ==========================================
    # 3. ADMIN USER
    # ==========================================
    admin_user = User(email="admin@ayush.gov.in", role="admin")
    admin_user.set_password("admin123")
    db.session.add(admin_user)
    db.session.flush()

    # ==========================================
    # 4. INDUSTRY PARTNERS (10 Companies)
    # ==========================================
    companies_data = [
        ("AyuHealth Technologies", "careers@ayuhealthtech.com", "AYUSH & Healthcare", "51-200", "New Delhi", "https://ayuhealthtech.com", "AI-powered clinical informatics and smart healthcare automation systems."),
        ("Dabur Research & Development", "careers@dabur.com", "Pharma & AYUSH", "1000+", "Ghaziabad, NCR", "https://dabur.com", "Leading Ayurvedic formulation research, phytomedicine and wellness products."),
        ("Tata Elxsi HealthTech", "recruitment@tataelxsi.com", "IT & Software", "1000+", "Bangalore", "https://tataelxsi.com", "Pioneering digital health platforms, embedded medical IoT and diagnostic AI."),
        ("Patanjali Research Foundation", "hr@patanjali.org", "AYUSH & Healthcare", "500-1000", "Haridwar", "https://patanjali.org", "Advanced genomic, pharmacological and clinical research in classical Ayurveda."),
        ("Apollo AYUSH Research Wing", "jobs@apolloayush.com", "Clinical Research", "1000+", "New Delhi", "https://apolloayush.com", "Integrative medical trials combining modern evidence-based medicine with AYUSH protocols."),
        ("Himalaya Wellness R&D", "talent@himalayawellness.com", "Pharma & Biotech", "1000+", "Bangalore", "https://himalayawellness.com", "Scientifically validated herbal therapeutics, phytochemical extraction and global wellness."),
        ("Zandu Bio-Sciences", "careers@zandubio.com", "Pharma & AYUSH", "201-500", "Mumbai", "https://zandu.com", "Standardized botanical extracts, modern clinical pharmacology and drug delivery."),
        ("Infosys Life Sciences Labs", "ayush-careers@infosys.com", "IT & Software", "1000+", "Pune", "https://infosys.com", "Enterprise healthcare data platforms, clinical cloud storage and analytics."),
        ("Biocon AyurSciences", "talent@biocon.com", "Biotech & Pharma", "1000+", "Bangalore", "https://biocon.com", "Biotechnology, therapeutic discovery and statistical clinical trials."),
        ("Tech Mahindra MedTech AI", "careers@techmahindra.com", "AI/ML & Software", "1000+", "Hyderabad", "https://techmahindra.com", "Smart automation for hospital workflows, NLP for medical summaries and tele-health.")
    ]
    
    industry_objs = []
    for cname, email, sector, size, loc, web, desc in companies_data:
        u = User(email=email, role="industry")
        u.set_password("industry123")
        db.session.add(u)
        db.session.flush()
        
        ind = Industry(
            user_id=u.id,
            company_name=cname,
            official_email=email,
            sector=sector,
            company_size=size,
            location=loc,
            website=web,
            description=desc,
            verified=True
        )
        db.session.add(ind)
        industry_objs.append(ind)
        
    db.session.flush()

    # ==========================================
    # 5. ACADEMICIANS (10 Faculty & Deans)
    # ==========================================
    academicians_data = [
        ("Dr. Priya Sharma", "priya.sharma@aiia.gov.in", "All India Institute of Ayurveda (AIIA), New Delhi", "Dravyaguna & Clinical Pharmacology", "Professor & Head of Research", "Ayurvedic Pharmacology, Clinical Trials, Herbal Informatics, AI in Medicine", "Leading clinical validation of traditional medicines and AI-driven skill mapping."),
        ("Prof. Rajeshwar Kulkarni", "rajeshwar.k@bhu.ac.in", "Banaras Hindu University (BHU), Varanasi", "Faculty of Ayurveda", "Dean & Senior Professor", "Ayurvedic Medicine, Research Methodology, Traditional Knowledge", "Dedicated to modernizing AYUSH curricula with industry standards."),
        ("Dr. Sunita Deshmukh", "director@nia.edu.in", "National Institute of Ayurveda (NIA), Jaipur", "Panchakarma & Clinical Medicine", "Director & Professor", "Clinical Protocols, Digital Health Integration", "Fostering nationwide academia-industry MoUs for student clinical exposure."),
        ("Prof. Arvind Sen", "arvind.sen@iitd.ac.in", "Indian Institute of Technology (IIT) Delhi", "Computer Science & Engineering", "Professor & Placement Advisor", "Machine Learning, HealthTech AI, Big Data Analytics", "Advising national portals on smart automation and recommendation algorithms."),
        ("Dr. Meenakshi Sundaram", "meenakshi.s@aiia.gov.in", "All India Institute of Ayurveda (AIIA)", "Pharmacovigilance & Quality Assurance", "Associate Professor", "Pharmacovigilance, Botanical Standardization, GCP", "Directing pharmacovigilance training centers under Ministry of Ayush."),
        ("Dr. Harish Rao", "harish.rao@gau.ac.in", "Gujarat Ayurved University, Jamnagar", "Dravyaguna & Phytochemistry", "Dean of Academic Affairs", "Phytochemistry, Herbal Informatics, Student Internships", "Coordinating industry internships and industrial plant training."),
        ("Dr. Kavita Iyer", "kavita.iyer@dtu.ac.in", "Delhi Technological University (DTU)", "Information Technology", "Training & Placement Officer", "Data Analytics, Enterprise Systems, Full Stack Web", "Bridging engineering graduates with MedTech and software innovators."),
        ("Prof. Suresh Namboodiri", "suresh.n@jamiahamdard.ac.in", "Jamia Hamdard University, New Delhi", "School of Pharmaceutical Education & Research", "Professor", "Herbal Drug Standardization, Bioavailability, Scientific Writing", "Guiding postgraduate researchers in collaborative industrial capstones."),
        ("Dr. Vandana Hegde", "vandana.h@aiia.gov.in", "All India Institute of Ayurveda (AIIA)", "Ayurvedic Informatics & Digital Health", "Assistant Professor", "AYUSH Digital Health, Telemedicine, Medical Data Analytics", "Developing automated health monitoring systems."),
        ("Prof. Alok Mathur", "alok.mathur@aicte-india.org", "AICTE-AYUSH Joint Skill Committee", "Smart Automation & Skill Planning", "Chairperson", "Curriculum Design, Skill Mapping, Industry Alignment", "Overseeing nationwide national skill framework benchmarks.")
    ]
    
    academic_objs = []
    for name, email, inst, dept, desig, exp, bio in academicians_data:
        u = User(email=email, role="academician")
        u.set_password("faculty123")
        db.session.add(u)
        db.session.flush()
        
        acad = Academician(
            user_id=u.id,
            name=name,
            institution=inst,
            department=dept,
            designation=desig,
            expertise_areas=exp,
            bio=bio
        )
        db.session.add(acad)
        academic_objs.append(acad)
        
    db.session.flush()

    # ==========================================
    # 6. STUDENTS (20 Candidates with Diverse Profiles)
    # ==========================================
    students_data = [
        ("Rahul Sharma", "rahul.sharma@aiia.gov.in", "All India Institute of Ayurveda & DTU", "B.Tech + Health Informatics", "Data Science & AYUSH Informatics", "3rd Year", 8.85, "Data Analyst", "Data Analyst", "Passionate about combining data analytics, Python and healthcare informatics to solve real-world problems.", "New Delhi",
         [("Python", "Advanced", 5), ("SQL", "Intermediate", 4), ("C++", "Intermediate", 3), ("Pandas & NumPy", "Advanced", 4), ("Git & GitHub", "Intermediate", 4), ("Medical Data Analytics", "Intermediate", 3)]),
         
        ("Ananya Verma", "ananya.v@aiia.gov.in", "All India Institute of Ayurveda, New Delhi", "BAMS (Ayurvedic Medicine & Surgery)", "Ayurvedic Pharmacology", "4th Year", 9.15, "Ayurvedic Clinical Researcher", "Ayurvedic Clinical Researcher", "Specializing in evidence-based herbal pharmacology, clinical documentation and trial protocols.", "New Delhi",
         [("Ayurvedic Pharmacology (Dravyaguna)", "Advanced", 5), ("Clinical Research & GCP", "Advanced", 5), ("Herbal Informatics", "Intermediate", 4), ("Scientific Writing & Publication", "Advanced", 4), ("Traditional Knowledge Digital Library (TKDL)", "Intermediate", 4)]),
         
        ("Rohan Gupta", "rohan.g@iitd.ac.in", "Indian Institute of Technology (IIT) Delhi", "B.Tech", "Computer Science & Engineering", "Final Year", 8.92, "Machine Learning Engineer", "Machine Learning Engineer", "Focusing on deep learning algorithms, computer vision and PyTorch architectures.", "New Delhi",
         [("Python", "Advanced", 5), ("Machine Learning", "Advanced", 5), ("Deep Learning", "Advanced", 5), ("PyTorch", "Advanced", 4), ("Data Structures & Algorithms", "Advanced", 5), ("Docker & Kubernetes", "Intermediate", 3)]),
         
        ("Sneha Patel", "sneha.p@jamiahamdard.ac.in", "Jamia Hamdard, New Delhi", "M.Pharm", "Herbal Drug Technology", "Final Year", 8.70, "Herbal Formulation & QA Analyst", "Herbal Formulation & QA Analyst", "Researcher in phytochemical standardisation and modern chromatographic quality assurance.", "New Delhi",
         [("Botanical Taxonomy & Standardization", "Advanced", 5), ("Pharmacovigilance", "Advanced", 4), ("Herbal Informatics", "Intermediate", 4), ("Clinical Research & GCP", "Intermediate", 4)]),
         
        ("Priya Nair", "priya.nair@nia.edu.in", "National Institute of Ayurveda, Jaipur", "BAMS", "Ayurvedic Medicine", "3rd Year", 8.40, "Healthcare Informatics Specialist", "Healthcare Informatics Specialist", "Enthusiastic about digital health records, AYUSH telemedicine and patient wellness analytics.", "Jaipur",
         [("AYUSH Digital Health & Telemedicine", "Intermediate", 4), ("Medical Data Analytics", "Intermediate", 3), ("Ayurvedic Pharmacology (Dravyaguna)", "Advanced", 4), ("Clinical Communication", "Advanced", 5)]),
         
        ("Aditya Singh", "aditya.s@dtu.ac.in", "Delhi Technological University (DTU)", "B.Tech", "Information Technology", "Final Year", 8.55, "Full Stack AI Developer", "Full Stack AI Developer", "Full stack engineer experienced in React.js, Python Flask backends and microservice integrations.", "New Delhi",
         [("React.js", "Advanced", 5), ("Python", "Advanced", 4), ("REST API Design", "Advanced", 4), ("JavaScript", "Advanced", 5), ("SQL", "Intermediate", 4), ("Git & GitHub", "Advanced", 5)]),
         
        ("Pooja Mehra", "pooja.m@bhu.ac.in", "Banaras Hindu University (BHU)", "MD (Ayurveda)", "Dravyaguna Vigyana", "2nd Year", 9.05, "Ayurvedic Pharmacovigilance Associate", "Ayurvedic Pharmacovigilance Associate", "Conducting advanced pharmacological screenings and ADR monitoring of traditional herbs.", "Varanasi",
         [("Ayurvedic Pharmacology (Dravyaguna)", "Advanced", 5), ("Pharmacovigilance", "Advanced", 5), ("Biostatistics in Clinical Trials", "Intermediate", 3), ("Scientific Writing & Publication", "Advanced", 4)]),
         
        ("Amit Kumar", "amit.k@nsut.ac.in", "Netaji Subhas University of Technology (NSUT)", "B.Tech", "Software Engineering", "3rd Year", 7.85, "Cloud & DevOps Architect", "Cloud & DevOps Architect", "Cloud computing enthusiast skilled in AWS, container orchestration and Linux systems.", "New Delhi",
         [("AWS Cloud", "Intermediate", 4), ("Docker & Kubernetes", "Intermediate", 4), ("Go", "Beginner", 2), ("REST API Design", "Intermediate", 3), ("Git & GitHub", "Advanced", 4)]),
         
        ("Neha Joshi", "neha.j@gau.ac.in", "Gujarat Ayurved University, Jamnagar", "BAMS", "Ayurveda Medicine", "Final Year", 8.65, "Ayurvedic Clinical Researcher", "Ayurvedic Clinical Researcher", "Eager to apply clinical research protocols in integrative healthcare institutions.", "Jamnagar",
         [("Clinical Research & GCP", "Advanced", 4), ("Ayurvedic Pharmacology (Dravyaguna)", "Advanced", 4), ("Scientific Writing & Publication", "Intermediate", 3), ("Clinical Communication", "Advanced", 5)]),
         
        ("Vikram Malhotra", "vikram.m@iiitd.ac.in", "IIIT Delhi", "B.Tech", "Computer Science & Artificial Intelligence", "3rd Year", 8.78, "Machine Learning Engineer", "Machine Learning Engineer", "Developing NLP models for summarising biomedical literature and automated translation.", "New Delhi",
         [("Python", "Advanced", 5), ("Natural Language Processing", "Advanced", 4), ("Machine Learning", "Advanced", 4), ("Data Structures & Algorithms", "Advanced", 4), ("Pandas & NumPy", "Advanced", 4)]),
         
        ("Deepak Chawla", "deepak.c@aiia.gov.in", "All India Institute of Ayurveda", "BAMS", "Ayurvedic Pharmacology", "2nd Year", 8.10, "Healthcare Informatics Specialist", "Healthcare Informatics Specialist", "Exploring informatics tools for botanical cataloguing.", "New Delhi",
         [("Ayurvedic Pharmacology (Dravyaguna)", "Intermediate", 3), ("Traditional Knowledge Digital Library (TKDL)", "Intermediate", 3), ("Python", "Beginner", 2)]),
         
        ("Tanvi Saxena", "tanvi.s@dtu.ac.in", "DTU Delhi", "B.Tech", "Computer Engineering", "3rd Year", 8.42, "Data Analyst", "Data Analyst", "Data enthusiast working with Power BI and SQL for business dashboards.", "New Delhi",
         [("SQL", "Advanced", 4), ("Power BI", "Advanced", 4), ("Python", "Intermediate", 3), ("Pandas & NumPy", "Intermediate", 3)]),
         
        ("Kavish Mehta", "kavish.m@iitd.ac.in", "IIT Delhi", "B.Tech", "Electrical & Electronics", "Final Year", 8.30, "Cloud & DevOps Architect", "Cloud & DevOps Architect", "Interested in IoT sensor cloud integration and telemetry.", "New Delhi",
         [("C++", "Advanced", 4), ("AWS Cloud", "Intermediate", 3), ("Python", "Intermediate", 3)]),
         
        ("Sonal Deshpande", "sonal.d@bhu.ac.in", "BHU Varanasi", "BAMS", "Ayurveda", "3rd Year", 8.50, "Ayurvedic Clinical Researcher", "Ayurvedic Clinical Researcher", "Interested in clinical trial management and ethical protocols.", "Varanasi",
         [("Clinical Research & GCP", "Advanced", 4), ("Biostatistics in Clinical Trials", "Intermediate", 3), ("Ayurvedic Pharmacology (Dravyaguna)", "Advanced", 4)]),
         
        ("Manish Rawat", "manish.r@jamiahamdard.ac.in", "Jamia Hamdard", "BCA", "Computer Applications", "3rd Year", 7.60, "Full Stack AI Developer", "Full Stack AI Developer", "Frontend developer building web applications with React.", "New Delhi",
         [("JavaScript", "Advanced", 4), ("React.js", "Intermediate", 3), ("Node.js", "Intermediate", 3)]),
         
        ("Ritu Aggarwal", "ritu.a@nia.edu.in", "NIA Jaipur", "BAMS", "Ayurvedic Medicine", "Final Year", 8.90, "Ayurvedic Pharmacovigilance Associate", "Ayurvedic Pharmacovigilance Associate", "Researching herb-drug interactions.", "Jaipur",
         [("Pharmacovigilance", "Advanced", 4), ("Ayurvedic Pharmacology (Dravyaguna)", "Advanced", 4), ("Scientific Writing & Publication", "Intermediate", 3)]),
         
        ("Harsh Vardhan", "harsh.v@dtu.ac.in", "DTU Delhi", "B.Tech", "Software Engineering", "2nd Year", 8.20, "Data Analyst", "Data Analyst", "Learning data analysis and statistical modeling.", "New Delhi",
         [("Python", "Intermediate", 3), ("SQL", "Intermediate", 3), ("Data Structures & Algorithms", "Intermediate", 3)]),
         
        ("Divya Reddy", "divya.r@gau.ac.in", "Gujarat Ayurved University", "BAMS", "Ayurveda", "3rd Year", 8.35, "Healthcare Informatics Specialist", "Healthcare Informatics Specialist", "Exploring telemedicine apps for rural healthcare.", "Jamnagar",
         [("AYUSH Digital Health & Telemedicine", "Intermediate", 4), ("Clinical Communication", "Advanced", 4)]),
         
        ("Varun Singhal", "varun.s@iiitd.ac.in", "IIIT Delhi", "M.Tech", "Data Science", "Final Year", 9.20, "Machine Learning Engineer", "Machine Learning Engineer", "Focusing on graph neural networks for biological compounds.", "New Delhi",
         [("Python", "Advanced", 5), ("Deep Learning", "Advanced", 5), ("PyTorch", "Advanced", 5), ("Machine Learning", "Advanced", 5), ("Herbal Informatics", "Intermediate", 3)]),
         
        ("Megha Kapoor", "megha.k@aiia.gov.in", "AIIA New Delhi", "BAMS", "Ayurvedic Pharmacology", "4th Year", 8.75, "Herbal Formulation & QA Analyst", "Herbal Formulation & QA Analyst", "Standardization and quality testing of polyherbal formulations.", "New Delhi",
         [("Botanical Taxonomy & Standardization", "Advanced", 4), ("Ayurvedic Pharmacology (Dravyaguna)", "Advanced", 4), ("Herbal Informatics", "Intermediate", 3)])
    ]
    
    student_objs = []
    for sname, semail, scollege, scourse, sbranch, syear, scgpa, c_interest, t_role, sbio, sloc, sskills in students_data:
        u = User(email=semail, role="student")
        u.set_password("student123")
        db.session.add(u)
        db.session.flush()
        
        std = Student(
            user_id=u.id,
            name=sname,
            phone="+91 98765 43210",
            college=scollege,
            course=scourse,
            branch=sbranch,
            year=syear,
            cgpa=scgpa,
            career_interest=c_interest,
            target_role=t_role,
            bio=sbio,
            location=sloc,
            resume_url="/resumes/sample_student_resume.pdf"
        )
        db.session.add(std)
        db.session.flush()
        
        # Add skills
        for sk_name, prof, rating in sskills:
            if sk_name in skill_objects:
                ss = StudentSkill(
                    student_id=std.id,
                    skill_id=skill_objects[sk_name].id,
                    proficiency_level=prof,
                    rating=rating,
                    verified=True,
                    endorsements=rating
                )
                db.session.add(ss)
                
        student_objs.append(std)
        
    db.session.flush()

    # ==========================================
    # 7. OPPORTUNITIES (12 Internships + 12 Jobs)
    # ==========================================
    opportunities_data = [
        # Internships
        (0, "internship", "Data Analyst & Clinical Informatics Intern", "Clinical Analytics",
         "Assist the healthcare informatics team in cleaning, transforming and visualizing electronic patient outcomes and clinical trial metrics using Python and Power BI.",
         json.dumps(["Python", "SQL", "Power BI", "Pandas & NumPy"]), json.dumps(["Medical Data Analytics", "Git & GitHub"]),
         "Data Science, CSE, IT, Health Informatics, BAMS", 7.0, "Fresher", "New Delhi (Near AIIA)", "Hybrid", "₹25,000 / month", "6 Months", 4, "2026-10-15"),
         
        (0, "internship", "Full Stack Web & AI Intern", "Engineering",
         "Develop interactive user interfaces for our national healthcare portal using React.js and assist in creating Flask/FastAPI AI microservices.",
         json.dumps(["React.js", "Python", "REST API Design", "JavaScript"]), json.dumps(["Docker & Kubernetes", "Git & GitHub"]),
         "CSE, IT, Software Engineering", 7.5, "Fresher", "New Delhi", "Remote", "₹30,000 / month", "3 Months", 3, "2026-10-20"),
         
        (1, "internship", "Ayurvedic Phytomedicine Research Intern", "R&D Labs",
         "Conduct lab trials on polyherbal extractions, phytochemical screening and document compliance with pharmacopoeial standards.",
         json.dumps(["Ayurvedic Pharmacology (Dravyaguna)", "Botanical Taxonomy & Standardization", "Scientific Writing & Publication"]), json.dumps(["Herbal Informatics"]),
         "BAMS, MD Ayurveda, M.Pharm, Biotechnology", 7.5, "Fresher", "Ghaziabad, NCR", "On-site", "₹22,000 / month", "6 Months", 5, "2026-11-01"),
         
        (2, "internship", "HealthTech Embedded & IoT Intern", "Product Engineering",
         "Implement real-time sensor processing pipelines for non-invasive medical diagnostic devices using C++ and Python.",
         json.dumps(["C++", "Python", "Data Structures & Algorithms"]), json.dumps(["AWS Cloud"]),
         "CSE, ECE, Bio-Medical, IT", 8.0, "Fresher", "Bangalore", "Hybrid", "₹35,000 / month", "6 Months", 2, "2026-10-25"),
         
        (3, "internship", "Herbal Pharmacogenomics Research Trainee", "Genomics Lab",
         "Screen traditional botanical formulations against molecular pathways using computational docking tools and literature databases.",
         json.dumps(["Herbal Informatics", "Traditional Knowledge Digital Library (TKDL)", "Clinical Research & GCP"]), json.dumps(["Scientific Writing & Publication"]),
         "BAMS, M.Tech Bioinformatics, M.Sc Biotechnology", 7.5, "Fresher", "Haridwar", "On-site", "₹24,000 / month", "6 Months", 4, "2026-10-30"),
         
        (4, "internship", "Clinical Trials Coordinator Intern", "Clinical Trials Unit",
         "Support Phase II/III clinical trial data entry, patient follow-up documentation and compliance with Good Clinical Practice guidelines.",
         json.dumps(["Clinical Research & GCP", "Biostatistics in Clinical Trials", "Medical Data Analytics"]), json.dumps(["Clinical Communication"]),
         "BAMS, MBBS, M.Pharm, Life Sciences", 7.0, "Fresher", "New Delhi", "On-site", "₹26,000 / month", "6 Months", 3, "2026-11-05"),
         
        (5, "internship", "Botanical Quality Assurance Intern", "Quality Compliance",
         "Perform high-performance thin-layer chromatography (HPTLC) and physical standardization of raw herbal materials.",
         json.dumps(["Botanical Taxonomy & Standardization", "Ayurvedic Pharmacology (Dravyaguna)"]), json.dumps(["Pharmacovigilance"]),
         "BAMS, B.Pharm, Chemistry", 7.0, "Fresher", "Bangalore", "On-site", "₹20,000 / month", "3 Months", 4, "2026-10-18"),
         
        (6, "internship", "Pharmacovigilance & Safety Data Associate Intern", "Safety Operations",
         "Triage and document adverse event notifications, conduct causal assessments and assist in preparing monthly safety regulatory summaries.",
         json.dumps(["Pharmacovigilance", "Clinical Research & GCP", "Ayurvedic Pharmacology (Dravyaguna)"]), json.dumps(["Scientific Writing & Publication"]),
         "BAMS, B.Pharm, M.Pharm", 7.2, "Fresher", "Mumbai", "Hybrid", "₹23,000 / month", "6 Months", 3, "2026-11-10"),
         
        (7, "internship", "Cloud Data Pipelines Intern", "Cloud Center of Excellence",
         "Build scalable data ingestion pipelines and manage database infrastructure using SQL, Python and AWS cloud services.",
         json.dumps(["Python", "SQL", "AWS Cloud"]), json.dumps(["Docker & Kubernetes", "Git & GitHub"]),
         "All Engineering Branches", 7.0, "Fresher", "Pune", "Remote", "₹28,000 / month", "3 Months", 5, "2026-10-22"),
         
        (8, "internship", "Biostatistics & Healthcare Analytics Intern", "Biometrics",
         "Analyze survival data, perform statistical significance testing and generate regulatory reports for clinical studies.",
         json.dumps(["Biostatistics in Clinical Trials", "Python", "SQL"]), json.dumps(["Pandas & NumPy"]),
         "Statistics, Data Science, Health Informatics, BAMS", 7.5, "Fresher", "Bangalore", "Hybrid", "₹32,000 / month", "6 Months", 2, "2026-10-28"),
         
        (9, "internship", "NLP & Medical Document Processing Intern", "AI Research",
         "Fine-tune NLP models to extract clinical entities from multilingual medical records and historical Ayurvedic classical texts.",
         json.dumps(["Python", "Natural Language Processing", "Machine Learning"]), json.dumps(["PyTorch", "Traditional Knowledge Digital Library (TKDL)"]),
         "CSE, IT, AI & Data Science", 8.0, "Fresher", "Hyderabad", "Hybrid", "₹35,000 / month", "6 Months", 3, "2026-11-12"),
         
        (0, "internship", "AYUSH Tele-Health Mobile & Web Intern", "Digital Experience",
         "Build intuitive patient tele-consultation interfaces adhering to national digital health ecosystem (ABDM) standards.",
         json.dumps(["React.js", "JavaScript", "AYUSH Digital Health & Telemedicine"]), json.dumps(["REST API Design"]),
         "Computer Science, IT, MCA", 7.0, "Fresher", "New Delhi", "Remote", "₹25,000 / month", "4 Months", 3, "2026-10-31"),

        # Full Time Jobs
        (0, "job", "Junior Clinical Data Analyst", "Health Analytics",
         "Lead the deployment of automated clinical dashboards, validate multi-center trial data and create executive KPI visualizations.",
         json.dumps(["Python", "SQL", "Power BI", "Pandas & NumPy", "Medical Data Analytics"]), json.dumps(["Clinical Research & GCP", "Git & GitHub"]),
         "Data Science, CSE, Health Informatics, BAMS", 7.5, "0-2 years", "New Delhi", "Hybrid", "₹8.5 - 12.0 LPA", "Full Time", 2, "2026-11-15"),
         
        (1, "job", "Ayurvedic Drug Discovery & Formulation Scientist", "R&D",
         "Formulate next-generation standardized polyherbal compounds and direct preclinical pharmacology validation studies.",
         json.dumps(["Ayurvedic Pharmacology (Dravyaguna)", "Herbal Informatics", "Clinical Research & GCP", "Scientific Writing & Publication"]), json.dumps(["Botanical Taxonomy & Standardization"]),
         "MD Ayurveda, Ph.D. Phytochemistry, M.Pharm", 8.0, "1-3 years", "Ghaziabad, NCR", "On-site", "₹9.0 - 15.0 LPA", "Full Time", 3, "2026-11-20"),
         
        (2, "job", "Associate Machine Learning Engineer (Healthcare)", "AI Systems",
         "Deploy deep learning models on edge devices for real-time patient monitoring and diagnostic support.",
         json.dumps(["Python", "Machine Learning", "Deep Learning", "PyTorch", "Data Structures & Algorithms"]), json.dumps(["Docker & Kubernetes", "AWS Cloud"]),
         "B.Tech/M.Tech CSE, IT, Data Science", 8.0, "0-2 years", "Bangalore", "Hybrid", "₹12.0 - 18.0 LPA", "Full Time", 4, "2026-11-25"),
         
        (3, "job", "Clinical Research Associate (AYUSH)", "Integrative Medicine",
         "Oversee clinical trial site initiation, monitoring and regulatory audit readiness across national AYUSH hospital networks.",
         json.dumps(["Clinical Research & GCP", "Biostatistics in Clinical Trials", "Scientific Writing & Publication"]), json.dumps(["Ayurvedic Pharmacology (Dravyaguna)"]),
         "BAMS, MD Ayurveda, M.Sc Clinical Research", 7.5, "1-2 years", "Haridwar", "On-site", "₹7.5 - 11.0 LPA", "Full Time", 2, "2026-11-30"),
         
        (4, "job", "Digital Health Solutions Architect", "Enterprise Solutions",
         "Design scalable architectures for tele-health, electronic health record interoperability and Ayushman Bharat Digital Mission compliance.",
         json.dumps(["AYUSH Digital Health & Telemedicine", "AWS Cloud", "Cybersecurity Fundamentals", "REST API Design"]), json.dumps(["Agile & Scrum"]),
         "B.Tech CSE/IT, MCA", 7.5, "2-4 years", "New Delhi", "Hybrid", "₹14.0 - 22.0 LPA", "Full Time", 2, "2026-12-05"),
         
        (5, "job", "Herbal Pharmacovigilance Specialist", "Medical Safety",
         "Manage safety signal detection, author periodic safety update reports (PSURs) and coordinate with national regulatory bodies.",
         json.dumps(["Pharmacovigilance", "Ayurvedic Pharmacology (Dravyaguna)", "Clinical Research & GCP", "Scientific Writing & Publication"]), json.dumps(["Medical Data Analytics"]),
         "BAMS, MD Ayurveda, M.Pharm", 7.5, "1-3 years", "Bangalore", "Hybrid", "₹8.0 - 13.0 LPA", "Full Time", 2, "2026-11-18"),
         
        (6, "job", "Quality Control & Phytochemical Analyst", "Analytical Labs",
         "Lead analytical validation protocols using HPLC, GC-MS and spectrophotometry for export-grade herbal extracts.",
         json.dumps(["Botanical Taxonomy & Standardization", "Ayurvedic Pharmacology (Dravyaguna)"]), json.dumps(["Herbal Informatics"]),
         "M.Pharm, M.Sc Chemistry, MD Dravyaguna", 7.8, "1-3 years", "Mumbai", "On-site", "₹7.0 - 11.5 LPA", "Full Time", 3, "2026-11-22"),
         
        (7, "job", "Cloud DevOps & Reliability Engineer", "Cloud Infrastructure",
         "Automate zero-downtime deployments, Kubernetes clusters and infrastructure-as-code for high-availability healthcare services.",
         json.dumps(["AWS Cloud", "Docker & Kubernetes", "Python", "Go", "Git & GitHub"]), json.dumps(["Cybersecurity Fundamentals"]),
         "B.Tech CSE/IT", 7.5, "1-3 years", "Pune", "Remote", "₹11.0 - 17.0 LPA", "Full Time", 3, "2026-12-01"),
         
        (8, "job", "Senior Biostatistician", "Clinical Analytics",
         "Design sample size calculations, randomization schemes and statistical analysis plans (SAPs) for drug approval dossiers.",
         json.dumps(["Biostatistics in Clinical Trials", "Python", "SQL", "Pandas & NumPy"]), json.dumps(["Clinical Research & GCP"]),
         "M.Sc/Ph.D. Statistics, Health Informatics", 8.0, "2-4 years", "Bangalore", "Hybrid", "₹12.0 - 19.0 LPA", "Full Time", 2, "2026-12-10"),
         
        (9, "job", "AI & NLP Research Engineer", "Cognitive Health",
         "Develop conversational agents and information extraction systems for healthcare practitioners and patient triage.",
         json.dumps(["Python", "Natural Language Processing", "Machine Learning", "PyTorch"]), json.dumps(["REST API Design"]),
         "B.Tech/M.Tech CSE/AI", 8.2, "1-3 years", "Hyderabad", "Hybrid", "₹13.0 - 20.0 LPA", "Full Time", 2, "2026-12-15"),
         
        (0, "job", "Full Stack Software Engineer", "Core Engineering",
         "Build scalable frontend and backend features for national healthcare and skill management portals.",
         json.dumps(["React.js", "Python", "SQL", "REST API Design", "Git & GitHub"]), json.dumps(["AWS Cloud", "TypeScript"]),
         "B.Tech CSE/IT, MCA", 7.5, "1-3 years", "New Delhi", "Hybrid", "₹9.0 - 14.0 LPA", "Full Time", 3, "2026-11-28"),
         
        (1, "job", "Regulatory Affairs & Patent Associate (AYUSH)", "IP & Legal",
         "Evaluate patent databases, TKDL prior-art searches and author regulatory dossiers for global product registrations.",
         json.dumps(["Traditional Knowledge Digital Library (TKDL)", "Ayurvedic Pharmacology (Dravyaguna)", "Scientific Writing & Publication"]), json.dumps(["Clinical Research & GCP"]),
         "BAMS, M.Pharm, LLB/Patent Agent", 7.5, "1-3 years", "Ghaziabad, NCR", "On-site", "₹8.0 - 13.5 LPA", "Full Time", 2, "2026-12-08")
    ]
    
    opp_objs = []
    for ind_idx, otype, otitle, odept, odesc, req_s, pref_s, branch, min_c, exp_lvl, oloc, wmode, sal, dur, open_c, dline in opportunities_data:
        industry_record = industry_objs[ind_idx]
        opp = Opportunity(
            industry_id=industry_record.id,
            type=otype,
            title=otitle,
            department=odept,
            description=odesc,
            required_skills=req_s,
            preferred_skills=pref_s,
            branch_eligibility=branch,
            min_cgpa=min_c,
            experience_level=exp_lvl,
            location=oloc,
            work_mode=wmode,
            stipend_salary=sal,
            duration=dur,
            openings=open_c,
            deadline=dline,
            status='active'
        )
        db.session.add(opp)
        opp_objs.append(opp)
        
    db.session.flush()

    # ==========================================
    # 8. SAMPLE APPLICATIONS (Across Stages)
    # ==========================================
    # Rahul Sharma (Student 0) applied to Data Analyst Intern (Opp 0) and Full Stack AI Intern (Opp 1)
    app1 = Application(
        opportunity_id=opp_objs[0].id, # Data Analyst & Clinical Informatics Intern at AyuHealth Tech
        student_id=student_objs[0].id, # Rahul Sharma
        match_score=92.5,
        match_breakdown=json.dumps({
            'skill_match_percent': 92.0,
            'education_match_percent': 100.0,
            'experience_match_percent': 90.0,
            'interest_match_percent': 100.0,
            'location_match_percent': 100.0,
            'cgpa_match_percent': 95.0,
            'matched_skills': [{'name': 'Python', 'proficiency': 'Advanced', 'rating': 5, 'match_type': 'Full'}, {'name': 'SQL', 'proficiency': 'Intermediate', 'rating': 4, 'match_type': 'Full'}, {'name': 'Pandas & NumPy', 'proficiency': 'Advanced', 'rating': 4, 'match_type': 'Full'}],
            'partially_matched_skills': [],
            'missing_skills': ['Power BI'],
            'summary': '3 of 4 required skills matched fully with high proficiency.'
        }),
        status='interview',
        cover_note='Excited to apply my data analytics and Python skills in clinical informatics at AyuHealth Tech.'
    )
    db.session.add(app1)
    db.session.flush()
    
    # Schedule Interview for Rahul
    intv1 = Interview(
        application_id=app1.id,
        scheduled_at="2026-09-18 15:00 IST",
        meeting_link="https://meet.google.com/ayush-sih-interview",
        mode="Online Video (Google Meet)",
        notes="Technical discussion on clinical data pipeline automation and portfolio review.",
        status="scheduled"
    )
    db.session.add(intv1)
    
    # Ananya Verma applied to Ayurvedic Phytomedicine Research Intern at Dabur
    app2 = Application(
        opportunity_id=opp_objs[2].id,
        student_id=student_objs[1].id, # Ananya
        match_score=96.0,
        match_breakdown=json.dumps({
            'skill_match_percent': 98.0,
            'education_match_percent': 100.0,
            'experience_match_percent': 100.0,
            'interest_match_percent': 100.0,
            'location_match_percent': 100.0,
            'cgpa_match_percent': 98.0,
            'summary': 'Exceptional fit across Dravyaguna and clinical writing requirements.'
        }),
        status='shortlisted',
        cover_note='Eager to contribute to Dabur herbal formulation trials.'
    )
    db.session.add(app2)
    
    # Rohan Gupta applied to HealthTech IoT Intern at Tata Elxsi
    app3 = Application(
        opportunity_id=opp_objs[3].id,
        student_id=student_objs[2].id, # Rohan
        match_score=88.5,
        match_breakdown=json.dumps({
            'skill_match_percent': 85.0,
            'education_match_percent': 100.0,
            'experience_match_percent': 100.0,
            'interest_match_percent': 90.0,
            'location_match_percent': 85.0,
            'cgpa_match_percent': 95.0,
            'summary': 'Strong C++ and algorithmic foundation.'
        }),
        status='applied',
        cover_note='Keen to work on embedded health algorithms.'
    )
    db.session.add(app3)

    # Sneha Patel applied to Botanical Quality Assurance at Himalaya
    app4 = Application(
        opportunity_id=opp_objs[6].id,
        student_id=student_objs[3].id,
        match_score=94.0,
        status='selected',
        cover_note='Ready to join Himalaya quality compliance lab.'
    )
    db.session.add(app4)

    # ==========================================
    # 9. COLLABORATION REQUESTS
    # ==========================================
    collab1 = Collaboration(
        industry_id=industry_objs[0].id, # AyuHealth Tech
        academician_id=academic_objs[0].id, # Dr. Priya Sharma - AIIA
        initiator_role="industry",
        type="workshop",
        title="Hands-on Workshop: Clinical Data Science & Power BI in AYUSH",
        description="AyuHealth Technologies proposes a 3-day intensive workshop for 3rd and 4th-year students to bridge the Power BI and clinical data transformation gap.",
        target_topics="Power BI, Clinical Dashboards, Python for Electronic Health Records",
        proposed_date="2026-10-10",
        status="accepted",
        response_note="Approved by Academic Council. Seminar Hall B reserved."
    )
    db.session.add(collab1)
    
    collab2 = Collaboration(
        industry_id=industry_objs[1].id, # Dabur R&D
        academician_id=academic_objs[0].id, # Dr. Priya Sharma
        initiator_role="academician",
        type="internship_partnership",
        title="Annual Winter Industrial Internship Drive 2026",
        description="All India Institute of Ayurveda requests dedicated slots for 15 postgraduate Dravyaguna and Pharmacology scholars at Dabur Ghaziabad research laboratories.",
        target_topics="Phytochemical extraction, standardization, GMP quality compliance",
        proposed_date="2026-11-01",
        status="pending"
    )
    db.session.add(collab2)
    
    collab3 = Collaboration(
        industry_id=industry_objs[2].id, # Tata Elxsi
        academician_id=academic_objs[3].id, # Prof. Arvind Sen - IIT Delhi
        initiator_role="industry",
        type="research_collaboration",
        title="Joint Research MoU: AI in Medical Diagnostics",
        description="Collaborative research initiative to co-develop lightweight edge AI models for diagnostic telemetry.",
        target_topics="Embedded AI, PyTorch, Diagnostic Signal Processing",
        proposed_date="2026-12-01",
        status="accepted",
        response_note="MoU signed. Joint research lab initiated."
    )
    db.session.add(collab3)

    # ==========================================
    # 10. NOTIFICATIONS
    # ==========================================
    # Student Rahul Sharma Notifications
    notif1 = Notification(
        user_id=student_objs[0].user_id,
        title="📅 Interview Scheduled: Data Analyst Intern",
        message="AyuHealth Technologies has scheduled your interview for 'Data Analyst & Clinical Informatics Intern' on 2026-09-18 15:00 IST via Google Meet.",
        type="interview",
        action_url="/student/applications"
    )
    notif2 = Notification(
        user_id=student_objs[0].user_id,
        title="⚡ Skill Recommendation Alert",
        message="Mastering 'Power BI' will increase your target role match for Data Analyst from 75% to 94%. Check recommended courses!",
        type="match_alert",
        action_url="/student/skill-gap"
    )
    notif3 = Notification(
        user_id=student_objs[0].user_id,
        title="🎯 New Internship Matching Your Profile",
        message="AyuHealth Technologies posted 'Full Stack Web & AI Intern' (92% Match with your skills).",
        type="info",
        action_url="/student/internships"
    )
    db.session.add_all([notif1, notif2, notif3])

    # Industry AyuHealth Tech Notifications
    notif_ind = Notification(
        user_id=industry_objs[0].user_id,
        title="👥 New Top Applicant: Rahul Sharma (92.5% Match)",
        message="Rahul Sharma from AIIA & DTU applied for 'Data Analyst & Clinical Informatics Intern'. Strong Python and SQL foundation.",
        type="application_alert",
        action_url="/industry/applications"
    )
    db.session.add(notif_ind)

    # Academician Dr. Priya Sharma Notifications
    notif_acad = Notification(
        user_id=academic_objs[0].user_id,
        title="🤝 Collaboration Proposal Accepted!",
        message="AyuHealth Technologies accepted the proposal for 'Hands-on Workshop: Clinical Data Science & Power BI'.",
        type="collab_status",
        action_url="/academician/collaborations"
    )
    notif_acad2 = Notification(
        user_id=academic_objs[0].user_id,
        title="📊 Skill Gap Alert in Cohort",
        message="Industry demand for 'Power BI' and 'Clinical Data Analytics' is surging, but only 22% of students currently demonstrate advanced proficiency.",
        type="info",
        action_url="/academician/skill-analytics"
    )
    db.session.add_all([notif_acad, notif_acad2])

    db.session.commit()
    print("✅ Database successfully seeded with 36+ Skills, 8 Career Roles, 20 Students, 10 Companies, 10 Academicians, 24 Opportunities, Applications, Collaborations and Notifications!")

if __name__ == '__main__':
    from flask import Flask
    from config import Config
    
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    
    with app.app_context():
        seed_database()
