import axios from "axios";
import url from "url";

import login from "./login";

let formId = "";

function parseViewState(body: string): string {
    const match = body.match(
        /<input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="([^"]+)" autocomplete="off" \/>/
    );
    const viewState = match ? match[1] : "";
    return viewState;
}

function parseMenuId(body: string): string {
    let from = "";
    let to = "Mes absences</span>";
    let menuid = body.substring(body.indexOf(to) - 300, body.indexOf(to));
    from = "form:sidebar_menuid':'";
    to = "'})";
    menuid = menuid.substring(menuid.indexOf(from) + from.length, menuid.indexOf(to));

    return menuid;
}

function parseFormId(body: string): number {
    let from = "";
    let to = ">chargerSousMenu = function()";
    let formid = body.substring(body.indexOf(to), body.indexOf(to) + 300);
    from = "{PrimeFaces.ab({s:";
    to = ",f:";
    formid = formid.substring(formid.indexOf(from) + from.length, formid.indexOf(to));

    formId = formid.replace(/"/g, '');
    return 0;
}

function parseAbs(body: string): any[] {
    try {
        body = body.toString();
    } catch (error) {
        console.log("Erreur lors de la conversion du contenu HTML en une chaîne de caractères :", error);
    }

    const absRows = body.match(/<tr data-ri="[^>]*>([\s\S]*?)<\/tr>/g);
    if (absRows === null) {
        console.log("Erreur au niveau des absences (recup des absences) !")

        const result: any[] = [];
        const abs: any = {};
        abs.date = "";
        abs.type = "Erreur";
        abs.duree = "";
        abs.heure = ":(";
        abs.classe = "ou pas d'absences";
        abs.prof = "";
        result.push(abs);

        return result;
    }

    const absences = absRows.map((row) => {
        const abs: any = {}; // Add type annotation to abs object
        const cells = row.match(/<tr data-ri="[^>]*>([\s\S]*?)<\/tr>/g);
        if (cells !== null) { // Handle possibility of cells being null
            abs.date = cells[0].match(
                /<td role="gridcell" style="text-align: left">([^<]+)<\/td>/
            )?.[1] || ""; // Handle possibility of object having a value of null

            let rowrow = cells[0].match(
                /<td role="gridcell">([^<]+)<\/td>/g
            );

            if (rowrow !== null) { // Handle possibility of rowrow being null
                abs.type = rowrow[0].match(
                    /<td role="gridcell">([^<]+)<\/td>/
                )?.[1] || ""; // Handle possibility of object having a value of null

                abs.duree = rowrow[1].match(
                    /<td role="gridcell">([^<]+)<\/td>/
                )?.[1] || ""; // Handle possibility of object having a value of null

                abs.heure = rowrow[2].match(
                    /<td role="gridcell">([^<]+)<\/td>/
                )?.[1] || ""; // Handle possibility of object having a value of null

                abs.classe = rowrow[3].match(
                    /<td role="gridcell">([^<]+)<\/td>/
                )?.[1] || ""; // Handle possibility of object having a value of null

                abs.prof = rowrow[4].match(
                    /<td role="gridcell">([^<]+)<\/td>/
                )?.[1] || ""; // Handle possibility of object having a value of null
            }
        }
        return abs;
    });

    return absences;
}

async function getViewState(url: string, sessionId: string): Promise<string> {
    const res = await axios.get(url, {
        headers: {
            Cookie: `JSESSIONID=${sessionId}`,
        },
    });

    parseFormId(res.data);

    return parseViewState(res.data);
}

async function postMainSidebar(viewState: string, sessionId: string): Promise<string> {
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

    return parseMenuId(res.data);
}

async function postMainSidebarAbs(viewState: string, sessionId: string, menuId: string): Promise<string> {
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

    return res.data;
}

export async function getAllAbsence(email: string, password: string): Promise<any[]> {
    const res = await login(email, password);
    if (res[1] !== 302) {
        console.log("Erreur au niveau des absences (login) !")

        const result: any[] = [];
        const abs: any = {};
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

    try {
        let viewState = await getViewState("https://aurion.junia.com/", sessionId);
        try {
            const menuid = await postMainSidebar(viewState, sessionId);
            try {
                let absences = await postMainSidebarAbs(viewState, sessionId, menuid);
                try {
                    const final = parseAbs(absences);
                    return final;
                } catch (error) {
                    console.log("Erreur / Pas d'abs (parseabs) !")

                    console.log(error);

                    const result: any[] = [];
                    const abs: any = {};
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

                const result: any[] = [];
                const abs: any = {};
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

            const result: any[] = [];
            const abs: any = {};
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

        const result: any[] = [];
        const abs: any = {};
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