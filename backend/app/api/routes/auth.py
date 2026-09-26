from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate, 
    UserResponse, 
    UserLogin,
    TokenResponse
    )

from app.core.security import (hash_password, verify_password,create_access_token)
from app.api.dependencies import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    statement = select(User).where(
        User.email == user_data.email
    )

    existing_user = db.scalar(statement)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    hashed_password = hash_password(user_data.password)

    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post(
        "/login",
        response_model=TokenResponse
             )
def login(
    user_data: UserLogin,
    db:Session= Depends(get_db),
):
    statement= select(User).where(
        User.email == user_data.email
    )

    user = db.scalar(statement)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not verify_password(
        user_data.password,
        user.password_hash
    ):
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
    )

    access_token= create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "brearer",
    }

@router.get(
    "/me",
    response_model = UserResponse,
    )
def get_me(
    current_user : User = Depends(get_current_user),
):
    return current_user