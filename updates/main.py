import httpx

async def get_updates(base_url):
    url = f"{base_url}/updates"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        json_data = response.json()

    data = json_data["data"]

    updates = []
    for item in data:
        attributes = item["attributes"]
        version = attributes["version"]
        date = attributes["date"]
        titleVisu = attributes["titleVisu"]
        contentVisu = attributes["contentVisu"]
        titleDev = attributes["titleDev"]
        contentDev = attributes["contentDev"]

        updates.append({
            "version": version,
            "date": date,
            "titleVisu": titleVisu,
            "contentVisu": contentVisu,
            "titleDev": titleDev,
            "contentDev": contentDev,
        })

    return updates
