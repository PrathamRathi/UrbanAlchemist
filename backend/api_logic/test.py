import requests
from PIL import Image
import math
# Replace with your HERE API key
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



# Define the coordinates for the tile
x = 52.53086
y = 13.38662
z = 14

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

from PIL import Image

background = Image.open("received_image.png")
foreground = Image.open("traffic_image.png")

background.paste(foreground, (0, 0), foreground)
background.show()