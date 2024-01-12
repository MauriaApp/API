import https from "node:https";

export default async function login(email: string, password: string): Promise<[string, number]> {

    email = encodeURIComponent(email);
    password = encodeURIComponent(password);

    const payload = `username=${email}&password=${password}&j_idt28=`;

    const options = {
        hostname: "aurion.junia.com",
        path: "/login",
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            "Connection": "keep-alive",
        },
    };

    const ye = new Promise<[string, number]>((resolve) => {
        const req = https.request(options, function (res) {
            if (res.statusCode) {
                req.destroy();
                const cookie = res.headers["set-cookie"]?.[0]?.split(";")?.[0]?.split("=")?.[1] || "";
                return resolve([cookie, res.statusCode]);
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
