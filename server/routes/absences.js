import axios from "axios";
import url from "url";

import login from "./login.js";

var formId = "";

function parseViewState(body) {
    const viewState = body.match(
        /<input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="([^"]+)" autocomplete="off" \/>/
    )[1];
    return viewState;
}

function parseMenuId(body) {
    var from = "";
    var to = "Mes absences</span>";
    var menuid = body.substring(body.indexOf(to) - 300, body.indexOf(to));
    from = "form:sidebar_menuid':'";
    to = "'})";
    menuid = menuid.substring(menuid.indexOf(from) + from.length, menuid.indexOf(to));

    // console.log(menuid);
    return menuid;
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

function parseAbs(body) {

    // convert body to string
    try {
        body = body.toString();
    } catch (error) {
        console.log("Erreur lors de la conversion du contenu HTML en une chaîne de caractères :", error);
    }

    // console.log(body);
    const absRows = body.match(/<tr data-ri="[^>]*>([\s\S]*?)<\/tr>/g);
    if (absRows === null) {
        console.log("Erreur au niveau des absences (recup des absences) !")
        // console.log(body);

        const result = [];
        // throw new Error("No note found");
        const abs = {};
        abs.date = "";
        abs.type = "Erreur";
        abs.duree = "";
        abs.heure = ":(";
        abs.classe = "ou pas d'absences";
        abs.prof = "";
        result.push(abs);

        return result;
    }
    // console.log(absRows);
    const absences = absRows.map((row) => {
        const abs = {};
        const cells = row.match(/<tr data-ri="[^>]*>([\s\S]*?)<\/tr>/g);
        // console.log(cells);
        abs.date = cells[0].match(
            /<td role="gridcell" style="text-align: left">([^<]+)<\/td>/
        )[1];

        let rowrow = cells[0].match(
            /<td role="gridcell">([^<]+)<\/td>/g
        );

        abs.type = rowrow[0].match(
            /<td role="gridcell">([^<]+)<\/td>/
        )[1];

        abs.duree = rowrow[1].match(
            /<td role="gridcell">([^<]+)<\/td>/
        )[1];

        abs.heure = rowrow[2].match(
            /<td role="gridcell">([^<]+)<\/td>/
        )[1];

        try {
            abs.classe = rowrow[3].match(
                /<td role="gridcell">([^<]+)<\/td>/
            )[1];
        } catch (error) {
            abs.classe = "";
        }
        try{
            abs.prof = rowrow[4].match(
                /<td role="gridcell">([^<]+)<\/td>/
            )[1];
        } catch (error) {
            abs.prof = "";
        }
        return abs;
    });
    return absences;
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
            [formId]: formId,
            "webscolaapp.Sidebar.ID_SUBMENU": "submenu_44413",
            form: "form",
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
    // console.log(res.data);
    return parseMenuId(res.data);
}

async function postMainSidebarAbs(viewState, sessionId, menuId) {
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
    return res.data;
}

export async function getAllAbsence(email, password) {
    // console.time('ExecutionTime')

    const res = await login(email, password);
    if (res[1] !== 302) {
        console.log("Erreur au niveau des absences (login) !")

        const result = [];
        // throw new Error("No note found");
        const abs = {};
        abs.date = "";
        abs.type = "Erreur email ou mdp";
        abs.duree = "";
        abs.heure = ":(";
        abs.classe = "Veuillez vous reconnecter.";
        abs.prof = "";
        result.push(abs);

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
                let absences = await postMainSidebarAbs(viewState, sessionId, menuid);
                // console.log(absences);
                try {
                    const final = parseAbs(absences);
                    // console.log(final);
                    // console.timeEnd('ExecutionTime');
                    return (final);


                } catch (error) {
                    console.log("Erreur / Pas d'abs (parseabs) !")

                    console.log(error);
                    // console.log(absences);

                    const result = [];
                    // throw new Error("No note found");
                    const abs = {};
                    abs.date = "";
                    abs.type = "Erreur ou Aucune absence";
                    abs.duree = "";
                    abs.heure = ":(";
                    abs.classe = "";
                    abs.prof = "";
                    result.push(abs);

                    return result;
                }
            } catch (error) {
                console.log("Erreur au niveau des absences (postmainsidebarabs) !")

                const result = [];
                // throw new Error("No note found");
                const abs = {};
                abs.date = "";
                abs.type = "Erreur";
                abs.duree = "";
                abs.heure = ":(";
                abs.classe = "Contactez moi (page support)";
                abs.prof = "";
                result.push(abs);

                return result;
            }
        } catch (error) {
            console.log("Erreur au niveau des absences (postmainsidebar) !")

            const result = [];
            // throw new Error("No note found");
            const abs = {};
            abs.date = "";
            abs.type = "Erreur";
            abs.duree = "";
            abs.heure = ":(";
            abs.classe = "Contactez moi (page support)";
            abs.prof = "";
            result.push(abs);

            return result;
        }
    } catch (error) {
        console.log("Erreur au niveau des absences (getviewstate) !")

        const result = [];
        // throw new Error("No note found");
        const abs = {};
        abs.date = "";
        abs.type = "Erreur";
        abs.duree = "";
        abs.heure = ":(";
        abs.classe = "Contactez moi (page support)";
        abs.prof = "";
        result.push(abs);

        return result;
    }
}