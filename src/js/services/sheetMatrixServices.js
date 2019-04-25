import { appStateStream$ } from "../app";

export const sheetsMatrixControl = {
    setHoveredSheet,
    clearHoveredSheet,
    setOpenedSheet
};

function setHoveredSheet(appState, id) {
    appState.hoveredSheet.id = id
    appState.hoveredSheet.letter = appState.sheetsMatrix.sheets[id].letter;

    appStateStream$.next(appState);
}

function clearHoveredSheet(appState) {
    appState.hoveredSheet.id = -1;
    appState.hoveredSheet.letter = "";

    appStateStream$.next(appState);
}

function setOpenedSheet(appState, id) {
    appState.openedSheet.id = id;
    appState.sheetOverlayIsShown = true;

    appStateStream$.next(appState);
}