import httpx

async def get_assos(BASE_URL):
    url = BASE_URL+"/associations?populate=*"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        json_data = response.json()

    data = json_data["data"]
    
    assos = []
    for item in data:
        attributes = item["attributes"]
        name = attributes["name"]
        desc = attributes["desc"]
        contact = attributes["contact"]
        image = attributes["image"]["data"]["attributes"]["url"]

        assos.append({
            "name": name,
            "desc": desc,
            "contact": contact,
            "image": "https://mauriacms.fly.dev" + image,
        })

    # Trier les associations par ordre alphabétique sans prendre en compte les majuscules
    assos.sort(key=lambda x: x["name"].lower())

    return assos
