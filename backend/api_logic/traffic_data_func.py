import requests
import os
import math
import random
from django.http import JsonResponse
import api_logic.maps as mapImage


def calculateTrafficScore(speed, freeFlow, jamFactor, confidence, speedUncapped):
    if freeFlow == 0:
        return 0

    return min(100, max(0, (
        0.4 * (1 - speedUncapped / freeFlow) +
        0.6 * (jamFactor / 10)
    ) * 100))


def get_traffic_data(bbox, date_range='2022-03-01T08:00:00Z/2024-03-31T08:00:00Z', aggregate='average'):
    """
    Retrieves traffic flow data from HERE API based on provided parameters.

    Parameters:
    - api_key (str): API key for HERE API.
    - bbox (str): Bounding box coordinates in the format 'min_longitude,min_latitude,max_longitude,max_latitude'.
    - date_range (str): Date range in ISO 8601 format 'start_time/end_time'.
    - aggregate (str, optional): Aggregation type (default is 'average').

    Returns:
    - dict: JSON response data from the API, or None if there's an error.
    """
    # Construct the URL
    module_dir = os.path.dirname(__file__)
    file_path = os.path.join(module_dir, '../keys/here.txt')

    with open(file_path, 'r') as file:
        api_key = file.read().strip()  # Read and strip any whitespace/newlines
    url = f"https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:{bbox}&apiKey={api_key}&aggregate={aggregate}&time={date_range}"

    try:
        # Make the GET request
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

        HOUSE_LENGTH = 0.00015
        points = []
        for result in data["results"]:
            flow = result["currentFlow"]
            score = calculateTrafficScore(
                0, flow["freeFlow"] if "freeFlow" in flow else 0, flow["jamFactor"] if "jamFactor" in flow else 0, 0, flow["speedUncapped"] if "speedUncapped" in flow else 0)

            for link in result["location"]["shape"]["links"]:
                for i in range(len(link["points"]) - 1):
                    start = link["points"][i]
                    end = link["points"][i + 1]

                    dist = ((end["lat"] - start["lat"]) ** 2 +
                            (end["lng"] - start["lng"]) ** 2) ** 0.5
                    steps = math.ceil(dist / HOUSE_LENGTH)

                    for step in range(steps):
                        scale = step / steps
                        lat = start["lat"] + \
                            (end["lat"] - start["lat"]) * scale
                        lng = start["lng"] + \
                            (end["lng"] - start["lng"]) * scale

                    # numPoints = math.ceil(score / 10)
                    # for _ in range(numPoints):
                    #     offsetLat = (random.random() - 0.5) * 0.0001
                    #     offsetLng = (random.random() - 0.5) * 0.0001
                    points.append(
                        (score, ["description"] if "description" in result["location"] else "", lat, lng))
                    
        ret = sorted(points)[-3:]
        for i, point in enumerate(ret):
            print(i)
            mapImage.write_streetview_images(
                (point[2], point[3]), f"streetview_image{i}.jpg")

        return {"locations": ret}

    except requests.exceptions.RequestException as e:
        print(f"Request Exception: {e}")
        return None

    # bbox = '-97.21416527301778,32.64668911540128,-96.23226219684591,32.99291376909479'
