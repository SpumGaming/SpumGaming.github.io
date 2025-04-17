export {
    GetJson,
    GetTeamFromPlayerId,
    GetPlayersFromTeamId,
    HasOverflowed,
    LoadHtmlIntoQuery,
    LoadHtmlIntoElement,
    GetObjectsWherePropertyExplicitHighest,
    GetHtml,
    GetAllPlayerVersusElements
};

async function GetJson(filename) {
    let response = await fetch(filename)
    return await response.json();
}

function GetTeamFromPlayerId(data, playerId) {
    return data.teams.filter((team) => team.players.includes(playerId))[0];
}

function GetPlayersFromTeamId(data, teamId) {
    const playerIds = data.teams.filter((team) => team.id == teamId)[0];
    return data.players.filter((player) => playerIds.includes(player.id));
}

function HasOverflowed(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function LoadHtmlIntoQuery(filename, query) {
    fetch(filename)
    .then(response => response.text())
    .then(text => document.querySelector(query).innerHTML += text)
    .catch((error) => {
        console.log("load html failed:",error);
    });
}

async function GetHtml(filename) {
    const response = await fetch(filename);
    return await response.text();
}

function LoadHtmlIntoElement(filename, element) {
    fetch(filename)
    .then(response => response.text())
    .then(text => element.innerHTML += text)
    .catch((error) => {
        console.log("load html failed:",error);
    });
}

function GetObjectsWherePropertyExplicitHighest(objectArray, key) {
    const maxObject = objectArray.reduce(function(prev, current) {
        return (prev && prev[key] > current[key]) ? prev : current
    })

    var count = objectArray.filter((obj) => {console.log(`obj:${obj.key} max:${maxObject.key}`);return obj[key] === maxObject[key];});
    count = count.length;
    return (count == 1) ? maxObject : null;
}

function GetAllPlayerVersusElements() {
    const headers = document.querySelectorAll(".player-header");
    const profiles = document.querySelectorAll(".player-profile");
    const ratings = document.querySelectorAll(".player-rating");
    let players = [];
    headers.forEach((header,index) => {
        players.push({
            name: header.querySelector(".player-name"),
            flag: header.querySelector(".fi"),
            team: header.querySelector(".player-team"),
            profile: profiles[index].querySelector("img.profile"),
            rating: ratings[index]
        })
    });
    return players;
}