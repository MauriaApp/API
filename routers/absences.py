from fastapi import APIRouter, Depends
from utils.login import login
from utils.requestsAurion import get_view_state, post_main_sidebar

router = APIRouter()

@router.get("/")
async def get_all_absences(email: str, password: str):
    session_id = await login(email, password)
    view_state, form_id = get_view_state("https://aurion.junia.com/", session_id)
    menu_id = post_main_sidebar(view_state, session_id, form_id)
    view_state = post_main_sidebar_absences(view_state, session_id, menu_id)
    absences = get_absences_data(view_state, session_id)
    
    return absences

# Ajoutez les autres endpoints pour les absences
