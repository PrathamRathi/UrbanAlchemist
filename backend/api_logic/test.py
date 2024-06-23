import requests
from PIL import Image

# Replace with your HERE API key
api_key = 'TAllBSgd0-4_VT-zuAMS8ML1hAKRpL4wwxSqhxA4cnw'

# Define the coordinates for the tile
x = 52.53086
y = 13.38662
z = 12



# Fetch the map tile
map_tile_url = f"https://image.maps.hereapi.com/mia/v3/base/mc/center:{x},{y};zoom={z}/800x400/png?apiKey={api_key}"
map_response = requests.get(map_tile_url)

if map_response.status_code == 200 and map_response.headers['Content-Type'].startswith('image'):
    # Get the raw image bytes
    image_data = map_response.content

    # Save the image data to a file
    with open('received_image.png', 'wb') as file:
        file.write(image_data)
else:
    raise Exception("Failed to fetch map tile or content is not an image")

# Fetch the traffic flow tile

traffic_tile_url = f"https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=logistics.night&apiKey={api_key}"
#traffic_tile_url = f"https://maps.hereapi.com/v3/info?apiKey={api_key}"
traffic_response = requests.get(traffic_tile_url)
print(traffic_response.content)
if traffic_response.status_code == 200 and traffic_response.headers['Content-Type'].startswith('image'):
    image_data = traffic_response
    print(traffic_response)
    # Save the image data to a file
    with open('traffic_image.png', 'wb') as file:
        file.write(image_data)
else:
    raise Exception("Failed to fetch traffic tile or content is not an image")

# # Overlay the traffic tile on the map tile
# combined_tile = Image.alpha_composite(map_tile.convert("RGBA"), traffic_tile.convert("RGBA"))

# # Save the combined image
# combined_tile.save('here_map_with_traffic.png')
# combined_tile.show()