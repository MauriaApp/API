import axios from "axios";

export async function getAssos() {
    const res = await axios("https://mauriacms.fly.dev/api/associations?populate=*");

    const jsonData = await res.data;

    const data = jsonData["data"];
    // console.log(data);

    let assos = [];

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

    // sort les assos par ordre alphabétique sans prendre en compte les majuscules
    assos.sort((a, b) => a.name.localeCompare(b.name, 'fr', {ignorePunctuation: true}));


    return assos;
}


// console.log(await getAssos());