import { JSDOM } from 'jsdom';
import moment from 'moment';

import dotenv from "dotenv";
dotenv.config();

async function fetchData() {

    // Récupérer la date d'hier au format YYYY-MM-DD
    const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split('T')[0];

    // Construire l'URL avec le paramètre de filtre pour récupérer les événements à partir d'hier
    const url = `https://myjunia.sharepoint.com/sites/lifeoncampus/_api/web/lists/getbytitle('calendrier test 2 life on campus')/items?$filter=EventDate ge '${formattedYesterday}'`;


    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'fr-FR',
            'Accept-Encoding': 'gzip, deflate, br',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Connection': 'keep-alive',
            'Cookie': 'MSFPC=GUID=3a602b7f709f4d26926e53c42dd7851a&HASH=3a60&LV=202211&V=4&LU=1669495090685; MicrosoftApplicationsTelemetryDeviceId=9e2ba6a4-1e64-4a3d-bf84-881478be5db3; OneNoteWacDataCenter=GEU5; WacDataCenter=GEU6; ScaleCompatibilityDeviceId=f7f725d5-f631-4861-bd5b-ab45a464122f; odbn=1; cucg=1; ExcelWacDataCenter=GEU6; ExcelWacDataCenterSetTime=2024-03-30T16:58:32.795Z; WacDataCenterSetTime=2024-03-30T16:58:32.795Z; rtFa=gpxvLf1mi16YXd/CSRozqfA9Izubu20CTGsQCtj5REUmMTllNTFjMTEtZDkxOS00YTk4LTg5OWQtOWI5ZGMzM2Y0ZTA0IzEzMzU2MzU0MDAwNjY5MDc4MSMyYzYzMWFhMS1lMDZlLTgwMDAtN2Q5ZS1kZDg0OTYwM2EyZWIjbWlsby5tb250dW9yaSU0MHN0dWRlbnQuanVuaWEuY29tIzE4ODA3NyN2dEdDYmVUR1BkaXNRS2VodkVzUEYtMWFNSkmoc/0u9/FfYBxrkBNv+XUJcwDVp9lsOTcwjSDXQgUGlGlvoriaH+1Tgar2Hg2YMD8YbxFhjxDYQkfrBLllbfrGwGk58ERwkYipt2IQRfNCleXTDPuZYhRB03z+I+KjUyr4bGm6AydB7bgP8/AI2Mvsi248XrB6JbHbUwV3BtNuPr0ZyU0b2N6Pg7v0M71qDNen95Davw3aqjxiZmxaVppKnFFTsDNuBYis7jj4qGn/GgbbUjTfz+lzg7YMZJEy9hqbWASKBkDftWstQTWe5G+vgNuCRcWKjDWwsOe6lT16/oLe/zWBtDhRhCfQMAJj1nwxYyT/zFHaSozizohavLTdwgAAAA==; SIMI=eyJzdCI6MH0=; FedAuth=77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U1A+VjEzLDBoLmZ8bWVtYmVyc2hpcHwxMDAzMjAwMTczOWI1ZTk5QGxpdmUuY29tLDAjLmZ8bWVtYmVyc2hpcHxtaWxvLm1vbnR1b3JpQHN0dWRlbnQuanVuaWEuY29tLDEzMzU2MzU0MDAwMDAwMDAwMCwxMzI3NDQ0MDE0MjAwMDAwMDAsMTMzNTY0NDA0MDA2NjkwNzQxLDIwMDE6ODYxOjM1MDA6ZjljMDpjY2QyOmY4Mzc6ZTQyZDpiYjgsMiwxOWU1MWMxMS1kOTE5LTRhOTgtODk5ZC05YjlkYzMzZjRlMDQsLDhkYTBlZWVkLTczYmEtNDBlNC04NzczLTU5OWNlNmQzMTk3NywyYzYzMWFhMS1lMDZlLTgwMDAtN2Q5ZS1kZDg0OTYwM2EyZWIsMmM2MzFhYTEtZTA2ZS04MDAwLTdkOWUtZGQ4NDk2MDNhMmViLCwwLDEzMzU2MzU3NjAwNjM3ODY1NywxMzM1NjYxMzIwMDYzNzg2NTcsLCxleUo0YlhOZlkyTWlPaUpiWENKRFVERmNJbDBpTENKNGJYTmZjM050SWpvaU1TSXNJbkJ5WldabGNuSmxaRjkxYzJWeWJtRnRaU0k2SW0xcGJHOHViVzl1ZEhWdmNtbEFjM1IxWkdWdWRDNXFkVzVwWVM1amIyMGlMQ0oxZEdraU9pSmpSbkI0ZG1OU2VIVnJjVXBKZVV4TmRXUlJaVUZCSW4wPSwyNjUwNDY3NzQzOTk5OTk5OTk5LDEzMzU2MzU0MDAwMDAwMDAwMCxkODk0MjQ0Ny1mNGFhLTQwZmUtYTJjNC1hMTQ3MDliM2IxMTgsLCwsLCwwLCwxODgwNzcsRGFEQWZqUVFtcHlPWHgyUnJLX1c1bHZvTFo0LGFZRkhUSEdqeFU1VTg0d3loUUNzWlI1Ni9xWUVQMFRsR3VhMkgrV3gzMTNwMkJiTUxhS21pL1hINkhzcTFoYS9zQnFVNno4OHdPTGI1MWpMVSszUGRMQ3pCb1FHTmZkVXhZdzFmcm9LZ3R1ZmNod2JzYVhOTHROMWVESyt6angxNks5Z3NFQ3ZEdzE3NjJCbUdSQW1JS2x2YzFYM0w3VWI5aThVbVFKOUFPS0JvSXJKSms0WGlOQ3lOOTZ3VzdSTExHQXE3ZnhYN21aVVhOeGhIQVd4VzJ4VDFzdnlpNjJVbGZlV1lpZ1dzdUNmT1RwQzI2OGRVUXpyVkgyN1VXeUU4Ky8ydzE0UFpLbGVhMG1qMFpQcWhvbU1MUkVITnZSa2xaeHNxTXpVMmJ2OFZPZWF6cHA4K1pkb3VpMmE0ZmUxWWNkVmNYU2hzOXpkU3FLYUlNS1VuQT09PC9TUD4=; WSS_FullScreenMode=false',
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