import requests

def get_player_details(player_id):
    """
    Fetches player details including position and number of tickets of each type.
    
    :param player_id: ID of the player
    :return: Dictionary with player details
    """
    url = f"https://example.com/players/{player_id}"  # Replace with actual API endpoint
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Failed to retrieve player details. Status Code: {response.status_code}"}

# Example usage
player_id = 201
player_details = get_player_details(player_id)
print(player_details)



import requests
from dataclasses import dataclass
from typing import Optional

@dataclass
class PlayerDetail:
    playerId: int
    playerName: str
    role: str
    colour: str
    location: int
    tickets_black: int
    tickets_yellow: int
    tickets_red: int
    tickets_green: int
    tickets_blue: int
    tickets_2x: int

def get_player_details(player_id: int) -> Optional[PlayerDetail]:
    """
    Fetches player details from the server, then converts the JSON response to a PlayerDetail object.
    
    :param player_id: ID of the player to retrieve
    :return: A PlayerDetail object, or None if request failed
    """
    url = f"https://example.com/players/{player_id}"  # Replace with actual API endpoint
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        # Convert the JSON dictionary to a PlayerDetail object
        player_detail = PlayerDetail(
            playerId=data.get("playerId"),
            playerName=data.get("playerName"),
            role=data.get("role"),
            colour=data.get("colour"),
            location=data.get("location"),
            tickets_black=data.get("black", 0),
            tickets_yellow=data.get("yellow", 0),
            tickets_red=data.get("red", 0),
            tickets_green=data.get("green", 0),
            tickets_blue=data.get("blue", 0),
            tickets_2x=data.get("2x", 0)
        )
        return player_detail
    else:
        print(f"Failed to retrieve player details. Status Code: {response.status_code}")
        return None

# Example usage:
if __name__ == "__main__":
    player_id = 201
    details = get_player_details(player_id)
    if details:
        print(details)
