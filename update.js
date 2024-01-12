import axios from "axios";

export async function getUpdate() {
    const res = await axios("https://mauriacms.fly.dev/api/updates");

    const jsonData = await res.data;

    const data = jsonData["data"];
    // console.log(data);

    let updates = [];

    // Récupérer les valeurs spécifiques
    for (let i in data) {
        const version = data[i].attributes.version;
        const date = data[i].attributes.date;
        const titleVisu = data[i].attributes.titleVisu;
        const contentVisu = data[i].attributes.contentVisu;
        const titleDev = data[i].attributes.titleDev;
        const contentDev = data[i].attributes.contentDev;

        updates.push({
            version: version,
            date: date,
            titleVisu: titleVisu,
            contentVisu: contentVisu,
            titleDev: titleDev,
            contentDev: contentDev,
        });        
    }

    return updates;
}


// console.log(await getUpdate());  