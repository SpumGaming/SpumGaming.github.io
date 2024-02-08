export {
    GetAllFormats,
    GetAllTeamsFromAllSourcesShallow,
    GetAllPlayersFromAllSourcesShallow,
    GetPlayerMetaFromSource,
    GetTeamMetaFromSource,
    GetTeamIconFromSource
}

import { context } from "./app.js";

var cache = {};

// function GetAllPlayersFromAllSourcesShallow() {
//     return context.data.sources.flatMap(source => {
//         return {
//             source: {
//                 id: source.id,
//                 name: source.name
//             },
//             players: GetPlayersFromSourceShallow(source)
//         }
//     });
// }

// function GetAllTeamsFromAllSourcesShallow() {
//     return context.data.sources.flatMap(source => {
//         return {
//             source: {
//                 id: source.id,
//                 name: source.name
//             },
//             teams: GetTeamsFromSourceShallow(source)
//         }
//     });
// }

function GetPlayerMetaFromSource(sourceId, playerId) {
    const source = context.data.sources.find(source => source.id == sourceId);
    let player = source.roster.players.find(player => player.id == playerId);
    player.team = "sub";
    for (const team of source.roster.teams) {
        if (team.players.includes(playerId)) {
            player.team = team.name;
        }
    }
    return player;
}

function GetTeamMetaFromSource(sourceId, teamName) {
    const source = context.data.sources.find(source => source.id == sourceId);
    return source.roster.teams.find(team => team.name == teamName);
}

function GetTeamIconFromSource(sourceId, teamName) {
    const source = context.data.sources.find(source => sourceId == source.id);
    return source.roster.teams.find(team => team.name == teamName).icon;
}

function GetPlayersFromSourceShallow(source) {
    const uniquePlayersSet = new Set();
    return source.matches.flatMap(match =>
        match.teams.flatMap(team =>
            team.players.filter(player => {
                if (!uniquePlayersSet.has(player.id)) {
                    uniquePlayersSet.add(player.id);
                    return true;
                }
                return false;
            }).map(player => ({
                name: player.name,
                id: player.id
            }))
        )
    ).sort((a, b) => a.name.localeCompare(b.name));
}

function GetAllPlayersFromAllSourcesShallow() {
    return context.data.sources.sort((a,b) => a.startDate < b.startDate).flatMap(source => {
        return {
            source: {
                id: source.id,
                name: source.name
            },
            players: GetAllPlayersFromSourceShallow(source).sort((a, b) => a.name.localeCompare(b.name))
        }
    });
}

function GetAllPlayersFromSourceShallow(source) {
    return source.roster.players.flatMap(player => (
        {
            id: player.id,
            name: player.name,
        }
    ));
}

function GetAllTeamsFromAllSourcesShallow() {
    return context.data.sources.flatMap(source => {
        return {
            source: {
                id: source.id,
                name: source.name
            },
            teams: GetAllTeamsFromSourceShallow(source).sort((a, b) => a.name.localeCompare(b.name))
        }
    });
}

function GetAllTeamsFromSourceShallow(source) {
    return source.roster.teams.flatMap(team => (
        {
            id: encodeURIComponent(team.name),
            name: team.name
        }
    ))
}

function GetAllFormats() {
    return context.data.formats;
}

function GetTeamsFromSourceShallow(source) {
    const uniquePlayersSet = new Set();
    return source.matches.flatMap(match =>
        match.teams.filter(team => {
            const teamId = encodeURIComponent(team.name);
            if (!uniquePlayersSet.has(teamId)) {
                uniquePlayersSet.add(teamId);
                return true;
            }
            return false;
        }).map(team => ({
            name: team.name,
            id: encodeURIComponent(team.name)
        }))
    ).sort((a, b) => a.name.localeCompare(b.name));
}