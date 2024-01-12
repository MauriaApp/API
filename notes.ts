
import login from "./login";
import axios from 'axios';
import https from 'https';
import url from 'url';

var formId = "";
var formIdNote = "";

function parseViewState(body: { match: (arg0: RegExp) => any[]; }) {
    const viewState = body.match(
        /<input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="([^"]+)" autocomplete="off" \/>/
    )[1];

    return viewState;
}

function parseFormId(body: string) {
    // console.log(body);
    var from = "";
    var to = ">chargerSousMenu = function()";
    var formid = body.substring(body.indexOf(to), body.indexOf(to) + 300);
    from = "{PrimeFaces.ab({s:";
    to = ",f:";
    formid = formid.substring(formid.indexOf(from) + from.length, formid.indexOf(to));

    // console.log(formid);
    formId = formid.replace(/"/g, '');
    return 0;
}

function parseFormIdNote(body: string): string {
    var from = "";
    var to = "Date Ascending";
    var formIdNote = body.substring(body.indexOf(to) - 400, body.indexOf(to));
    // console.log(formIdNote);

    from = `<div class="EmptyBox10"></div><div id="form:`;
    to = `" class="ui-datatable ui-widget`;
    formIdNote = formIdNote.substring(formIdNote.indexOf(from) + from.length, formIdNote.indexOf(to));

    // console.log(formIdNote);
    return formIdNote;
}

function parseMenuId(body: string): string {
    const from = "form:sidebar_menuid':'";
    const to = "'})";
    const startIndex = body.indexOf(from) + from.length;
    const endIndex = body.indexOf(to);
    const parsedMenuId = body.substring(startIndex, endIndex);

    return parsedMenuId;
}

interface Note {
    date: string;
    code: string;
    epreuve: string;
    note: string;
    coefficient: string;
}

function parseNote(body: string): Note[] {
    const noteRows = body.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g);
    if (noteRows === null) {
        const result: Note[] = [];
        const note: Note = {
            date: "ou pas encore de note.",
            code: "",
            epreuve: "Erreur",
            note: ":(",
            coefficient: "",
        };
        result.push(note);
        return result;
    }

    const notes = noteRows.map((row) => {
        const note: Note = {
            date: "",
            code: "",
            epreuve: "",
            note: "",
            coefficient: "",
        };
        const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
        if (cells) {
            try {
                const dateMatch = cells[0].match(/<span class="preformatted ">([^<]+)<\/span>/);
                note.date = dateMatch ? dateMatch[1] : "";
            } catch (error) {
                note.date = "";
            }

            try {
                const codeMatch = cells[1].match(/<span class="preformatted ">([^<]+)<\/span>/);
                note.code = codeMatch ? codeMatch[1] : "";
            } catch (error) {
                note.code = "";
            }

            try {
                const epreuveMatch = cells[2].match(/<span class="preformatted ">([^<]+)<\/span>/);
                note.epreuve = epreuveMatch ? epreuveMatch[1] : "";
            } catch (error) {
                note.epreuve = "";
            }

            try {
                const coefficientMatch = cells[4].match(/<span class="preformatted ">([^<]+)<\/span>/);
                note.coefficient = coefficientMatch ? coefficientMatch[1] : "";
            } catch (error) {
                note.coefficient = "";
            }
        }

        return note;
    });

    return notes;
}

async function getViewState(url: string, sessionId: string): Promise<string> {
    const res = await axios.get(url, {
        headers: {
            Cookie: `JSESSIONID=${sessionId}`,
        },
    });

    return parseViewState(res.data);
}

async function postMainSidebar(viewState: string, sessionId: string): Promise<string> {
    const formId = parseFormId(viewState);

    const res = await axios.post(
        "https://aurion.junia.com/faces/MainMenuPage.xhtml",
        new url.URLSearchParams({
            "javax.faces.partial.ajax": "true",
            "javax.faces.partial.source": formId.toString(), // Convert formId to string
            "javax.faces.partial.execute": formId.toString(), // Convert formId to string
            "javax.faces.partial.render": "form:sidebar",
            "webscolaapp.Sidebar.ID_SUBMENU": "submenu_44413",
            [formId.toString()]: formId.toString(), // Convert formId to string
            "form": "form",
            "form:largeurDivCenter": "615",
            "form:sauvegarde": "",
            "form:j_idt772_focus": "",
            "form:j_idt772_input": "44323",
            "javax.faces.ViewState": viewState,
        }).toString(),
        {
            headers: {
                Cookie: `JSESSIONID=${sessionId}`,
                "Content-type": "application/x-www-form-urlencoded",
            },
        }
    );

    return parseMenuId(res.data);
}

async function postMainSidebarNote(viewState: string, sessionId: string, menuId: string): Promise<string> {
    const res = await axios.post(
        "https://aurion.junia.com/faces/MainMenuPage.xhtml",
        new url.URLSearchParams({
            form: "form",
            "form:largeurDivCenter": "615",
            "form:sauvegarde": "",
            "form:j_idt772_focus": "",
            "form:j_idt772_input": "44323",
            "javax.faces.ViewState": viewState,
            "form:sidebar": "form:sidebar",
            "form:sidebar_menuid": menuId,
        }).toString(),
        {
            headers: {
                Cookie: `JSESSIONID=${sessionId}`,
            },
            maxRedirects: 1,
        }
    );

    return parseFormIdNote(res.data);
}

async function postNote(viewState: string, sessionId: string): Promise<string> {

    const payload = `javax.faces.partial.ajax=true&javax.faces.source=form%3A${formIdNote}&javax.faces.partial.execute=form%3A${formIdNote}&javax.faces.partial.render=form%3A${formIdNote}&form%3A${formIdNote}=form%3A${formIdNote}&form%3A${formIdNote}_pagination=true&form%3A${formIdNote}_first=0&form%3A${formIdNote}_rows=20000&form%3A${formIdNote}_skipChildren=true&form%3A${formIdNote}_encodeFeature=true&form=form&form%3AlargeurDivCenter=1620&form%3AmessagesRubriqueInaccessible=&form%3Asearch-texte=&form%3Asearch-texte-avancer=&form%3Ainput-expression-exacte=&form%3Ainput-un-des-mots=&form%3Ainput-aucun-des-mots=&form%3Ainput-nombre-debut=&form%3Ainput-nombre-fin=&form%3AcalendarDebut_input=&form%3AcalendarFin_input=&form%3A${formIdNote}_reflowDD=0_0&form%3A${formIdNote}%3Aj_idt273%3Afilter=&form%3A${formIdNote}%3Aj_idt275%3Afilter=&form%3A${formIdNote}%3Aj_idt277%3Afilter=&form%3A${formIdNote}%3Aj_idt279%3Afilter=&form%3A${formIdNote}%3Aj_idt281%3Afilter=&form%3A${formIdNote}%3Aj_idt283%3Afilter=&form%3Aj_idt258_focus=&form%3Aj_idt258_input=44323&javax.faces.ViewState=${viewState}`;

    const options = {
        hostname: "aurion.junia.com",
        path: "/faces/ChoixIndividu.xhtml",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: `JSESSIONID=${sessionId}`,
        },
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (d) => {
                data += d;
            });

            res.on("end", () => {
                resolve(data);
            });
        });
        req.on("error", (error) => {
            console.error(error);
        });
        req.write(payload);
        req.end();
    });
}

export async function getAllNote(email: string, password: string): Promise<Note[]> {
    const [sessionId, statusCode] = await login(email, password);
    if (statusCode !== 302) {
        const result: Note[] = [];
        const note: Note = {
            date: "Veuillez vous reconnecter.",
            code: "",
            epreuve: "Erreur email ou mdp",
            note: ":(",
            coefficient: "",
        };
        result.push(note);
        return result;
    }

    try {
        let viewState = await getViewState("https://aurion.junia.com/", sessionId);
        const menuid = await postMainSidebar(viewState, sessionId);
        viewState = await postMainSidebarNote(viewState, sessionId, menuid);
        const notes = await postNote(viewState, sessionId);
        const final = parseNote(notes);
        return final;
    } catch (error) {
        const result: Note[] = [];
        const note: Note = {
            date: "Contactez moi (page support)",
            code: "",
            epreuve: "Erreur inconnue",
            note: ":(",
            coefficient: "",
        };
        result.push(note);
        return result;
    }
}

