import { LOWERCASE_A_ASCII_KEY_CODE } from "../data/constants";
import { appStateStream$ } from "../app";

export const typingOverlayControl = {
    addLetter,
    removeLastLetter,
    hideOverlay
}

function addLetter(appState, keyCode) {
    console.log("add");
    const sheetIndex = parseInt(keyCode) - LOWERCASE_A_ASCII_KEY_CODE;
    appState.typedText.count++;
    appState.typedText.lastAddedSheedIndex = sheetIndex;

    appStateStream$.next(appState);
}

function removeLastLetter(appState) {
    console.log("Called");
    if (appState.typedText.count > 0) {
        appState.typedText.count--;
        appStateStream$.next(appState);
    }
}

function hideOverlay(appState) {
    appState.typingOverlayIsShown = false;
    appState.typedText.lastAddedSheedIndex = -1;
    appState.typedText.count = 0;
    appStateStream$.next(appState);
}