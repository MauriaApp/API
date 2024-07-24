import axios from "axios";
import https from "https";
import url from "url";

import login from "./login.js";

var formId = "";
var formIdNote = "";

function parseViewState(body) {
    const viewState = body.match(
        /<input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="([^"]+)" autocomplete="off" \/>/
    )[1];

    return viewState;
}

function parseFormId(body) {
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

function parseFormIdNote(body) {
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

function parseMenuId(body) {
    var from = "";
    var to = "Mes notes suite aux absences</span>";
    var menuid = body.substring(body.indexOf(to) - 300, body.indexOf(to));
    from = "form:sidebar_menuid':'";
    to = "'})";
    menuid = menuid.substring(menuid.indexOf(from) + from.length, menuid.indexOf(to));

    // console.log(menuid);
    return menuid;
}

function parseNote(body) {
    const noteRows = body.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g);
    if (noteRows === null) {
        console.log("Erreur au niveau des notes (recup des notes)!")

        const result = [];
        // throw new Error("No note found");
        const note = {};
        note.date = "ou pas encore de note.";
        note.code = "";
        note.epreuve = "Erreur";
        note.note = ":(";
        note.coefficient = "";

        result.push(note);
        return result;
    }

    const notes = noteRows.map((row) => {
        const note = {};
        const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
        // console.log(cells);
        try {
            note.date = cells[0].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.date = "";
        }

        try {
            note.code = cells[1].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.code = "";
        }

        try {
            note.epreuve = cells[2].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.epreuve = "";
        }

        try {
            note.note = cells[3].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.note = "";
        }

        try {
            note.coefficient = cells[4].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.coefficient = "";
        }

        try {
            note.moyenne = cells[5].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.moyenne = "";
        }

        try {
            note.min = cells[6].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.min = "";
        }

        try {
            note.max = cells[7].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.max = "";
        }

        try {
            note.mediane = cells[8].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.mediane = "";
        }

        try {
            note.ecartType = cells[9].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.ecartType = "";
        }

        try {
            note.commentaire = cells[10].match(
                /<span class="preformatted ">([^<]+)<\/span>/
            )[1];
        } catch (error) {
            note.commentaire = "";
        }

        return note;
    });
    return notes;
}

async function getViewState(url, sessionId) {
    const res = await axios.get(url, {
        headers: {
            Cookie: `JSESSIONID=${sessionId}`,
        },
    });

    parseFormId(res.data);

    return parseViewState(res.data);
}

async function postMainSidebar(viewState, sessionId) {
    const res = await axios.post(
        "https://aurion.junia.com/faces/MainMenuPage.xhtml",
        new url.URLSearchParams({
            "javax.faces.partial.ajax": "true",
            "javax.faces.partial.source": formId,
            "javax.faces.partial.execute": formId,
            "javax.faces.partial.render": "form:sidebar",
            "webscolaapp.Sidebar.ID_SUBMENU": "submenu_44413",
            [formId]: formId,
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

async function postMainSidebarNote(viewState, sessionId, menuId) {
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
    // console.log(res.data);
    formIdNote = parseFormIdNote(res.data);
    return parseViewState(res.data);
}

async function getNoteViewState(sessionId) {
    const res = await axios.get(
        "https://aurion.junia.com/faces/ChoixIndividu.xhtml",
        {
            headers: {
                Cookie: `JSESSIONID=${sessionId}`,
            },
        }
    );
    return parseViewState(res.data);
}

async function postNote(viewState, sessionId) {

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

export async function getAllAbsNote(email, password) {
    // console.time('ExecutionTime')

    const res = await login(email, password);
    if (res[1] !== 302) {
        const result = [];
        // throw new Error("No note found");
        const note = {};
        note.date = "Veuillez vous reconnecter.";
        note.code = "";
        note.epreuve = "Erreur email ou mdp";
        note.note = ":(";
        note.coefficient = "";
        note.commentaire = "";

        result.push(note);
        return result;
    }


    const sessionId = res[0];
    // console.log(sessionId);

    try {
        let viewState = await getViewState("https://aurion.junia.com/", sessionId);
        // console.log(`main viewState: ${viewState}`);
        try {
            const menuid = await postMainSidebar(viewState, sessionId);
            // console.log(`menuid: ${menuid}`);
            try {
                viewState = await postMainSidebarNote(viewState, sessionId, menuid);
                // console.log(`note viewState: ${viewState}`);
                try {
                    const notes = await postNote(viewState, sessionId);
                    // console.log(notes);
                    try {
                        const final = parseNote(notes);
                        // console.log(final);
                        // console.timeEnd('ExecutionTime');
                        return (final);


                    } catch (error) {
                        console.log("Erreur au niveau des notes (parsenote) !")

                        const result = [];
                        // throw new Error("No note found");
                        const note = {};
                        note.date = "";
                        note.code = "";
                        note.epreuve = "Erreur ou pas de note";
                        note.note = ":(";
                        note.coefficient = "";
                        note.commentaire = "";

                        result.push(note);
                        return result;
                    }

                } catch (error) {
                    console.log("Erreur au niveau des notes (postnote) !")

                    const result = [];
                    // throw new Error("No note found");
                    const note = {};
                    note.date = "Contactez moi (page support)";
                    note.code = "";
                    note.epreuve = "Erreur inconnue";
                    note.note = ":(";
                    note.coefficient = "";
                    note.commentaire = "";

                    result.push(note);
                    return result;
                }

            } catch (error) {
                console.log("Erreur au niveau des notes (postmainsidebarnote) !")

                const result = [];
                // throw new Error("No note found");
                const note = {};
                note.date = "Contactez moi (page support)";
                note.code = "";
                note.epreuve = "Erreur inconnue";
                note.note = ":(";
                note.coefficient = "";
                note.commentaire = "";

                result.push(note);
                return result;
            }
        } catch (error) {
            console.log("Erreur au niveau des notes (postmainsidebar) !")

            const result = [];
            // throw new Error("No note found");
            const note = {};
            note.date = "Contactez moi (page support)";
            note.code = "";
            note.epreuve = "Erreur";
            note.note = ":(";
            note.coefficient = "";
            note.commentaire = "";

            result.push(note);
            return result;
        }
    } catch (error) {
        console.log("Erreur au niveau des notes (getviewstate) !")

        const result = [];
        // throw new Error("No note found");
        const note = {};
        note.date = "Contactez moi (page support)";
        note.code = "";
        note.epreuve = "Erreur";
        note.note = ":(";
        note.coefficient = "";
        note.commentaire = "";

        result.push(note);
        return result;
    }
}
