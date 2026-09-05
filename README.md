# 🌿 AYUSH SkillBridge: Portal for Academia - Industry Collaboration

**Smart India Hackathon (SIH) Solution**  
**Problem Statement ID:** `26044`  
**Title:** *Portal for Academia - Industry collaboration for Skill Mapping, Internships and Placement*  
**Organization:** Ministry of Ayush  
**Department:** All India Institute of Ayurveda (AIIA)  
**Category:** Software  
**Theme:** Smart Automation  

---

## 📌 1. Project Overview

There is a critical disconnect between the competencies students acquire in academic institutions and the actual practical skillsets required by modern industries.

**AYUSH SkillBridge** is a centralized, AI-assisted platform that bridges all three key stakeholders:
1. **Students**: Identify target career goals, assess skill gaps with real-time radar charts, receive actionable learning roadmaps (Swayam / NPTEL), and discover internships/jobs matching their profiles.
2. **Industries & Employers**: Post requisitions, search candidates with multi-skill filters, evaluate candidates with explainable AI match scores, manage hiring pipelines, and propose MoUs/workshops with colleges.
3. **Academicians & Faculty Deans**: Track cohort skill proficiencies, view real-time industry demand rankings, receive AI-generated curriculum upgrade recommendations, and execute industry-academia partnerships.
4. **Platform Administrators**: Full governance over platform statistics, user directories, opportunity audits, and placement conversion funnels.

---

## 🏛️ 2. Key Features & Architecture

```mermaid
graph TD
    subgraph Frontend [React 18 + Vite + Tailwind CSS + Recharts]
        Landing[Public Portal & Live Simulator]
        AuthUI[JWT RBAC Onboarding & 1-Click Demo Bar]
        StudentDash[Student Hub: Skill Gap Radar, Recommendations, App Tracker, Resume]
        IndustryDash[Industry Hub: Candidate Matcher, Postings, Applications Pipeline]
        AcademicDash[Faculty Hub: Skill Analytics, Demand Trends, Curriculum Insights]
        AdminDash[Admin Hub: Platform Analytics, System Health, User Directory]
    end

    subgraph Backend [Python Flask REST API]
        AuthService[Auth Service: JWT + Bcrypt Password Hashing]
        SkillEngine[Smart Skill Mapping & Gap Analysis Engine]
        MatchingEngine[Explainable Multi-Factor Candidate Matcher]
        Marketplace[Internship & Placement Marketplace API]
        CollabHub[Academia-Industry Collaboration Hub]
        NotifService[Real-time Notification & Alert Dispatcher]
    end

    subgraph Database [SQLite / PostgreSQL Compatible SQLAlchemy]
        DB[(Users, Students, Industries, Academicians, Skills, Postings, Applications, MoUs, Notifs)]
    end

    Frontend -->|REST API (JSON)| Backend
    Backend --> DB
```

### 🧠 Smart Matching & Skill Gap Algorithm

The platform features an explainable multi-factor candidate matching formula:
$$\text{Final Fit} = (\text{Skill Match} \times 50\%) + (\text{Branch Match} \times 15\%) + (\text{Experience} \times 10\%) + (\text{Career Interest} \times 10\%) + (\text{Location/Work Mode} \times 5\%) + (\text{CGPA Standing} \times 10\%)$$

- **Matched Skills**: 100% credit for Advanced/Expert ratings (4-5 stars).
- **Partial Matches**: 75% credit with recommendation to level up.
- **Missing Skills**: Explicitly pinpointed with customized learning timelines.

---

## 🚀 3. Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ (bundled or system-installed)

### 1-Command Unified Startup (Recommended)
```bash
./start.sh
```
Or with Python:
```bash
source backend/venv/bin/activate
python run.py
```
Open **`http://127.0.0.1:5000`** in your browser!

### Running in Separate Development Mode (Optional)

**Backend API (Port 5000):**
```bash
cd backend
source venv/bin/activate
python app.py
```

**Frontend Vite Server (Port 5173 with proxy to backend):**
```bash
cd frontend
npm run dev
```

---

## 🎯 4. Step-by-Step SIH Hackathon Demo Walkthrough

A **Demo Jury Quick-Switcher** banner is pinned at the top of the interface for instant 1-click role switching during live presentations:

| Step | Persona | Action in Portal |
|---|---|---|
| **1** | 🎓 **Student** (Rahul Sharma) | Logs in in 1 click. Visits **Skill Gap Analysis** for *"Data Analyst"*. Observes that Power BI is identified as a critical gap. |
| **2** | 🎓 **Student** | Navigates to **Internships**, explores *"Data Analyst & Clinical Informatics Intern"* (84% match score), and clicks **Apply**. |
| **3** | 🏢 **Industry** (AyuHealth Technologies) | Switches role via Demo Bar. Visits **Post Opportunity** and specifies *"Python, NLP, Herbal Informatics"* requirements. |
| **4** | 🏢 **Industry** | Visits **Applications Pipeline**, reviews Rahul Sharma's application, inspects the 92% match score breakdown, and clicks **Schedule Interview**. |
| **5** | 🎓 **Student** | Switches back to Student. Checks the notification bell and visits **Application Tracker** to view the scheduled Google Meet interview link. |
| **6** | 🏛️ **Academician** (Dr. Priya Sharma) | Switches to Faculty role. Visits **Skill Analytics** and **Curriculum Insights** to view high-demand industry skills. Clicks **Propose Industry Workshop on Power BI** to bridge the cohort skill gap. |
| **7** | 🛡️ **Admin** | Switches to Admin. Observes platform-wide metrics (20 students, 10 companies, 25 opportunities, placement conversion funnels). |

---

## 📡 5. REST API Endpoints

### Authentication & RBAC
- `POST /api/auth/register` - Create user account (Student, Industry, Academician)
- `POST /api/auth/login` - Authenticate user & issue JWT
- `POST /api/auth/demo-login` - Instant 1-click hackathon demo login
- `GET /api/auth/me` - Get current user profile

### Skill Mapping & Gap Engine
- `GET /api/skills` - List centralized skills database
- `POST /api/skills` - Add new skill definition
- `GET /api/students/skill-gap?target_role=Role` - Perform real-time skill-gap calculation & roadmap generation
- `POST /api/match/calculate` - Dynamic candidate match evaluation

### Student Hub
- `GET /api/students/profile` & `PUT /api/students/profile` - Profile management
- `GET /api/students/skills` & `POST /api/students/skills` - Skill rating management
- `GET /api/students/recommendations` - Auto-ranked opportunities
- `GET /api/students/applications` - Application progression & interview schedules

### Industry Hub
- `GET /api/industry/dashboard` - Recruiter dashboard KPIs
- `POST /api/opportunities` - Create internship or job requisition
- `GET /api/industry/candidates` - Multi-filter candidate search with AI fit ranking
- `GET /api/industry/applications` - Application pipeline management
- `PUT /api/industry/applications/:id/status` - Shortlist, select, reject
- `POST /api/industry/applications/:id/schedule-interview` - Schedule interview with meeting link

### Academician & Curriculum Hub
- `GET /api/academician/dashboard` - Faculty metrics & alerts
- `GET /api/academician/students` - Student cohort directory
- `GET /api/academician/skill-analytics` - Cohort skill distribution & gap severity
- `GET /api/academician/industry-demand` - Real-time market skill ranking
- `GET /api/academician/curriculum-insights` - Automated syllabus upgrade recommendations

### Collaboration Hub & Notifications
- `GET /api/collaborations` & `POST /api/collaborations` - Propose/track MoUs & workshops
- `PUT /api/collaborations/:id/status` - Accept or decline partnership proposals
- `GET /api/notifications` - Real-time alerts

---

## 🌿 6. Ministry of Ayush & AIIA Domain Integration

The portal natively incorporates domain specializations alongside general IT/Engineering:
- Ayurvedic Pharmacology (Dravyaguna)
- Clinical Research & Good Clinical Practice (GCP)
- Herbal Informatics & Phytocompound Docking
- AYUSH Digital Health & Telemedicine
- Pharmacovigilance & Adverse Drug Reaction (ADR) Monitoring
- Traditional Knowledge Digital Library (TKDL) Prior-Art Search
- Botanical Taxonomy & Chromatography QA

---

## 🧪 7. Automated Test Suite

Run the backend verification suite to validate all 15 core API workflows:
```bash
source backend/venv/bin/activate
python backend/test_api.py
```

*Developed for the Smart India Hackathon (SIH).*
