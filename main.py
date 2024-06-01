from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional

from utils.login import login


# Remplacez ces importations par vos fonctions réelles
# from notes import getAllNote
# from notesAbs import getAllAbsNote
# from absences import getAllAbsence
# from planning import getPlanning
# from exactPlanning import getExactPlanning
# from statsNotes import PostStatsNotes, GetStatsNotes
# from eventJunia import getEventJunia
from routers import planning, notes, absences

# from login import login
from assos.main import get_assos
from messages.main import get_msg
from tools.main import get_tools
from updates.main import get_updates

from models import AuthDetails

class PostStatsDetails(BaseModel):
    username: str
    password: str
    shared: bool
    

class DateRange(BaseModel):
    start: int
    end: int

    
app = FastAPI()

BASE_URL = "https://mauriacms.fly.dev/api"  # Centraliser l'URL ici

@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

@app.get("/msg")
async def read_msg():
    try:
        msg = await get_msg(BASE_URL)
        return msg
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/assos")
async def read_assos():
    try:
        assos = await get_assos(BASE_URL)
        return assos
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tools")
async def read_tools():
    try:
        tools = await get_tools(BASE_URL)
        return tools
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/updates")
async def read_update():
    try:
        result = await get_updates(BASE_URL)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/events")
async def read_events():
    try:
        result = await getEventJunia()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# PARTIE AURION
app.include_router(planning.router, prefix="/planning", tags=["planning"])
app.include_router(notes.router, prefix="/notes", tags=["notes"])
app.include_router(absences.router, prefix="/absences", tags=["absences"])


@app.post("/login")
async def login_handler(auth : AuthDetails):
    try:
        cookie, status = await login(auth)
        print(cookie, status)
        return JSONResponse(content={"cookie": cookie, "status": status})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/notesAbs")
async def read_notes_abs(auth: AuthDetails):
    try:
        result = await getAllAbsNote(auth.username, auth.password)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/absences")
async def read_absences(auth: AuthDetails):
    try:
        result = await getAllAbsence(auth.username, auth.password)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/exactPlanning")
async def read_exact_planning(auth: AuthDetails, start: str = Query(...), end: str = Query(...)):
    try:
        result = await getExactPlanning(auth.username, auth.password, start, end)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/poststats")
async def post_stats(details: PostStatsDetails):
    try:
        result = await PostStatsNotes(details.username, details.password, details.shared)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/getstats")
async def get_stats(auth: AuthDetails):
    try:
        result = await GetStatsNotes(auth.username, auth.password)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
