import requests
import aiohttp
import urllib.parse

from utils.parsing import parse_form_id, parse_view_state, parse_menu_id, parse_form_id_note


async def get_view_state(url: str, session_id: str) -> str:
    headers = {
        "Cookie": f"JSESSIONID={session_id}"
    }
    response = requests.get(url, headers=headers)
    form_id = parse_form_id(response.text)
    view_state = parse_view_state(response.text)
    return view_state, form_id

async def post_main_sidebar(view_state: str, session_id: str, form_id: str) -> str:
    url = "https://aurion.junia.com/faces/MainMenuPage.xhtml"
    payload = {
        "javax.faces.partial.ajax": "true",
        "javax.faces.partial.source": form_id,
        "javax.faces.partial.execute": form_id,
        "javax.faces.partial.render": "form:sidebar",
        form_id: form_id,
        "webscolaapp.Sidebar.ID_SUBMENU": "submenu_44413",
        "form": "form",
        "form:largeurDivCenter": "615",
        "form:sauvegarde": "",
        "form:j_idt772_focus": "",
        "form:j_idt772_input": "44323",
        "javax.faces.ViewState": view_state,
    }
    headers = {
        "Cookie": f"JSESSIONID={session_id}",
        "Content-type": "application/x-www-form-urlencoded",
    }
    response = requests.post(url, data=payload, headers=headers)
    menu_id = parse_menu_id(response.text)
    return menu_id


async def post_main_sidebar_note(view_state: str, session_id: str, menu_id: str) -> str:
    print(view_state, session_id, menu_id)
    url = "https://aurion.junia.com/faces/MainMenuPage.xhtml"
    payload = {
            "form": "form",
            "form:largeurDivCenter": "615",
            "form:sauvegarde": "",
            "form:j_idt772_focus": "",
            "form:j_idt772_input": "44323",
            "javax.faces.ViewState": view_state,
            "form:sidebar": "form:sidebar",
            "form:sidebar_menuid": menu_id,
    }
    headers = {
        "Cookie": f"JSESSIONID={session_id}",
        "Content-type": "application/x-www-form-urlencoded",
    }
    response = requests.post(url, data=payload, headers=headers)
    print(response.text)
    form_id = parse_form_id_note(response.text)
    return form_id


async def post_note(view_state, session_id, form_id_note):
    # print(view_state, session_id, form_id_note)
    payload = {
        f"form:{form_id_note}": f"form:{form_id_note}",
        f"form:{form_id_note}_pagination": "true",
        f"form:{form_id_note}_first": "0",
        f"form:{form_id_note}_rows": "20000",
        f"form:{form_id_note}_skipChildren": "true",
        f"form:{form_id_note}_encodeFeature": "true",
        "form": "form",
        "form:largeurDivCenter": "1620",
        "form:messagesRubriqueInaccessible": "",
        "form:search-texte": "",
        "form:search-texte-avancer": "",
        "form:input-expression-exacte": "",
        "form:input-un-des-mots": "",
        "form:input-aucun-des-mots": "",
        "form:input-nombre-debut": "",
        "form:input-nombre-fin": "",
        "form:calendarDebut_input": "",
        "form:calendarFin_input": "",
        f"form:{form_id_note}_reflowDD": "0_0",
        f"form:{form_id_note}:j_idt273:filter": "",
        f"form:{form_id_note}:j_idt275:filter": "",
        f"form:{form_id_note}:j_idt277:filter": "",
        f"form:{form_id_note}:j_idt279:filter": "",
        f"form:{form_id_note}:j_idt281:filter": "",
        f"form:{form_id_note}:j_idt283:filter": "",
        "form:j_idt258_focus": "",
        "form:j_idt258_input": "44323",
        "javax.faces.ViewState": view_state
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": f"JSESSIONID={session_id}",
    }

    url = "https://aurion.junia.com/faces/ChoixIndividu.xhtml"

    async with aiohttp.ClientSession() as session:
        async with session.post(url, data=urllib.parse.urlencode(payload), headers=headers) as response:
            data = await response.text()
            return data
