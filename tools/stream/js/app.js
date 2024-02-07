export {
    context
}

import { SetupApp, SetupIndexPage, SetupPvpPage, SetupTeamPage, SetupVetoPage } from "./setup.js"

var context = {};
var funcList = [];

window.SetupIndexPage = async function() {
    funcList.push(SetupIndexPage);
}

window.SetupPvpPage = async function() {
    funcList.push(SetupPvpPage);
}

window.SetupTeamPage = async function() {
    funcList.push(SetupTeamPage);
}

window.SetupVetoPage = async function() {   
    funcList.push(SetupVetoPage);
}

// this will always get called
window.onload = async function() {
    await SetupApp(context);
    
    for(var func of funcList) {
        await func(new URLSearchParams(window.location.search));
    }
}