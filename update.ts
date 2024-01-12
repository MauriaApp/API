import axios, { AxiosResponse } from "axios";

interface Update {
    version: string;
    date: string;
    titleVisu: string;
    contentVisu: string;
    titleDev: string;
    contentDev: string;
}

export async function getUpdate(): Promise<Update[]> {
    const res: AxiosResponse<unknown> = await axios.get("https://mauriacms.fly.dev/api/updates");

    const jsonData: any = res.data;

    const data = jsonData["data"];

    let updates: Update[] = [];

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

// console.log(getUpdate());