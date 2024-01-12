import axios from "axios";

interface Assos {
    name: string;
    desc: string;
    contact: string;
    image: string;
}

export async function getAssos(): Promise<Assos[]> {
    const res = await axios.get("https://mauriacms.fly.dev/api/associations?populate=*");

    const jsonData = res.data;

    const data = jsonData["data"];

    let assos: Assos[] = [];

    // Récupérer les valeurs spécifiques
    for (let i in data) {
        const name = data[i].attributes.name;
        const desc = data[i].attributes.desc;
        const contact = data[i].attributes.contact;
        const image = data[i].attributes.image.data.attributes.url;

        assos.push({
            name: name,
            desc: desc,
            contact: contact,
            image: "https://mauriacms.fly.dev" + image,
        });        
    }

    // Trier les assos par ordre alphabétique sans prendre en compte les majuscules
    assos.sort((a, b) => a.name.localeCompare(b.name, 'fr', {ignorePunctuation: true}));

    return assos;
}

// console.log(await getAssos());