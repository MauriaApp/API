import httpx

async def get_msg(BASE_URL):
    url = BASE_URL+"/home-messages"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        json_data = response.json()

    data = json_data["data"]

    if len(data) > 0:
        title = data[0]["attributes"]["title"]
        message = data[0]["attributes"]["message"]
        msg = {
            "title": title,
            "message": message
        }
    else:
        msg = {
            "title": "No Title",
            "message": "No Message"
        }

    return msg
