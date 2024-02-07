export {
    ComposeForms,
    PopulateStats,
    ComposeVetos,
    ComposePlayersVersus
}

import { BuildOptgroups, BuildOptions, BuildVetos } from "./build.js";
import { GetAllTeamsFromAllSourcesShallow, GetAllPlayersFromAllSourcesShallow, GetAllFormats, GetPlayerMetaFromSource } from "./adapter.js";
import { GetAllPlayerVersusElements } from "./utils.js";
import { context } from "./app.js";

function ComposeForms() {
    document.querySelectorAll("form select").forEach(element => {
        ComposeForm(element);
    });
}

function ComposeForm(form) {
    const optionSource = form.getAttribute("option-source");
    if(optionSource == null)
        return;
    const data = mapOptionSource.get(optionSource)();
    let elements;
    if(data[0][optionSource]==undefined) {
        elements = BuildOptions(data);
    } else {
        elements = BuildOptgroups(data, optionSource);
    }
    elements.forEach(element => {
        form.appendChild(element)
    });
}

async function PopulateStats(player1, player2) {
    // const players = ComposePlayerObjects(data, player1Id, player2Id);

    // for(const player of players) {
    //     player.elements.name.innerHTML = player.elements.name.innerHTML.replace("player",player.data.name);
    //     player.elements.name.innerHTML = player.elements.name.innerHTML.replace("xx",player.data.nationality);
    //     player.elements.profile.setAttribute("src",player.data.picture);
    //     player.elements.team.innerHTML = player.elements.team.innerHTML.replace("team",GetTeamFromPlayerId(data, player.data.id).name);
    //     player.elements.mapsPlayed.innerHTML = player.data.stats.mapsPlayed;
    //     player.elements.mapsWon.innerHTML = player.data.stats.mapsWon;
    //     player.elements.kd = player.data.stats.kd;
    //     player.elements.headshot = player.data.stats.headshot;
    //     player.elements.adr = player.data.stats.adr;
    // }

    // if(isNaN(players[1].data.stats.mapsPlayed || players[0].data.stats.mapsPlayed > players[1].data.stats.mapsPlayed)) {
    //     players[0].elements.mapsPlayed.classList.add("stat-higher");
    // } else if(isNaN(players[0].data.stats.mapsPlayed) || players[1].data.stats.mapsPlayed > players[0].data.stats.mapsPlayed) {
    //     players[1].elements.mapsPlayed.classList.add("stat-higher");
    // }
    // if(player1Data.stats.maps_won > player2Data.stats.maps_won || isNaN(player2Data.stats.maps_won)) {
    //     player1MapsWon.classList.add("stat-higher");
    //     player2MapsWon.classList.add("stat-lower");
    // } else if(player2Data.stats.maps_won > player1Data.stats.maps_won || isNaN(player2Data.stats.maps_won)) {
    //     player2MapsWon.classList.add("stat-higher");
    //     player1MapsWon.classList.add("stat-lower");
    // }

    // if(player1Data.stats.kd > player2Data.stats.kd || isNaN(player2Data.stats.kd)) {
    //     player1Kd.classList.add("stat-higher");
    //     player2Kd.classList.add("stat-lower");
    // } else if(player2Data.stats.kd > player1Data.stats.kd || isNaN(player2Data.stats.kd)) {
    //     player2Kd.classList.add("stat-higher");
    //     player1Kd.classList.add("stat-lower");
    // }

    // if(player1Data.stats.headshot > player2Data.stats.headshot || isNaN(player2Data.stats.headshot)) {
    //     player1Headshot.classList.add("stat-higher");
    //     player2Headshot.classList.add("stat-lower");
    // } else if(player2Data.stats.headshot > player1Data.stats.headshot || isNaN(player2Data.stats.headshot)) {
    //     player2Headshot.classList.add("stat-higher");
    //     player1Headshot.classList.add("stat-lower");
    // }

    // if(player1Data.stats.adr > player2Data.stats.adr || isNaN(player2Data.stats.adr)) {
    //     player1Adr.classList.add("stat-higher");
    //     player2Adr.classList.add("stat-lower");
    // } else if(player2Data.stats.adr > player1Data.stats.adr || isNaN(player2Data.stats.adr)) {
    //     player2Adr.classList.add("stat-higher");
    //     player1Adr.classList.add("stat-lower");
    // }
}

const mapOptionSource = new Map([
    ["players", GetAllPlayersFromAllSourcesShallow],
    ["teams", GetAllTeamsFromAllSourcesShallow],
    ["formats", GetAllFormats]
]);

async function ComposeVetos(formatId) {
    const format = context.data.formats.find(format => format.id == formatId);
    const vetos = await BuildVetos(format);
    document.getElementById("veto-container").append(...vetos)
}

function ComposePlayersVersus(playersRequest) {
    const playersMeta = playersRequest.map(player => GetPlayerMetaFromSource(player.sourceId, player.playerId));
    const playersElements = GetAllPlayerVersusElements();
    playersMeta.forEach((player, index) => {
        playersElements[index].name.innerHTML = playersElements[index].name.innerHTML.replace("player", player.name);
        playersElements[index].name.innerHTML = playersElements[index].name.innerHTML.replace("xx", player.nationality);
        playersElements[index].team.innerHTML = player.team;
        playersElements[index].profile.setAttribute("src",player.steamProfileImage);
        console.log(playersElements[index].rating);
        playersElements[index].rating.innerHTML = playersElements[index].rating.innerHTML.replace("{{score}}",player.rating);
    });
}