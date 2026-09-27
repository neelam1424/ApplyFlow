from fastapi import APIRouter, Depends, HTTPException, status
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api.dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.application import (
Application,ApplicationStatus,ApplicationPlatform)
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate

router = APIRouter(
    prefix = "/applications",
    tags=["Applications"],
)

@router.post("",
             response_model=ApplicationResponse,
             status_code=201,
             )
def create_application(
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db:Session= Depends(get_db)
):
    if (
            application_data.status == ApplicationStatus.APPLIED 
            and
            application_data.date_applied is None
            ):
            application_data.date_applied = date.today()

    new_application = Application(
        user_id = current_user.id,
        **application_data.model_dump(),
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


@router.get("",
            response_model=list[ApplicationResponse])
def display_applications(
    status: ApplicationStatus | None = None,
    platform: ApplicationPlatform | None=None,
    current_user:User = Depends(get_current_user),
    db:Session=Depends(get_db)
):
    statement = select(Application).where(
        Application.user_id==current_user.id
    )

    if platform is not None:
        statement= statement.where(
            Application.platform == platform
        )

    if status is not None:
        statement = statement.where(
            Application.status == status
        )

    applications = db.scalars(statement).all()  

    return applications  


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    statement = select(Application).where(
        Application.user_id == current_user.id,
        Application.id == application_id,
    )

    application = db.scalar(statement)

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    return application

@router.patch(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_application(
    application_id: int,
    application_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    statement = select(Application).where(
        Application.user_id == current_user.id,
        Application.id == application_id,
    )

    application = db.scalar(statement)

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    updates = application_data.model_dump(exclude_unset=True)

    if (
        updates.get("status") == ApplicationStatus.APPLIED
        and updates.get("date_applied") is None
        and application.date_applied is None
    ):
        updates["date_applied"] = date.today()

    for field, value in updates.items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)

    return application


@router.delete(
    "/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    statement = select(Application).where(
        Application.id == application_id,
        Application.user_id == current_user.id,
    )

    application = db.scalar(statement)

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    db.delete(application)
    db.commit()