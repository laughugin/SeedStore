from typing import Optional
from firebase_admin import auth, initialize_app, credentials
from fastapi import HTTPException, status
from app.core.config import settings

# Initialize Firebase Admin
cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
initialize_app(cred)

class FirebaseUser:
    def __init__(self, uid: str, email: str, claims: dict):
        self.uid = uid
        self.email = email
        self.claims = claims

def verify_firebase_token(token: str) -> FirebaseUser:
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(token)
        
        # Get the user's info
        uid = decoded_token['uid']
        user = auth.get_user(uid)
        
        return FirebaseUser(
            uid=uid,
            email=user.email,
            claims=decoded_token.get('claims', {})
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        ) 