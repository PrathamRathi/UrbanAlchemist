import requests
streetview_url = "https://maps.googleapis.com/maps/api/streetview"


parameters = {
    "size": "400x400",                   # Size of the image
    "location": "47.5763831,-122.4211769",  # Latitude and longitude of the location
    "fov": "80",                         # Field of view (FOV)
    "heading": "70",                     # Heading (direction the camera is pointing in)
    "pitch": "0",                        # Pitch (up/down angle of the camera)
    "key": "AIzaSyAYPCPC3qF1lro_PG7SDUIfHksMt-8Ro5w",               # Your Google Maps API Key
    # Optional: You may include a 'signature' parameter if required by your use case
    # "signature": "YOUR_SIGNATURE"
}


response = requests.get(streetview_url, params=parameters)


if response.status_code == 200:
    # Save the image to a file
    with open("streetview_image.jpg", "wb") as f:
        f.write(response.content)
    print("Image saved successfully.")
else:
    print("Error:", response.status_code, response.text)
