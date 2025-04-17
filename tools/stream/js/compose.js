export {
    ComposeForms,
    PopulateStats,
    ComposeVetos,
    ComposePlayersVersus,
    ComposeTeams,
    ComposeTeamsLineup
}

import { BuildOptgroups, BuildOptions, BuildVetos } from "./build.js";
import { GetAllTeamsFromAllSourcesShallow, GetAllPlayersFromAllSourcesShallow, GetAllFormats, GetPlayerMetaFromSource, GetTeamMetaFromSource } from "./adapter.js";
import { GetAllPlayerVersusElements } from "./utils.js";
import { context } from "./app.js";

function ComposeForms() {
    document.querySelectorAll("form select").forEach(element => {
        ComposeForm(element);
    });
    $('.selectpicker').selectpicker('refresh');
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

function ComposeTeams(teamsRequest) {
    const teamsMeta = teamsRequest.map(team => GetTeamMetaFromSource(team.sourceId, team.teamName));
    const teamHeaders = document.querySelectorAll(".team-header");
    teamsMeta.forEach((team, index) => {
        teamHeaders[index].querySelector(".team-name").textContent = team.name;
        if("icon" in team) {
            const teamIcon =  teamHeaders[index].querySelector(".team-icon");
            teamIcon.removeAttribute("hidden");
            teamIcon.querySelector("i").classList.add(team.icon);
        }
    });
}

function ComposeTeamsLineup(teamsRequest) {
    ComposeTeams(teamsRequest);

    const teamsMeta = teamsRequest.map(team => GetTeamMetaFromSource(team.sourceId, team.teamName));
    const teamsProfiles = document.querySelectorAll(".team-profiles .player");
    teamsMeta.forEach((team, teamIndex) => {
        const playersMeta = team.players.map(player => GetPlayerMetaFromSource(teamsRequest[teamIndex].sourceId, player))
        playersMeta.forEach((player, playerIndex) => {
            var profile = teamsProfiles[playerIndex + (teamIndex * playersMeta.length)];
            profile.querySelector("img").setAttribute("src",player.steamProfileImage);
            profile.querySelector("span").textContent = player.name;
        });
    });
}

function ComposePlayersVersus(playersRequest) {
    const playersMeta = playersRequest.map(player => GetPlayerMetaFromSource(player.sourceId, player.playerId));
    const playersElements = GetAllPlayerVersusElements();
    playersMeta.forEach((player, index) => {
        playersElements[index].name.innerHTML = playersElements[index].name.innerHTML.replace("player", player.name);
        playersElements[index].name.innerHTML = playersElements[index].name.innerHTML.replace("xx", player.nationality);
        playersElements[index].team.innerHTML = player.team;
        playersElements[index].profile.setAttribute("src",player.steamProfileImage);
        playersElements[index].rating.innerHTML = playersElements[index].rating.innerHTML.replace("{{score}}",player.rating);
    });
}