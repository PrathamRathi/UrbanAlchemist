import requests
streetview_url = "https://maps.googleapis.com/maps/api/streetview"
staticmap_url = "https://maps.googleapis.com/maps/api/staticmap"


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

static_parameters = {
    "key": "AIzaSyAYPCPC3qF1lro_PG7SDUIfHksMt-8Ro5w",
    "lat": 23.03,
    "lng": 72.58,
    "zoom": 6
}


response = requests.get(streetview_url, params=parameters)
"https://maps.googleapis.com/maps/api/staticmap?center=23.03,72.58&zoom=6&size=640x400&path=weight:3|color:blue|enc:aofcFz_bhVJ[n@ZpAp@t@b@uA%60FuAzEoCdJiDpLs@VM@y@s@oBcBkAw@cCoAuBu@eEaAiAa@iAi@w@a@o@g@g@k@e@u@uAaCc@i@w@y@eAo@i@UaBc@kAGo@@]JyKA}EC{G?q@?IGKCeGA{CAyCAyEAwEBaFAkJ?yGEyAIiLAiB?{@BcBJ}@@aBGwBEo@A@j@BjBFTHjEl@fOD%60C?|@RARAJERWPL@FE^S%60AI%60A&key=AIzaSyAYPCPC3qF1lro_PG7SDUIfHksMt-8Ro5w"

if response.status_code == 200:
    # Save the image to a file
    with open("streetview_image.jpg", "wb") as f:
        f.write(response.content)
    print("Image saved successfully.")
else:
    print("Error:", response.status_code, response.text)
