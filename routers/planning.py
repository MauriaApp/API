from fastapi import APIRouter, Depends
from utils.login import login
from utils.requestsAurion import get_view_state, post_main_sidebar

router = APIRouter()

@router.get("/")
async def get_planning(email: str, password: str, start: int, end: int):
    session_id = await login(email, password)
    view_state, form_id = get_view_state("https://aurion.junia.com/", session_id)
    menu_id = post_main_sidebar(view_state, session_id, form_id)
    
    # Appelez les autres fonctions pour obtenir le planning
    planning = await get_planning_data(view_state, session_id, start, end)
    
    return planning

# Ajoutez les autres endpoints pour le planning
