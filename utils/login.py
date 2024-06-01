import aiohttp
import asyncio
import urllib.parse

async def login(auth):
    email = urllib.parse.quote(auth.username)
    password = urllib.parse.quote(auth.password)

    payload = f'username={email}&password={password}&j_idt28='
    
    headers = {
        "Content-type": "application/x-www-form-urlencoded",
        "Connection": "keep-alive"
    }

    async with aiohttp.ClientSession() as session:
        async with session.post("https://aurion.junia.com/login", data=payload, headers=headers, allow_redirects=False) as response:
            # print(response.headers, response.status)
            
            if response.status == 302:
                cookie = response.headers["Set-Cookie"].split(";")[0].split("=")[1]
                return cookie, response.status
            else:
                return None, response.status