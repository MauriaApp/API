import https from "node:https";

export default async function login(email, password) {

    email = encodeURIComponent(email);
    password = encodeURIComponent(password);

    const payload = `username=${email}&password=${password}&j_idt28=`
    // console.log(payload);

    const options = {
        hostname: "aurion.junia.com",
        path: "/login",
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            "Connection": "keep-alive",
        },
    };


    const ye = new Promise((resolve,reject) => {
        const req = https.request(options, function (res) {
            // console.log(`statusCode: ${res.statusCode}`);
            // console.log(`headers: ${JSON.stringify(res.headers)}`);


            if (res.statusCode) {
                req.abort();
                return resolve([res.headers["set-cookie"][0].split(";")[0].split("=")[1],res.statusCode]);
            }
            
            res.on("error", (error) => {
                console.error(error);
            });
        });

        req.write(payload);
        req.end();
    });

    return ye;
}
