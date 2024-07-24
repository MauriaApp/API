import axios from "axios";
import url from "url";
import login from "./login.js";

var formId = "";

function parseViewState(body) {
    // from <input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="6319028752716817461:-3967221286258128993" autocomplete="off" />
    const viewState = body.match(
        /<input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="([^"]+)" autocomplete="off" \/>/
    )[1];
    return viewState;
}

function parseMenuId(body) {
    var from = "";
    var to = "Planning";
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
    var formid = body.substring(body.indexOf(to), body.indexOf(to)+ 300);
    from = "{PrimeFaces.ab({s:";
    to = ",f:";
    formid = formid.substring(formid.indexOf(from) + from.length, formid.indexOf(to));

    // console.log(formid);
    formId = formid.replace(/"/g, '');
    return 0;
}

function parseFormIdPlanning(body) {
    // console.log(body);
    var from = "";
    var to = `class="schedule"><div`;
    var formid = body.substring(body.indexOf(to)-300, body.indexOf(to)+100);
    from = "</script> <br /> <br /><div id=";
    to = ` class="schedule">`;
    formid = formid.substring(formid.indexOf(from) + from.length, formid.indexOf(to));

    // console.log(formid);
    formId = formid.replace(/"/g, '');
    return 0;
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

async function postMainSidebarPlan(viewState, sessionId, menuId) {
    // use this payload : 'form=form&form%3AlargeurDivCenter=615&form%3Asauvegarde=&form%3Aj_idt772_focus=&form%3Aj_idt772_input=44323&javax.faces.ViewState=-5056887933331458699%3A-891539684155069079&form%3Asidebar=form%3Asidebar&form%3Asidebar_menuid=3_1'
    // const menuId = "1";
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
    parseFormIdPlanning(res.data);
    return parseViewState(res.data);
}


async function postPlan(viewState, sessionId, start, end, today, week, year) {
    start = String((start - 604800000));
    end = String((end + 2 * 2629800000));
    today = String(today);
    week = String(week);
    year = String(year);


    const axiosRes = await axios.post(
        "https://aurion.junia.com/faces/Planning.xhtml",
        new url.URLSearchParams({
            "javax.faces.partial.ajax": "true",
            "javax.faces.source": formId,
            "javax.faces.partial.execute": formId,
            "javax.faces.partial.render": formId,
            [formId]: formId,
            [formId + "_start"]: start,
            [formId + "_end"]: end,
            // "form:j_idt152_start": "1667775600000",
            // "form:j_idt152_end": "1668294000000",
            form: "form",
            "form:largeurDivCenter": "1236",
            "form:date_input": today,
            "form:week": week+"-"+year,
            [formId + "_view"]: "agendaWeek",
            "form:offsetFuseauNavigateur": "-3600000",
            "form:onglets_activeIndex": "0",
            "form:onglets_scrollState": "0",
            "form:j_idt236_focus": "",
            "form:j_idt236_input": "44323",
            "javax.faces.ViewState": viewState,
        }).toString(),
        {
            headers: {
                Cookie: `JSESSIONID=${sessionId}`,
                "Content-type": "application/x-www-form-urlencoded",
            },
        }
    );

    // console.log(axiosRes.data);

    var data = (axiosRes.data);
    

    data = data.match(/\[\{"id"(.*?)]]/)[0];
    data = data.slice(0, -3);
    return data;
}

async function prout(viewState, sessionId, planning) {

    planning = JSON.parse(planning);

    let detailPlanning = [];

    let len = planning.length;
    if (len > 20) {
        len = 20;
    }

    for (let i = 0; i < len ; i++) {
        const element = planning[i];
        // console.log(element.id);



        const axiosRes = await axios.post(
            "https://aurion.junia.com/faces/Planning.xhtml",
            new url.URLSearchParams({
                "javax.faces.partial.ajax": "true",
                "javax.faces.source": "form:j_idt117",
                "javax.faces.partial.execute": "form:j_idt117",
                "javax.faces.partial.render": "form:modaleDetail form:confirmerSuppression",
                "javax.faces.behavior.event": "eventSelect",
                "javax.faces.partial.event": "eventSelect",
                "form:j_idt117_selectedEventId": element.id,
                "form": "form",
                "form:largeurDivCenter": "927",
                "form:j_idt117_view": "agendaWeek",
                "form:offsetFuseauNavigateur": "-3600000",
                "form:j_idt237_focus": "",
                "form:j_idt237_input": "44323",
                "javax.faces.ViewState": viewState,
            }).toString(),
            {
                headers: {
                    Cookie: `JSESSIONID=${sessionId}`,
                    "Content-type": "application/x-www-form-urlencoded",
                },
            }
        );
        // console.log(axiosRes.data);

        var data = (axiosRes.data);
        detailPlanning.push(data);
    }

    return detailPlanning;
}


export async function getPlanning(email, password, start, end) {
    // console.time('ExecutionTime')
    const today = start;

    var date = new Date(start);
    start = date.getTime();

    var date = new Date(start);
    date.setMonth(date.getMonth() + 2);
    end = date.getTime();

    // console.log(start, end, today);

    const week = start;     // ca marche pas mais osef en vrai
    const year = start;     // pareil

    // console.log(start, end, today, week, year);


    const res = await login(email, password);
    if (res[1] !== 302) {
        throw new Error("Login failed");
    }

    const sessionId = res[0];
    // console.log(sessionId);


    let viewState = await getViewState("https://aurion.junia.com/", sessionId);
    // console.log(`main viewState: ${viewState}`);

    const menuid = await postMainSidebar(viewState, sessionId);


    viewState = await postMainSidebarPlan(viewState, sessionId, menuid);
    // console.log(`note viewState: ${viewState}`);

    let planning = await postPlan(viewState, sessionId, start, end, today, week, year);
    // console.log(planning);

    planning = await prout(viewState, sessionId, planning);

    try {
        const final = planning;
        // console.log(final);
        // console.timeEnd('ExecutionTime');
        return (final);
    } catch (error) {
        throw error;
    }
}