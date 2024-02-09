import { JSDOM } from 'jsdom';
import moment from 'moment';

import dotenv from "dotenv";
dotenv.config();

const Cookie = process.env.COOKIE;

async function fetchData() {

    // Récupérer la date d'hier au format YYYY-MM-DD
    const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split('T')[0];

    // Construire l'URL avec le paramètre de filtre pour récupérer les événements à partir d'hier
    const url = `https://myjunia.sharepoint.com/sites/lifeoncampus/_api/web/lists/getbytitle('calendrier test 2 life on campus')/items?$filter=EventDate ge '${formattedYesterday}'`;


    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'fr-FR',
            'Accept-Encoding': 'gzip, deflate, br',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Connection': 'keep-alive',
            'Cookie': Cookie,
        },
    });

    const text = await response.text();
    // console.log(text);

    return text;

}


// Fonction pour extraire les détails de l'événement du XML
function extractEventDetails(xmlString) {
    const dom = new JSDOM(xmlString, { contentType: "text/xml" });
    const document = dom.window.document;

    const events = Array.from(document.querySelectorAll("entry")).map(event => {

        const start = moment(event.querySelector("d\\:EventDate").textContent.trim()).add(1, 'hour').toDate();
        const end = moment(event.querySelector("d\\:EndDate").textContent.trim()).add(1, 'hour').toDate();
        const duration = moment.duration(end - start).asHours();

        return {
            id: event.querySelector("d\\:ID").textContent.trim() || "Pas d'ID", // Assurez-vous que "ID" est le bon nom de balise

            title: event.querySelector("d\\:Title").textContent.trim() || "Pas de titre", // Assurez-vous que "Title" est le bon nom de balise
            description: event.querySelector("d\\:Description").textContent.trim() || "Pas de description", // Assurez-vous que "Description" est le bon nom de balise

            start : start || "Pas de date de début",
            end : end || "Pas de date de fin",
            duration : duration || "Pas de durée",

            location: event.querySelector("d\\:Location").textContent.trim() || "Pas d'endroit défini", // Assurez-vous que "Location" est le bon nom de balise

            image: "https://myjunia.sharepoint.com" + event.querySelector("d\\:BannerUrl").textContent.trim() // Assurez-vous que "Banner" est le bon nom de balise
        };
    });

    events.forEach(event => {
        event.description = event.description.replace(/<[^>]*>?/gm, '').replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
        
        
    });


    return events;
}



export async function getEventJunia(){

    const data = await fetchData();

    const eventDetails = extractEventDetails(data);

    return eventDetails
}

// getEventJunia().then(console.log);