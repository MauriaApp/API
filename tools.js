import axios from "axios";

export async function getTools() {
    const res = await axios("https://mauriacms.fly.dev/api/sports");

    const jsonData = await res.data;

    const data = jsonData["data"];
    // console.log(data);

    let tools = [];

    // Récupérer les valeurs spécifiques
    for (let i in data) {
        const desc = data[i].attributes.desc;
        const button = data[i].attributes.name;
        const url = data[i].attributes.contact;

        tools.push({
            desc: desc,
            button: button,
            url: url
        });        
    }

    return tools;
}


// console.log(await getTools());  