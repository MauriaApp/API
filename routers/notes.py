from fastapi import APIRouter, Depends
from utils.login import login
from utils.requestsAurion import get_view_state, post_main_sidebar, post_main_sidebar_note, post_note
# from types import AuthDetails
from models import AuthDetails  # Importez votre modèle

router = APIRouter()

@router.post("/")
async def get_all_notes(auth: AuthDetails):
    try:
        cookie, status = await login(auth)
        if status != 302:
            return JSONResponse(content={"error": "Login failed"}, status_code=401)
        
        session_id = cookie
        view_state, form_id = await get_view_state("https://aurion.junia.com/", session_id)
        menu_id = await post_main_sidebar(view_state, session_id, form_id)
        form_id = await post_main_sidebar_note(view_state, session_id, menu_id)
        notes = await post_note(view_state, session_id,form_id)
        
        return notes
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Ajoutez les autres endpoints pour les notes ici
