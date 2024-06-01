import re

def parse_view_state(body: str) -> str:
    view_state = re.search(r'<input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="([^"]+)" autocomplete="off" />', body)
    return view_state.group(1) if view_state else None

def parse_form_id(body: str) -> str:
    from_str = "{PrimeFaces.ab({s:"
    to_str = ",f:"
    start_idx = body.find(from_str) + len(from_str)
    end_idx = body.find(to_str, start_idx)
    form_id = body[start_idx:end_idx]
    return form_id.replace('"', '')

# Ajoutez les autres fonctions de parsing de la même manière
