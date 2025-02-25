def check_game_state(response):
    """
    Converts the JSON response from the server to a Python dictionary (object)
    and returns the parsed data.

    :param response: A string containing the JSON response from the server.
    :return: A dictionary containing game details if parsing is successful, otherwise None.
    """
    try:
        # Convert the JSON string to a Python dictionary
        game_data = response.json()  # If 'response' is a requests.Response object

        # Print some key information about the game state
        print(f"Game ID: {game_data['gameId']}")
        print(f"State: {game_data['state']}")
        print(f"Winner: {game_data['winner']}")
        print(f"Round: {game_data['round']} / {game_data['length']}")

        # Print details about each player in the game
        print("\nPlayers:")
        for player in game_data["players"]:
            print(f"- {player['playerName']} ({player['colour']}): {player['Location']}")

        # Return the full game data for further use
        return game_data

    except Exception as e:
        # If the JSON conversion or data extraction fails, print an error message
        print("Failed to parse game state:", str(e))
        return None

# Example usage
if __name__ == "__main__":
    import requests
    
 
    class MockResponse:
        def json(self):
            return {
                "gameId": 101,
                "mapId": 1,
                "state": "detective",
                "winner": "none",
                "round": 5,
                "length": 24,
                "players": [
                    {
                        "playerId": 201,
                        "playerName": "Dr Nick",
                        "colour": "Clear",
                        "Location": "3"
                    },
                    {
                        "playerId": 204,
                        "playerName": "ADSA",
                        "colour": "Red",
                        "Location": "60"
                    }
                ]
            }

    # Mocking a server response for demonstration:
    mock_response = MockResponse()
    game_state = check_game_state(mock_response)

    # 'game_state' now holds the parsed game data as a dictionary.
    print("\nReturned Game State Object:", game_state)
