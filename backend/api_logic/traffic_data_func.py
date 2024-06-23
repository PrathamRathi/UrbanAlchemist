import requests
import os

def get_traffic_data(bbox, date_range='2022-03-01T08:00:00Z/2024-03-31T08:00:00Z', aggregate='average'):
    """
    Retrieves traffic flow data from HERE API based on provided parameters.

    Parameters:
    - api_key (str): API key for HERE API.
    - bbox (str): Bounding box coordinates in the format 'min_longitude,min_latitude,max_longitude,max_latitude'.
    - date_range (str): Date range in ISO 8601 format 'start_time/end_time'.
    - aggregate (str, optional): Aggregation type (default is 'average').

    Returns:
    - dict: JSON response data from the API, or None if there's an error.
    """
    # Construct the URL
    module_dir = os.path.dirname(__file__) 
    file_path = os.path.join(module_dir, '../keys/here.txt')

    with open(file_path, 'r') as file:
        api_key = file.read().strip()  # Read and strip any whitespace/newlines
    url = f"https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:{bbox}&apiKey={api_key}&aggregate={aggregate}&time={date_range}"

    try:
        # Make the GET request
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    except requests.exceptions.RequestException as e:
        print(f"Request Exception: {e}")
        return None



    # bbox = '-97.21416527301778,32.64668911540128,-96.23226219684591,32.99291376909479'

