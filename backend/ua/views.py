from django.shortcuts import render
from django.http import JsonResponse
from django.http import QueryDict
from django.views.decorators.csrf import csrf_exempt
#from ..api_logic import traffic_data_func as td
import api_logic.traffic_data_func as td
import api_logic.get_traffic_heatmap as get_heatmap
import api_logic.anthropic as ant

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
    output = {
        'claudeResponse': 'this will be claudes response',
        'highTraffic': 'The selected high traffic areas were (insert 1, 2, 3), with scores of (1,2,3)'
    }
    heatmap_out = get_heatmap.get_images(float(lat),float(lon),int(z))
    output['path'] = heatmap_out['path']
    
    #traffic data
    neLat, neLon = request.GET['neLat'], request.GET['neLng']
    swLat, swLon = request.GET['swLat'], request.GET['swLng']
    print(f"{swLon},{swLat},{neLon},{neLat}")
    tdOut = td.get_traffic_data(f"{swLon},{swLat},{neLon},{neLat}")
    print("tdout", tdOut)
    
    highTraffic = ""
    for loc in tdOut["locations"]:
        highTraffic += f"\t {loc[2]}, {loc[3]}"
    output['highTraffic'] = highTraffic
    
    # ml data
    output['claudeResponse'] = ant.claude_street_view_prompt()
    
    output['claudeResponse'] += "\n"
    output['claudeResponse'] += ant.claude_grade_report_prompt()

    return JsonResponse(output)

@csrf_exempt
def model_analysis(request):
    return []