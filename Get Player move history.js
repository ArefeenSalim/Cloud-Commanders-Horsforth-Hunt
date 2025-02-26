class Move {
    constructor(moveId, roundNum, ticket, destination) {
        this.moveId = moveId;
        this.round = roundNum;
        this.ticket = ticket;
        this.destination = destination;
    }

    toString() {
        return `Move(moveId=${this.moveId}, round=${this.round}, ticket='${this.ticket}', destination=${this.destination})`;
    }
}

class Player {
    constructor(playerId, startLocation, moves) {
        this.playerId = playerId;
        this.startLocation = startLocation;
        this.moves = moves.map(move => new Move(move.moveId, move.round, move.ticket, move.destination));
    }

    toString() {
        return `Player(playerId=${this.playerId}, startLocation=${this.startLocation}, moves=${this.moves.map(move => move.toString()).join(', ')})`;
    }
}

function getPlayerDetail(responseJson) {
    const data = JSON.parse(responseJson);
    return new Player(data.playerId, data.startLocation, data.moves);
}

// Example usage:
const responseJson = `{
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
}`;

const player = getPlayerDetail(responseJson);
console.log(player.toString());
