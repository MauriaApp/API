import requests

async def login(auth):
    email = requests.utils.quote(auth.username)
    password = requests.utils.quote(auth.password)

    payload = f'username={email}&password={password}&j_idt28='
    # print(payload)
        
    headers = {
        "Content-type": "application/x-www-form-urlencoded",
        "Connection": "keep-alive",
    }

    response = requests.post("https://aurion.junia.com/login", data=payload, headers=headers)

    print(response.headers, response.status_code)
    
    if response.status_code == 302:
        cookie = response.headers["Set-Cookie"].split(";")[0].split("=")[1]
        return cookie, response.status_code
    
    else :
        return None, response.status_code

    response.close()
