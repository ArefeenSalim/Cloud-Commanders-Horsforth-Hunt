import requests

class KickPlayerResponse:
    def __init__(self, message, game_id, player_id):
        self.message = message
        self.game_id = game_id
        self.player_id = player_id

    def __repr__(self):
        return f"KickPlayerResponse(message='{self.message}', game_id={self.game_id}, player_id={self.player_id})"

def kick_player_detail(player_id, access_token):
    url = f"https://example.com/players/{player_id}"  # Replace with actual API URL
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.delete(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        return KickPlayerResponse(
            message=data.get("message", ""),
            game_id=data.get("gameId", None),
            player_id=data.get("playerId", None)
        )
    else:
        return f"Error: {response.status_code}, {response.text}"

# Example Usage:
# response_obj = kick_player_detail(201, "your_access_token_here")
# print(response_obj)
