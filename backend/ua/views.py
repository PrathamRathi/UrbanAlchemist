from django.shortcuts import render
from django.http import JsonResponse
from django.http import QueryDict
from django.views.decorators.csrf import csrf_exempt
#from ..api_logic import traffic_data_func as td
import api_logic.traffic_data_func as td
import api_logic.get_traffic_heatmap as get_heatmap

@csrf_exempt
def traffic_request(request):
    print(request.GET)
    neLat, neLon = request.GET['neLat'], request.GET['neLng']
    swLat, swLon = request.GET['swLat'], request.GET['swLng']
    output = td.get_traffic_data(f"{swLon},{swLat},{neLon},{neLat}")
    #  'bbox:west longitude,south latitude,east longitude,north latitude'"
    print(output)
    return JsonResponse(output)

@csrf_exempt
def heatmap_request(request):
    print(request.GET)
    lat, lon, z = request.GET['lat'], request.GET['lon'], request.GET['z']
    output = get_heatmap.get_images(float(lat),float(lon),int(z))
    print(output)
    return JsonResponse(output)

def model_analysis(request):
    return []