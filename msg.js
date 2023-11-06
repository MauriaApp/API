import axios from "axios";

export async function getMsg() {
    // const res = await axios("https://mauriacms.fly.dev/api/home-messages");

    // const jsonData = await res.data;

    // const data = jsonData["data"];
    // // console.log(data);


    // const title = data[0].attributes.title;
    // const message = data[0].attributes.message;
    // const msg = {
    //     title: title,
    //     message: message
    // }

    const msg = {
        title : "Bonne journée !",
        message : "Tout est réglé ! N'OUBLIEZ PAS DE METTRE A JOUR LE PLANNING (ce n'est pas encore automatique !)"
    }

    return msg;
}

// console.log(await getMsg());