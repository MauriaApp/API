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



def parse_menu_id(html):
    html = html[0:4000]
    # print (html)
    to = "Mes notes</span>"
    index_to = html.find(to)
    # print (index_to)
    
    if index_to == -1:
        raise ValueError("The specified text 'Mes notes</span>' was not found in the HTML.")
    
    snippet = html[max(0, index_to - 300):index_to]
    
    from_text = "form:sidebar_menuid':'"
    to_text = "'})"
    
    index_from = snippet.find(from_text)
    index_to = snippet.find(to_text, index_from)
    
    if index_from == -1 or index_to == -1:
        raise ValueError("The menu id pattern was not found in the snippet.")
    
    menuid = snippet[index_from + len(from_text):index_to]
    
    return menuid

def parse_form_id_note(body):
    # print (body)
    from_text = ""
    to_text = "Date Ascending"
    form_id_note = body[body.index(to_text) - 400:body.index(to_text)]
    
    # print(form_id_note)
    
    from_text = '<div class="EmptyBox10"></div><div id="form:'
    to_text = '" class="ui-datatable ui-widget'
    form_id_note = form_id_note[form_id_note.index(from_text) + len(from_text):form_id_note.index(to_text)]
    
    return form_id_note
