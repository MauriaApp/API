import axios from "axios";

export async function getMsg() {
    const res = await axios("https://mauriacms.fly.dev/api/home-messages");

    const jsonData = await res.data;

    const data = jsonData["data"];
    // console.log(data);


    const title = data[0].attributes.title;
    const message = data[0].attributes.message;
    const msg = {
        title: title,
        message: message
    }

    return msg;
}

// console.log(await getMsg());