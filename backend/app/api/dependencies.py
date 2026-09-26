import jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import decode_access_token


from sqlalchemy.orm import Session
from app.db.dependencies import get_db

from sqlalchemy import select

from app.models.user import User


bearer_schema = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_schema),
    db:Session=Depends(get_db)
):
    token = credentials.credentials

    try:
        user_id = decode_access_token(token)

    except (jwt.InvalidTokenError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    statement = select(User).where(
        User.id == user_id  
    )
    user = db.scalar(statement)

    if not user:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User not found",
    )

    return user

    