import requests
import pandas as pd
import folium
import json

# Open the file in read mode
with open("../keys/here.txt", 'r') as file:
    # Read the file's contents
    api_key = file.read()


# Define the bounding box coordinates and date range
bbox = '-97.21416527301778,32.64668911540128,-96.23226219684591,32.99291376909479'
date_range = '2022-03-01T08:00:00Z/2022-03-31T08:00:00Z'
aggregate = 'average'

# Construct the URL
# url = f'https://traffic.ls.hereapi.com/traffic/6.3/flow.json?apiKey=&bbox={bbox}&date={date_range}&aggregate={aggregate}'

url = f"https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:{bbox}&apiKey={api_key}&aggregate={aggregate}"


# Make the GET request
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()
    # print(len(data["location"]["shape"]["links"]))
    # Serialize JSON data to a string

else:
    print(f"Error: {response.status_code}")
    print(response.text)



