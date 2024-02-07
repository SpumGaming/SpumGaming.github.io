export {
    GetPlayerNumberMatchesPlayed,
    GetPlayerNumberMatchesWon,
    GetPlayerStatTotal,
    GetPlayerStatAveragePerMatch,
    GetPlayerStatAveragePerRound
}

import { context } from "./app.js";

var cache = {
    
}

function GetPlayerStats(player) {
    return context.data.sources.find(source => source.id == player.sourceId)
        .matches.flatMap(match => 
            match.teams.flatMap(team => 
                team.players.filter(player => 
                    player.id == player.playerId
                )
            )
        );
}

function GetPlayerNumberMatchesPlayed(player) {
    return GetPlayerStats(player.sourceId, player.playerId).length;
}

function GetPlayerNumberMatchesWon(player) {
    return context.data.sources.find(source => source.id == player.sourceId)
        .matches.filter(match => {
            const teams = match.teams.sort((a,b) => b.score - a.score);
            return teams[0].players.find(player => player.id == player.playerId)
        }).length;
}

function GetPlayerStatTotal(player, stat) {
    const stats = GetPlayerStats(player.sourceId, player.playerId);
    return stats.reduce((acc,obj) => {
        return acc + parseFloat(obj.stats[stat])
    },0);
}

function GetPlayerStatAveragePerMatch(player, stat) {
    const stats = GetPlayerStats(player.sourceId, player.playerId);
    return stats.reduce((acc,obj) => {
        return acc + parseFloat(obj.stats[stat])
    },0)/stats.length;
}

function GetPlayerStatAveragePerRound(player, stat) {
    return GetPlayerStatTotal(player, stat) / GetPlayerStatTotal(player, stat);
}