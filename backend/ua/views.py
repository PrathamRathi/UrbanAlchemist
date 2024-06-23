from django.shortcuts import render
from django.shortcuts import render, HttpResponse
import googlemaps
from django.shortcuts import render
from django.http import HttpResponse
import json
import requests

# Create your views here.

GOOGLE_MAPS_API_KEY = ""
def traffic_request(request):
    if request.method != 'GET':
        requests.get('https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=visualization&v=weekly')
        data = json.loads(request.body.decode())
        zoom = data.get('zoom')
        center = data.get('center') # or 'center/lat'
        lat = center.lat
        lng = center.lng
        return render(request, "users.html")
    else: # current GET request
        # placeholder code
        response = requests.get('https://jsonplaceholder.typicode.com/users')

        #convert reponse data into json
        users = response.json()
        print(users)
        for u in users:
            print(u.get('name'))
        # print(users[0].get('name'))
        return render(request, "users.html", {'users': users})
        return HttpResponse("Hi")


