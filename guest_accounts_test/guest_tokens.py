import requests
import json
import modal
from modal.image import Image

stub = modal.Stub("example-get-started")
image = Image.debian_slim().pip_install("requests")

@stub.function(image=image)
async def get_token(count):
    # Function to get the guest token
    def get_guest_token():
        url = "https://api.twitter.com/1.1/guest/activate.json"
        headers = {
            'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAFXzAwAAAAAAMHCxpeSDG1gLNLghVe8d74hl6k4%3DRUMF4xAQLsbeBhTSRrCiQpJtxoGWeyHrDb5te2jpGskWDFW82F'
        }
        response = requests.post(url, headers=headers)
        return response.json().get('guest_token')

    # Function to get the flow token
    def get_flow_token(guest_token):
        url = "https://api.twitter.com/1.1/onboarding/task.json?flow_name=welcome"
        headers = {
            'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAFXzAwAAAAAAMHCxpeSDG1gLNLghVe8d74hl6k4%3DRUMF4xAQLsbeBhTSRrCiQpJtxoGWeyHrDb5te2jpGskWDFW82F',
            'Content-Type': 'application/json',
            'User-Agent': 'TwitterAndroid/10.10.0',
            'X-Guest-Token': guest_token
        }
        data = {
            'flow_token': None,
            'input_flow_data': {
                'flow_context': {
                    'start_location': {
                        'location': 'splash_screen'
                    }
                }
            }
        }
        response = requests.post(url, headers=headers, json=data)
        return response.json().get('flow_token')

    # Main execution
    guest_token = get_guest_token()
    flow_token = get_flow_token(guest_token)

    url = "https://api.twitter.com/1.1/onboarding/task.json"
    headers = {
        'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAFXzAwAAAAAAMHCxpeSDG1gLNLghVe8d74hl6k4%3DRUMF4xAQLsbeBhTSRrCiQpJtxoGWeyHrDb5te2jpGskWDFW82F',
        'Content-Type': 'application/json',
        'User-Agent': 'TwitterAndroid/10.10.0',
        'X-Guest-Token': guest_token
    }
    data = {
        'flow_token': flow_token,
        'subtask_inputs': [
            {
                'open_link': {
                    'link': 'next_link'
                },
                'subtask_id': 'NextTaskOpenLink'
            }
        ]
    }

    response = requests.post(url, headers=headers, json=data)

    result = response.json().get('subtasks', [{}])[0]
    if 'open_account' in result:
        oauth_details = {
            'oauth_token': result['open_account'].get('oauth_token'),
            'oauth_token_secret': result['open_account'].get('oauth_token_secret')
        }
        return oauth_details
    else:
        print("No OAuth details found.")

@stub.local_entrypoint()
def main():
    count = [i for i in range(0, 5)]
    tokens = []
    for oauth_tokens in get_token.map(count):
        tokens.append(oauth_tokens)

    with open('tokens.json', 'w+') as f:
        json.dump(tokens, f)