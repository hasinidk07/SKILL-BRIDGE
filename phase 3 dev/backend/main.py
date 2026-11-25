
from datetime import datetime, timedelta, timezone
from typing import Optional
import os
import jwt
import re
import secrets
from pwdlib import PasswordHash


from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import (
    Student,
    RoadmapTask,
    QuizRecord,
    ProjectRecord,
    Achievement
)

# ==========================================
# AUTHENTICATION CONFIGURATION
# ==========================================

password_hasher = PasswordHash.recommended()

SECRET_FILE = os.path.join(
    os.path.dirname(__file__),
    ".skillbridge_secret"
)

if os.path.exists(SECRET_FILE):
    with open(SECRET_FILE, "r", encoding="utf-8") as file:
        SECRET_KEY = file.read().strip()
else:
    SECRET_KEY = secrets.token_urlsafe(48)

    with open(SECRET_FILE, "w", encoding="utf-8") as file:
        file.write(SECRET_KEY)

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
# ==========================================
# DATABASE INITIALIZATION
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="SkillBridge API",
    description="Personalized Career Skill Development Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# REQUEST SCHEMAS
# ==========================================

class Requirement(BaseModel):
    skill: str
    required: float = 70
    weight: float = 1.0


class RoadmapRequest(BaseModel):
    student_key: str
    name: str = "Student"
    career: str
    assessed_skills: dict[str, float] = Field(default_factory=dict)
    requirements: list[Requirement] = Field(default_factory=list)


class CompletionRequest(BaseModel):
    student_key: str
    completed: bool = True


class QuizRequest(BaseModel):
    student_key: str
    skill: str
    score: float = Field(ge=0, le=100)
    total_questions: int = Field(gt=0)
    correct_answers: int = Field(ge=0)


class ProjectRequest(BaseModel):
    student_key: str
    title: str
    description: str = ""
    skills_used: list[str] = Field(default_factory=list)
    project_url: str = ""
    status: str = "Completed"

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    career: str = "Software Developer"


class LoginRequest(BaseModel):
    email: str
    password: str

# ==========================================
# LEARNING CURRICULUM
# Ordered steps represent learning prerequisites
# ==========================================

CURRICULUM = {
    "Programming": [
        (
            "Programming Fundamentals",
            "Learn variables, data types, conditions and loops.",
            "Programming beginner lessons",
            2
        ),
        (
            "Functions and Problem Solving",
            "Practice functions and solve basic coding problems.",
            "Programming exercises",
            3
        ),
        (
            "Programming Mini Project",
            "Build a small application using programming concepts.",
            "Beginner programming projects",
            4
        )
    ],

    "Python": [
        (
            "Python Fundamentals",
            "Learn variables, data types, conditions and loops.",
            "Python beginner tutorials",
            3
        ),
        (
            "Python Data Structures",
            "Practice lists, tuples, dictionaries and sets.",
            "Python practice exercises",
            3
        ),
        (
            "Python Mini Project",
            "Build a small application using Python.",
            "Python project practice",
            4
        )
    ],

    "C/C++": [
        (
            "C/C++ Fundamentals",
            "Learn variables, operators, conditions and loops.",
            "C/C++ beginner lessons",
            3
        ),
        (
            "Functions and Arrays",
            "Practice functions, arrays and strings.",
            "C/C++ exercises",
            3
        ),
        (
            "C/C++ Mini Project",
            "Create a small console-based application.",
            "C/C++ project practice",
            4
        )
    ],

    "Problem Solving": [
        (
            "Problem Decomposition",
            "Break large problems into smaller steps.",
            "Problem solving exercises",
            2
        ),
        (
            "Algorithm Practice",
            "Practice basic algorithms and logical problems.",
            "Algorithm exercises",
            3
        )
    ],

    "Data Structures": [
        (
            "Arrays and Strings",
            "Understand arrays and string operations.",
            "Data structures tutorials",
            3
        ),
        (
            "Stacks and Queues",
            "Learn stack and queue operations.",
            "Data structures exercises",
            3
        )
    ],

    "Git": [
        (
            "Git Fundamentals",
            "Understand repositories, commits and branches.",
            "Git beginner guide",
            2
        ),
        (
            "GitHub Workflow",
            "Create repositories and manage project changes.",
            "GitHub documentation",
            2
        )
    ],

    "SQL": [
        (
            "SQL Fundamentals",
            "Learn SELECT, INSERT, UPDATE and DELETE.",
            "SQL beginner tutorials",
            2
        ),
        (
            "SQL Queries and Joins",
            "Practice filtering, grouping and joining tables.",
            "SQL exercises",
            3
        ),
        (
            "Database Mini Project",
            "Create a database and retrieve useful information.",
            "Database project practice",
            4
        )
    ],

    "Excel": [
        (
            "Spreadsheet Fundamentals",
            "Learn cells, formulas and formatting.",
            "Excel beginner tutorials",
            2
        ),
        (
            "Formulas and Charts",
            "Practice formulas and create charts.",
            "Excel exercises",
            3
        )
    ],

    "Statistics": [
        (
            "Descriptive Statistics",
            "Learn mean, median, mode and range.",
            "Statistics lessons",
            3
        ),
        (
            "Data Interpretation",
            "Interpret simple datasets and results.",
            "Statistics exercises",
            3
        )
    ],

    "Data Visualization": [
        (
            "Chart Fundamentals",
            "Learn when to use bar, line and pie charts.",
            "Data visualization tutorials",
            2
        ),
        (
            "Dashboard Creation",
            "Present data using meaningful visualizations.",
            "Dashboard project practice",
            4
        )
    ],

    "Machine Learning": [
        (
            "Machine Learning Fundamentals",
            "Understand datasets, features and model training.",
            "Machine learning tutorials",
            3
        ),
        (
            "Supervised Learning",
            "Learn classification and regression.",
            "Machine learning exercises",
            4
        ),
        (
            "Machine Learning Mini Project",
            "Train and evaluate a beginner model.",
            "Beginner ML projects",
            5
        )
    ],

    "Mathematics": [
        (
            "Essential Mathematics",
            "Revise algebra, functions and equations.",
            "Mathematics lessons",
            3
        ),
        (
            "Applied Mathematics",
            "Study mathematical concepts used in computing.",
            "Applied mathematics exercises",
            4
        )
    ],

    "Microcontrollers": [
        (
            "Microcontroller Fundamentals",
            "Understand processors, memory and input/output.",
            "Microcontroller tutorials",
            3
        ),
        (
            "Embedded Programming",
            "Understand software and hardware interaction.",
            "Embedded systems lessons",
            4
        )
    ],

    "Electronics": [
        (
            "Electronic Components",
            "Learn resistors, capacitors and basic components.",
            "Electronics lessons",
            3
        ),
        (
            "Circuit Fundamentals",
            "Study basic circuits and measurements.",
            "Circuit practice",
            3
        )
    ],

    "Debugging": [
        (
            "Debugging Fundamentals",
            "Learn how to identify programming errors.",
            "Debugging tutorials",
            2
        ),
        (
            "Testing and Debugging",
            "Test programs and fix common errors.",
            "Debugging exercises",
            3
        )
    ],

    "Digital Logic": [
        (
            "Logic Gates",
            "Study AND, OR, NOT and other logic gates.",
            "Digital logic tutorials",
            2
        ),
        (
            "Boolean Algebra",
            "Practice Boolean expressions and truth tables.",
            "Digital logic exercises",
            3
        )
    ],

    "Verilog": [
        (
            "Verilog Fundamentals",
            "Learn modules, ports and basic syntax.",
            "Verilog tutorials",
            3
        ),
        (
            "Digital Design Practice",
            "Describe simple digital circuits.",
            "Verilog exercises",
            4
        )
    ],

    "Semiconductor Basics": [
        (
            "Semiconductor Fundamentals",
            "Understand conductors, insulators and semiconductors.",
            "Semiconductor lessons",
            3
        ),
        (
            "Semiconductor Devices",
            "Explore basic diode and transistor concepts.",
            "Electronics resources",
            3
        )
    ],

    "Verification": [
        (
            "Design Verification Fundamentals",
            "Learn specifications, test cases and verification.",
            "Verification tutorials",
            3
        ),
        (
            "Test Scenario Practice",
            "Create test cases for simple digital designs.",
            "Verification exercises",
            4
        )
    ],

    "Networking": [
        (
            "Networking Fundamentals",
            "Learn IP addresses, protocols and network devices.",
            "Networking tutorials",
            3
        ),
        (
            "Network Communication",
            "Understand how devices exchange information.",
            "Networking exercises",
            3
        )
    ],

    "Sensors": [
        (
            "Sensor Fundamentals",
            "Learn sensor types and measured quantities.",
            "Sensor tutorials",
            2
        ),
        (
            "Sensor Applications",
            "Explore sensors used in electronic systems.",
            "Sensor project examples",
            3
        )
    ],

    "Cloud Basics": [
        (
            "Cloud Computing Fundamentals",
            "Understand cloud services, storage and computing.",
            "Cloud tutorials",
            3
        ),
        (
            "Cloud Applications",
            "Explore applications using cloud services.",
            "Cloud practice",
            3
        )
    ],

    "Control Systems": [
        (
            "Control System Fundamentals",
            "Understand input, output and feedback.",
            "Control systems lessons",
            3
        ),
        (
            "Feedback Systems",
            "Explore open-loop and closed-loop systems.",
            "Control systems exercises",
            4
        )
    ],

    "ROS": [
        (
            "ROS Fundamentals",
            "Understand the purpose and structure of ROS.",
            "ROS tutorials",
            3
        ),
        (
            "ROS Communication",
            "Learn nodes, topics and communication.",
            "ROS exercises",
            4
        )
    ],

    "Signal Processing": [
        (
            "Signal Fundamentals",
            "Understand signals and their basic properties.",
            "Signal processing lessons",
            3
        ),
        (
            "Basic Signal Filtering",
            "Explore filtering and frequency concepts.",
            "Signal processing exercises",
            4
        )
    ],

    "Wireless Systems": [
        (
            "Wireless Communication",
            "Understand wireless transmission concepts.",
            "Wireless communication lessons",
            3
        ),
        (
            "Wireless Technologies",
            "Study common wireless communication systems.",
            "Wireless systems tutorials",
            3
        )
    ]
}


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def get_or_create_student(
    db,
    student_key,
    name="Student",
    career=None
):
    student = db.query(Student).filter_by(
        student_key=student_key
    ).first()

    if not student:
        student = Student(
            student_key=student_key,
            name=name,
            career=career or "Software Developer"
        )
        db.add(student)
    else:
        student.name = name or student.name

        if career:
            student.career = career

    db.commit()
    db.refresh(student)

    return student

# ==========================================
# AUTHENTICATION HELPERS
# ==========================================

def create_access_token(student_key: str):
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": student_key,
        "exp": expires
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


def verify_password(plain_password: str, hashed_password: str):
    try:
        return password_hasher.verify(
            plain_password,
            hashed_password
        )
    except Exception:
        return False


def validate_email(email: str):
    email = email.strip().lower()

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid email address"
        )

    return email

def award_badge(
    db,
    student_key,
    code,
    title,
    description
):
    existing = db.query(Achievement).filter_by(
        student_key=student_key,
        code=code
    ).first()

    if existing:
        return

    badge = Achievement(
        student_key=student_key,
        code=code,
        title=title,
        description=description
    )

    db.add(badge)
    db.commit()


def check_task_badges(db, student_key):
    completed_count = db.query(RoadmapTask).filter_by(
        student_key=student_key,
        completed=True
    ).count()

    if completed_count >= 1:
        award_badge(
            db,
            student_key,
            "first_step",
            "First Step",
            "Completed your first learning task."
        )

    if completed_count >= 5:
        award_badge(
            db,
            student_key,
            "consistent_learner",
            "Consistent Learner",
            "Completed five learning tasks."
        )


def task_to_dict(task):
    return {
        "id": task.id,
        "career": task.career,
        "skill": task.skill,
        "title": task.title,
        "description": task.description,
        "resource_hint": task.resource_hint,
        "estimated_days": task.estimated_days,
        "order_index": task.order_index,
        "completed": task.completed,
        "completed_at": task.completed_at
    }


# ==========================================
# HOME AND HEALTH CHECK
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Welcome to SkillBridge API",
        "status": "running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "message": "SkillBridge backend is working!"
    }


# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

@app.post("/api/auth/register")
def register_student(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    email = validate_email(data.email)

    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 8 characters"
        )

    if not data.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Name is required"
        )

    career = data.career.strip() or "Software Developer"

    student = db.query(Student).filter_by(
        student_key=email
    ).first()

    if student and student.password_hash:
        raise HTTPException(
            status_code=409,
            detail="Account already exists. Please sign in."
        )

    try:
        if student is None:
            student = Student(
                student_key=email,
                name=data.name.strip(),
                career=career,
                password_hash=password_hasher.hash(data.password)
            )
            db.add(student)
        else:
            # Preserve existing learning records.
            student.name = data.name.strip()
            student.career = career
            student.password_hash = password_hasher.hash(data.password)

        db.commit()
        db.refresh(student)

        token = create_access_token(student.student_key)

        return {
            "message": "Account created successfully",
            "access_token": token,
            "token_type": "bearer",
            "student": {
                "name": student.name,
                "email": student.student_key,
                "career": student.career
            }
        }

    except Exception:
        db.rollback()
        raise


@app.post("/api/auth/login")
def login_student(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    email = validate_email(data.email)

    student = db.query(Student).filter_by(
        student_key=email
    ).first()

    if (
        not student
        or not student.password_hash
        or not verify_password(data.password, student.password_hash)
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(student.student_key)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "student": {
            "name": student.name,
            "email": student.student_key,
            "career": student.career
        }
    }



# ==========================================
# GENERATE PERSONALIZED ROADMAP
# ==========================================

@app.post("/api/roadmap/generate")
def generate_roadmap(
    data: RoadmapRequest,
    db: Session = Depends(get_db)
):
    try:
        get_or_create_student(
            db,
            data.student_key,
            data.name,
            data.career
        )

        gaps = []

        for requirement in data.requirements:
            current_score = float(
                data.assessed_skills.get(
                    requirement.skill, 0
                )
            )

            gap = max(
                0,
                requirement.required - current_score
            )

            if gap > 0:
                priority = gap * requirement.weight

                gaps.append({
                    "skill": requirement.skill,
                    "gap": gap,
                    "priority": priority
                })

        gaps.sort(
            key=lambda item: item["priority"],
            reverse=True
        )

        order = 1

        for gap in gaps:
            skill = gap["skill"]

            steps = CURRICULUM.get(
                skill,
                [
                    (
                        f"{skill} Fundamentals",
                        f"Learn the basic concepts of {skill}.",
                        f"{skill} beginner resources",
                        2
                    ),
                    (
                        f"{skill} Practice",
                        f"Complete exercises to improve {skill}.",
                        f"{skill} practice exercises",
                        3
                    ),
                    (
                        f"{skill} Mini Project",
                        f"Apply your {skill} knowledge in a project.",
                        f"{skill} project practice",
                        4
                    )
                ]
            )

            for title, description, resource, days in steps:

                existing = db.query(RoadmapTask).filter_by(
                    student_key=data.student_key,
                    career=data.career,
                    skill=skill,
                    title=title
                ).first()

                if existing:
                    existing.order_index = order
                else:
                    task = RoadmapTask(
                        student_key=data.student_key,
                        career=data.career,
                        skill=skill,
                        title=title,
                        description=description,
                        resource_hint=resource,
                        estimated_days=days,
                        order_index=order
                    )

                    db.add(task)

                order += 1

        db.commit()

        tasks = db.query(RoadmapTask).filter_by(
            student_key=data.student_key,
            career=data.career
        ).order_by(
            RoadmapTask.order_index
        ).all()

        return {
            "message": "Personalized roadmap generated",
            "career": data.career,
            "missing_skills": [
                item["skill"] for item in gaps
            ],
            "priority_ranking": gaps,
            "tasks": [
                task_to_dict(task) for task in tasks
            ]
        }

    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==========================================
# GET ROADMAP
# ==========================================

@app.get("/api/roadmap/{student_key}")
def get_roadmap(
    student_key: str,
    career: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(RoadmapTask).filter_by(
        student_key=student_key
    )

    if career:
        query = query.filter_by(career=career)

    tasks = query.order_by(
        RoadmapTask.order_index
    ).all()

    return {
        "tasks": [
            task_to_dict(task) for task in tasks
        ]
    }


# ==========================================
# TASK COMPLETION TRACKING
# ==========================================

@app.patch("/api/tasks/{task_id}/complete")
def update_task(
    task_id: int,
    data: CompletionRequest,
    db: Session = Depends(get_db)
):
    task = db.query(RoadmapTask).filter_by(
        id=task_id,
        student_key=data.student_key
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    task.completed = data.completed

    task.completed_at = (
        datetime.utcnow() if data.completed else None
    )

    db.commit()
    db.refresh(task)

    if data.completed:
        check_task_badges(db, data.student_key)

    return {
        "message": "Task updated successfully",
        "task": task_to_dict(task)
    }


# ==========================================
# SAVE QUIZ SCORES
# ==========================================

@app.post("/api/quizzes")
def save_quiz(
    data: QuizRequest,
    db: Session = Depends(get_db)
):
    if data.correct_answers > data.total_questions:
        raise HTTPException(
            status_code=400,
            detail="Correct answers cannot exceed total questions"
        )

    expected_score = (
        data.correct_answers / data.total_questions
    ) * 100

    if abs(expected_score - data.score) > 0.01:
        raise HTTPException(
            status_code=400,
            detail="Score does not match correct answers and total questions"
        )

    get_or_create_student(
        db,
        data.student_key
    )

    record = QuizRecord(
        student_key=data.student_key,
        skill=data.skill,
        score=data.score,
        total_questions=data.total_questions,
        correct_answers=data.correct_answers
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    if data.score >= 80:
        award_badge(
            db,
            data.student_key,
            "quiz_star",
            "Quiz Star",
            "Scored at least 80% in a skill quiz."
        )

    return {
        "message": "Quiz result saved",
        "quiz_id": record.id,
        "score": record.score
    }


# ==========================================
# SAVE STUDENT PROJECTS
# ==========================================

@app.post("/api/projects")
def save_project(
    data: ProjectRequest,
    db: Session = Depends(get_db)
):
    get_or_create_student(
        db,
        data.student_key
    )

    project = ProjectRecord(
        student_key=data.student_key,
        title=data.title,
        description=data.description,
        skills_used=", ".join(data.skills_used),
        project_url=data.project_url,
        status=data.status
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    award_badge(
        db,
        data.student_key,
        "project_builder",
        "Project Builder",
        "Recorded your first project in SkillBridge."
    )

    return {
        "message": "Project saved successfully",
        "project_id": project.id
    }


# ==========================================
# SKILL PASSPORT
# ==========================================

@app.get("/api/passport/{student_key}")
def get_passport(
    student_key: str,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter_by(
        student_key=student_key
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    quizzes = db.query(QuizRecord).filter_by(
        student_key=student_key
    ).order_by(
        QuizRecord.attempted_at.desc()
    ).all()

    projects = db.query(ProjectRecord).filter_by(
        student_key=student_key
    ).order_by(
        ProjectRecord.created_at.desc()
    ).all()

    badges = db.query(Achievement).filter_by(
        student_key=student_key
    ).order_by(
        Achievement.earned_at.desc()
    ).all()

    return {
        "student": {
            "name": student.name,
            "career": student.career
        },

        "quiz_records": [
            {
                "skill": quiz.skill,
                "score": quiz.score,
                "correct_answers": quiz.correct_answers,
                "total_questions": quiz.total_questions,
                "attempted_at": quiz.attempted_at
            }
            for quiz in quizzes
        ],

        "projects": [
            {
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "skills_used": project.skills_used,
                "project_url": project.project_url,
                "status": project.status,
                "created_at": project.created_at
            }
            for project in projects
        ],

        "achievements": [
            {
                "title": badge.title,
                "description": badge.description,
                "earned_at": badge.earned_at
            }
            for badge in badges
        ]
    }


# ==========================================
# DASHBOARD SUMMARY
# ==========================================

@app.get("/api/dashboard/{student_key}")
def dashboard_summary(
    student_key: str,
    db: Session = Depends(get_db)
):
    tasks = db.query(RoadmapTask).filter_by(
        student_key=student_key
    ).all()

    completed = sum(
        1 for task in tasks if task.completed
    )

    total = len(tasks)

    quiz_count = db.query(QuizRecord).filter_by(
        student_key=student_key
    ).count()

    project_count = db.query(ProjectRecord).filter_by(
        student_key=student_key
    ).count()

    badge_count = db.query(Achievement).filter_by(
        student_key=student_key
    ).count()

    progress = (
        round((completed / total) * 100)
        if total > 0 else 0
    )

    return {
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": total - completed,
        "roadmap_progress": progress,
        "quizzes_attempted": quiz_count,
        "projects_recorded": project_count,
        "badges_earned": badge_count
    }


# ==========================================
# RUNNING MESSAGE
# ==========================================

@app.get("/api")
def api_home():
    return {
        "application": "SkillBridge",
        "version": "1.0.0",
        "message": "Backend API is ready"
    }
