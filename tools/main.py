import httpx

async def get_tools(BASE_URL):
    url = BASE_URL+"/sports"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        json_data = response.json()

    data = json_data["data"]

    tools = []
    for item in data:
        attributes = item["attributes"]
        desc = attributes["desc"]
        button = attributes["name"]
        url = attributes["contact"]

        tools.append({
            "desc": desc,
            "button": button,
            "url": url
        })

    return tools
