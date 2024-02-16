export {
    SetupApp,
    SetupIndexPage,
    SetupPvpPage,
    SetupTeamPage,
    SetupVetoPage
}

import { ComposeForms, ComposeVetos, ComposePlayersVersus, ComposeTeams, ComposeTeamsLineup } from "./compose.js";
import { GetTeamIconFromSource } from "./adapter.js";
import { GetJson, LoadHtmlIntoElement } from "./utils.js";
import { DATA_PATH_NEW } from "./constants.js";
import { context } from "./app.js";

async function SetupApp(context) {
    context["data"] = await GetJson(DATA_PATH_NEW)

    const elements = document.querySelectorAll("[data-load]");
    for(const element of elements) {
        LoadHtmlIntoElement(element.getAttribute("data-load"),element);
    }
}

function SetupIndexPage() {
    ComposeForms();

    document.querySelectorAll("form").forEach(form => form.addEventListener("submit", (event) => {
        event.preventDefault();
        SubmitForm(event)
    }));
}

function SetupPvpPage(params) {
    const parsed = JSON.parse(params.get("players"));
    const players = parsed.map(player => {
        return {
            sourceId: decodeURIComponent(player.group),
            playerId: decodeURIComponent(player.opt)
        };
    });
    ComposePlayersVersus(players);
    //PopulateStats(player1, player2);
}

function SetupTeamPage(params) {
    var parsed = JSON.parse(params.get("teams"));
    const teams = parsed.map(team => {
        return {
            sourceId: decodeURIComponent(team.group),
            teamName: decodeURIComponent(team.opt)
        }
    });

    ComposeTeamsLineup(teams);
}

function SetupVetoPage(params) {
    const parsed = JSON.parse(params.get("teams"));
    const teams = parsed.map(team => {
        return {
            sourceId: decodeURIComponent(team.group),
            teamName: decodeURIComponent(team.opt)
        }
    });

    ComposeTeams(teams);
    ComposeVetos(JSON.parse(params.get("formats")));

    context.teamIcons = teams.map(team => GetTeamIconFromSource(team.sourceId, team.teamName));
    context.startingTeam = null;
    context.vetoedMaps = [];
    document.addEventListener("keydown", (event) => {
        if(context.startingTeam == null && event.code == "ArrowLeft") {
            console.log("left team starting!");
            const elementsVeto = document.querySelectorAll(".veto");
            for(let i = 0; i < elementsVeto.length; i++) {
                const elementIcon = elementsVeto[i].querySelector("i");
                elementIcon.classList.remove("fa-question");
                elementIcon.classList.add(context.teamIcons[i%2]);
            }
            context.startingTeam = 0;
            return;
        }

        if(context.startingTeam == null && event.code == "ArrowRight") {
            console.log("right team starting!");
            const elementsVeto = document.querySelectorAll(".veto");
            for(let i = 0; i < elementsVeto.length; i++) {
                const elementIcon = elementsVeto[i].querySelector("i");
                elementIcon.classList.remove("fa-question");
                elementIcon.classList.add(context.teamIcons[(i+1)%2]);
            }
            context.startingTeam = 1;
            return;
        }

        if(context.startingTeam == null) {
            console.log("starting team not chosen!");
            return;
        }

        if(keyToMap.has(event.code)) {
            const elementsVeto = document.querySelectorAll(".veto");
            if(context.vetoedMaps.length == Array.from(elementsVeto).length) {
                console.log(`already vetoed all maps!`);
                return;
            }

            const elementVeto = elementsVeto[context.vetoedMaps.length];
            const elementMap = elementVeto.querySelector(".map");
            const map = keyToMap.get(event.code);
            if(context.vetoedMaps.includes(map)) {
                console.log(`map ${map} already vetoed!`);
                return;
            }
            
            elementMap.classList.add(map);
            elementMap.classList.add("anim-expandHeight");
            context.vetoedMaps.push(map);

            if(context.vetoedMaps.length == Array.from(elementsVeto).length - 1) {
                console.log(`auto filled last map!`);
                const listMaps = Array.from(keyToMap.values());
                const lastMap = listMaps.filter(map => !context.vetoedMaps.includes(map));
                const lastMapElement = elementsVeto[Array.from(elementsVeto).length - 1].querySelector(".map");
                lastMapElement.classList.add(lastMap);
                lastMapElement.classList.add("anim-delay-1s");
                lastMapElement.classList.add("anim-expandHeight");
                context.vetoedMaps.push(map);
            }
        }
    });
}

let keyToMap = new Map([
    ["Digit1","map-ancient"],
    ["Digit2","map-anubis"],
    ["Digit3","map-inferno"],
    ["Digit4","map-mirage"],
    ["Digit5","map-nuke"],
    ["Digit6","map-overpass"],
    ["Digit7","map-vertigo"]
]);

function SubmitForm(event) {
    const selects = event.target.querySelectorAll("select[option-source] option:checked");
    let selectedValues = {};
    selects.forEach(select => {
        if(select.parentElement.parentElement.hasAttribute("option-source")) {
            const key = select.parentElement.parentElement.getAttribute("option-source");
            if(!selectedValues[key])
                selectedValues[key]=[];
            selectedValues[key].push({
                group:select.parentElement.getAttribute("value"),
                opt:select.value
            })
        } else {
            const key = select.parentElement.getAttribute("option-source");
            if(!selectedValues[key])
                selectedValues[key]=[];
            selectedValues[key].push(select.value);
        }
    });

    var url = new URL(window.location);
    url.search='';
    url.href+=event.target.getAttribute("data-destination");
    for (let [key, value] of Object.entries(selectedValues)) {
        if(Array.from(value).length == 1) {
            value = value[0]
        };
        url.searchParams.append(key,JSON.stringify(value));
    }

    window.location.href=url;
}