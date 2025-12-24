"""
Authentication utilities for Google OAuth verification
"""
import os
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import HTTPException, status

# Load from environment variable (check both standard and Vite-prefixed)
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID') or os.getenv('VITE_GOOGLE_CLIENT_ID', '')

def verify_google_token(token: str) -> dict:
    """
    Verify Google OAuth ID token and return user information
    """
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GOOGLE_CLIENT_ID is not configured on the server."
        )
    
    Args:
        token: Google ID token from frontend
        
    Returns:
        dict containing user info (sub, email, name, picture)
        
    Raises:
        HTTPException: If token is invalid
    """
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # Token is valid, extract user information
        return {
            'id': idinfo['sub'],  # Google user ID
            'email': idinfo['email'],
            'name': idinfo.get('name', ''),
            'picture': idinfo.get('picture', ''),
            'email_verified': idinfo.get('email_verified', False)
        }
        
    except ValueError as e:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )
    except Exception as e:
        # Other errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token verification failed: {str(e)}"
        )
