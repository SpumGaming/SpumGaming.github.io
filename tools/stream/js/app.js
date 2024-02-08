export {
    context
}

import { SetupApp, SetupIndexPage, SetupPvpPage, SetupTeamPage, SetupVetoPage } from "./setup.js"

var context = {};
var funcList = [];

window.SetupIndexPage = function() {
    funcList.push(SetupIndexPage);
}

window.SetupPvpPage = function() {
    funcList.push(SetupPvpPage);
}

window.SetupTeamPage = function() {
    funcList.push(SetupTeamPage);
}

window.SetupVetoPage = function() {   
    funcList.push(SetupVetoPage);
}

// this will always get called
window.onload = async function() {
    await SetupApp(context);
    
    for(var func of funcList) {
        func(new URLSearchParams(window.location.search));
    }
}