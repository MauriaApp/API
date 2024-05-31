from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional


# Remplacez ces importations par vos fonctions réelles
# from notes import getAllNote
# from notesAbs import getAllAbsNote
# from absences import getAllAbsence
# from planning import getPlanning
# from exactPlanning import getExactPlanning
# from statsNotes import PostStatsNotes, GetStatsNotes
# from eventJunia import getEventJunia

# from login import login
from assos.main import get_assos
from messages.main import get_msg
from tools.main import get_tools
from updates.main import get_updates

class AuthDetails(BaseModel):
    username: str
    password: str

class PostStatsDetails(BaseModel):
    username: str
    password: str
    shared: bool
    
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

@app.post("/login")
async def user_login(auth: AuthDetails):
    try:
        result = await login(auth.username, auth.password)
        return {"status": result[1]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/notes")
async def read_notes(auth: AuthDetails):
    try:
        result = await getAllNote(auth.username, auth.password)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

@app.post("/planning")
async def read_planning(auth: AuthDetails, start: Optional[str] = Query(None), end: Optional[str] = Query(None)):
    try:
        result = await getPlanning(auth.username, auth.password, start, end)
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
