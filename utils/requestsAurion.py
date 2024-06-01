import requests
from utils.parsing import parse_form_id, parse_view_state

def get_view_state(url: str, session_id: str) -> str:
    headers = {
        "Cookie": f"JSESSIONID={session_id}"
    }
    response = requests.get(url, headers=headers)
    form_id = parse_form_id(response.text)
    view_state = parse_view_state(response.text)
    return view_state, form_id

def post_main_sidebar(view_state: str, session_id: str, form_id: str) -> str:
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

# Ajoutez les autres fonctions de requêtes de la même manière
