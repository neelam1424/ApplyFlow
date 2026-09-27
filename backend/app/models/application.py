from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum 
from sqlalchemy import Enum as SQLEnum

from app.db.base import Base

from datetime import date, datetime
from sqlalchemy import DateTime, func,Date
from sqlalchemy import Text

class ApplicationStatus(str, Enum):
    SAVED = "SAVED"
    APPLIED = "APPLIED"
    OA = "OA"
    RECRUITER_SCREEN = "RECRUITER_SCREEN"
    INTERVIEW = "INTERVIEW"
    FINAL_ROUND = "FINAL_ROUND"
    OFFER = "OFFER"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


class ApplicationPlatform(str,Enum):
    LINKEDIN = "LINKEDIN"
    HANDSHAKE = "HANDSHAKE"
    INDEED = "INDEED"
    COMPANY_WEBSITE = "COMPANY_WEBSITE"
    REFERRAL = "REFERRAL"
    CAREER_FAIR = "CAREER_FAIR"
    OTHER = "OTHER"



class Application(Base):
    __tablename__="applications"

    id:Mapped[int] =mapped_column(
        primary_key=True
    )

    user_id:Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    company: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    status: Mapped[ApplicationStatus] = mapped_column(
        SQLEnum(ApplicationStatus),
        nullable=False,
        default=ApplicationStatus.SAVED
    )
    platform: Mapped[ApplicationPlatform | None] = mapped_column(
        SQLEnum(ApplicationPlatform),
        nullable=True,
    )
    job_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )
    salary: Mapped[str | None] = mapped_column(
        String(100),
        nullable = True
    )
    skills_aligned: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )
    date_applied: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )
    deadline: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )
    location: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    created_at: Mapped[datetime] =mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] =mapped_column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False
        )