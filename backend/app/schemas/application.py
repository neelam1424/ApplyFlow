from pydantic import BaseModel

from datetime import date, datetime

from app.models.application import(
    ApplicationPlatform,
    ApplicationStatus,
)


class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: ApplicationStatus = ApplicationStatus.SAVED
    platform: ApplicationPlatform | None= None
    job_url: str | None=None
    salary: str | None=None 
    skills_aligned: str | None=None
    date_applied: date | None=None
    deadline: date | None=None
    location: str | None=None
    notes: str | None=None

class ApplicationResponse(BaseModel):
    id : int
    company: str 
    role : str
    status : ApplicationStatus
    platform : ApplicationPlatform | None= None
    job_url: str | None=None
    salary: str | None=None 
    skills_aligned: str | None=None
    date_applied: date | None=None
    deadline: date | None=None
    location: str | None=None
    notes: str | None=None
    created_at :datetime
    updated_at :datetime

class ApplicationUpdate(BaseModel):
    company: str | None=None
    role: str | None=None
    status: ApplicationStatus | None=None
    platform:ApplicationPlatform | None=None
    job_url:str | None=None
    salary:str | None=None
    skills_aligned:str | None=None
    date_applied:date | None=None
    deadline: date | None=None
    location: str | None=None
    notes: str | None=None