import json

class Move:
    def __init__(self, move_id, round_num, ticket, destination):
        self.move_id = move_id
        self.round = round_num
        self.ticket = ticket
        self.destination = destination

    def __repr__(self):
        return f"Move(move_id={self.move_id}, round={self.round}, ticket='{self.ticket}', destination={self.destination})"

class Player:
    def __init__(self, player_id, start_location, moves):
        self.player_id = player_id
        self.start_location = start_location
        self.moves = [Move(**move) for move in moves]

    def __repr__(self):
        return f"Player(player_id={self.player_id}, start_location={self.start_location}, moves={self.moves})"

def get_player_detail(response_json):
    data = json.loads(response_json)
    return Player(data["playerId"], data["startLocation"], data["moves"])

# Example usage:
response_json = '''
{
    "playerId": 201,
    "startLocation": 27,
    "moves": [
        {
            "moveId": 9876,
            "round": 1,
            "ticket": "yellow",
            "destination": 28
        },
        {
            "moveId": 9882,
            "round": 2,
            "ticket": "red",
            "destination": 64
        }
    ]
}
'''

player = get_player_detail(response_json)
print(player)
