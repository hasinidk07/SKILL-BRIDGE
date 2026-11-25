from datetime import datetime

from sqlalchemy import (
    String, Integer, Float, Boolean,
    DateTime, Text, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    student_key: Mapped[str] = mapped_column(
        String(255), unique=True, index=True
    )
    name: Mapped[str] = mapped_column(String(150), default="Student")
    career: Mapped[str] = mapped_column(
        String(150), default="Software Developer"
    )
    password_hash: Mapped[str | None] = mapped_column(
    String(255),
    nullable=True
)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )


class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    student_key: Mapped[str] = mapped_column(
        String(255), index=True
    )
    career: Mapped[str] = mapped_column(String(150))
    skill: Mapped[str] = mapped_column(String(100))
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    resource_hint: Mapped[str] = mapped_column(String(255))
    estimated_days: Mapped[int] = mapped_column(Integer, default=2)
    order_index: Mapped[int] = mapped_column(Integer)
    completed: Mapped[bool] = mapped_column(
        Boolean, default=False
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )


class QuizRecord(Base):
    __tablename__ = "quiz_records"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    student_key: Mapped[str] = mapped_column(
        String(255), index=True
    )
    skill: Mapped[str] = mapped_column(String(100))
    score: Mapped[float] = mapped_column(Float)
    total_questions: Mapped[int] = mapped_column(Integer)
    correct_answers: Mapped[int] = mapped_column(Integer)
    attempted_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )


class ProjectRecord(Base):
    __tablename__ = "project_records"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    student_key: Mapped[str] = mapped_column(
        String(255), index=True
    )
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")
    skills_used: Mapped[str] = mapped_column(Text, default="")
    project_url: Mapped[str] = mapped_column(
        String(500), default=""
    )
    status: Mapped[str] = mapped_column(
        String(50), default="Completed"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )


class Achievement(Base):
    __tablename__ = "achievements"

    __table_args__ = (
        UniqueConstraint(
            "student_key", "code",
            name="unique_student_achievement"
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    student_key: Mapped[str] = mapped_column(
        String(255), index=True
    )
    code: Mapped[str] = mapped_column(String(100))
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str] = mapped_column(Text)
    earned_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )