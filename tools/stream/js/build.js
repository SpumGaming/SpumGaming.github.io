export {
    BuildOption,
    BuildOptions,
    BuildOptgroups,
    BuildVetos
}

import { GetHtml } from "./utils.js";

function BuildOption(text, value) {
    let element = document.createElement("option");
    element.text=text;
    element.value=value;
    return element;
}

function BuildOptgroups(data, source) {
    let elements = [];
    data.forEach(datum => {
        if(datum[source].length == 0)
            return;
        var optgroup = document.createElement("optgroup");
        optgroup.setAttribute("label",datum.source.name);
        optgroup.setAttribute("value",datum.source.id);
        datum[source].forEach(item => {
            optgroup.appendChild(BuildOption(item.name, item.id));
        });
        elements.push(optgroup);
    });
    return elements;
}

function BuildOptions(data) {
    let elements = [];
    data.forEach(datum => {
        elements.push(BuildOption(datum.name, datum.id));
    })
    return elements;
}

async function BuildVetos(data) {
    let templateStr = await GetHtml("./assets/components/veto.partial.html");
    let elements = [];
    data.steps.forEach(step => elements.push(BuildVeto(templateStr, step)));
    return elements;
}

function BuildVeto(templateStr, banOrPick) {
    templateStr = templateStr.replace("{{ban/pick}}",banOrPick);
    let element = document.createElement("div");
    element.innerHTML =  templateStr;
    if(banOrPick.toLowerCase() == "ban") {
        element.querySelector(".map").classList.add("grayscale");
    }
    return element.firstChild;
}