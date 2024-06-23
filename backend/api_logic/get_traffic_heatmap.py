import requests
from PIL import Image
import math
import base64
from io import BytesIO
import random

api_key = 'TAllBSgd0-4_VT-zuAMS8ML1hAKRpL4wwxSqhxA4cnw'

def lat_lon_to_tile_coords(lat, lon, zoom):
    """
    Converts latitude and longitude to tile coordinates at a given zoom level.
    
    Args:
    lat (float): Latitude.
    lon (float): Longitude.
    zoom (int): Zoom level.
    
    Returns:
    dict: Dictionary containing 'lat_rad', 'n', 'xTile', and 'yTile'.
    """
    # Convert latitude to radians
    lat_rad = lat * math.pi / 180
    
    # Calculate the number of tiles at this zoom level
    n = math.pow(2, zoom)
    
    # Calculate xTile and yTile
    x_tile = n * ((lon + 180) / 360)
    y_tile = n * (1 - (math.log(math.tan(lat_rad) + 1 / math.cos(lat_rad)) / math.pi)) / 2
    
    # Return the results
    return {
        'lat_rad': round(lat_rad, 3),
        'n': int(n),
        'xTile': round(x_tile, 2),
        'yTile': round(y_tile, 2)
    }

def pil_image_to_base64(image):
    """
    Convert a PIL image to a Base64 string.

    :param image: PIL Image object
    :return: Base64 encoded string
    """
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
    return img_str

def get_images(x,y,z):
    tile_coords = lat_lon_to_tile_coords(x,y, z)
    x = int(tile_coords['xTile'])
    y = int(tile_coords['yTile'])

    # Fetch the map tile
    map_tile_url = f"https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png?apiKey={api_key}"
    map_response = requests.get(map_tile_url)
    if map_response.status_code == 200 and map_response.headers['Content-Type'].startswith('image'):
        # Get the raw image bytes
        image_data = map_response.content
        # Save the image data to a file
        with open('received_image.png', 'wb') as file:
            file.write(image_data)
    else:
        raise Exception("Failed to fetch map tile or content is not an image")


    traffic_tile_url = f"https://traffic.maps.hereapi.com/v3/flow/mc/{z}/{x}/{y}/png?apiKey={api_key}"
    traffic_response = requests.get(traffic_tile_url)
    if traffic_response.status_code == 200 and traffic_response.headers['Content-Type'].startswith('image'):
        image_data = traffic_response.content
        # Save the image data to a file
        with open('traffic_image.png', 'wb') as file:
            file.write(image_data)
    else:
        raise Exception("Failed to fetch traffic tile or content is not an image")

    detailed_satellite_tile_url = f"https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png?style=explore.satellite.day&ppi=400&size=512&apiKey={api_key}"
    detailed_satellite_response = requests.get(detailed_satellite_tile_url)
    if detailed_satellite_response.status_code == 200 and detailed_satellite_response.headers['Content-Type'].startswith('image'):
        image_data = detailed_satellite_response.content
        # Save the image data to a file
        with open('detailed_satellite_image.png', 'wb') as file:
            file.write(image_data)
    else:
        raise Exception("Failed to fetch satellite tile or content is not an image")

    # environmental_zones_url = f"https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png?size=512&features=environmental_zones:all,pois:disabled"
    # environmental_zones_response = requests.get(environmental_zones_url)
    # if environmental_zones_response.status_code == 200 and environmental_zones_response.headers['Content-Type'].startswith('image'):
    #     image_data = environmental_zones_response.content
    #     # Save the image data to a file
    #     with open('environmental_zones_image.png', 'wb') as file:
    #         file.write(image_data)
    # else:
    #     raise Exception("Failed to fetch environmental zone tile or content is not an image")

    background = Image.open("received_image.png")
    foreground = Image.open("traffic_image.png")

    background.paste(foreground, (0, 0), foreground)
    img_str = pil_image_to_base64(background)
    background.save('heatmap.jpeg')
    n = random.randint(0, 100)
    heat_map_file_name = 'heatmap' + str(n) + '.jpeg'
    path = '/Users/akashnambiar/Documents/BerkHackathon/UrbanAlchemist/frontend/public'
    background.save(path + heat_map_file_name)

    # environmental_zones = Image.open("environmental_zones_image.png")
    # environmental_zones.save('environment.jpeg')
    # environment_file_name = 'environment' + str(n) + '.jpeg'
    # environmental_zones.save(path + environment_file_name)

    detailed_satellite = Image.open("detailed_satellite_image.png")
    detailed_satellite.save('satellite.jpeg')
    detailed_satellite_name = 'satellite' + str(n) + '.jpeg'
    detailed_satellite.save(path + detailed_satellite_name)

    return {
        'response': 200,
        'path': './' + heat_map_file_name,
        # 'environment_path': './' + environment_file_name,
        'detailed_satellite_path': './' + detailed_satellite_name,

    }
