from django.shortcuts import render
from django.http import JsonResponse
from django.http import QueryDict
from django.views.decorators.csrf import csrf_exempt
#from ..api_logic import traffic_data_func as td
import api_logic.traffic_data_func as td

@csrf_exempt
def traffic_request(request):
    print(request.GET)
    neLat, neLon = request.GET['neLat'], request.GET['neLng']
    swLat, swLon = request.GET['swLat'], request.GET['swLng']
    output = td.get_traffic_data(f"{swLat},{swLon},{neLat},{neLon}")
    print(output)
    return JsonResponse(output)

def model_analysis(request):
    return []