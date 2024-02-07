export {
    SetupApp,
    SetupIndexPage,
    SetupPvpPage,
    SetupTeamPage,
    SetupVetoPage
}

import { ComposeForms, PopulateStats, ComposeVetos, ComposePlayersVersus } from "./compose.js";
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
    const player1 = {
        sourceId:params.get("s1"),
        playerId:params.get("p1")
    }
    const player2 = {
        sourceId:params.get("s2"),
        playerId:params.get("p2")
    }
    const players = parsed.map(player => {
        return {
            sourceId: player.group,
            playerId: player.opt
        };
    });
    ComposePlayersVersus(players);
    PopulateStats(player1, player2);
}

function SetupTeamPage(params) {
    var params = new URLSearchParams(window.location.search);
}

function SetupVetoPage(params) {
    context.veto = {count:0}

    ComposeVetos(JSON.parse(params.get("formats")));

    document.addEventListener("keydown", (event) => {
        if(keyToMap.has(event.code)) {
            const map = document.querySelectorAll(".veto .map")[context.veto.count]
            map.classList.add(keyToMap.get(event.code));
            map.classList.add("anim-expandHeight");
            context.veto.count++;
        }
    });
}

let keyToMap = new Map([
    ["Digit1","map-ancient"],
    ["Digit2","map-anubis"],
    ["Digit3","map-mirage"],
    ["Digit4","map-inferno"],
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