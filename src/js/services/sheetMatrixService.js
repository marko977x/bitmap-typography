import { appStateStream$ } from "../app";

export const sheetsMatrixControl = {
    setHoveredSheet,
    clearHoveredSheet,
    setOpenedSheet
};

function setHoveredSheet(appState, row, column) {
    appState.hoveredSheet.row = row;
    appState.hoveredSheet.column = column;
    appState.hoveredSheet.letter = appState.getSheet(row, column).letter;

    appStateStream$.next(appState);
}

function clearHoveredSheet(appState) {
    appState.hoveredSheet.row = -1;
    appState.hoveredSheet.column = -1;
    appState.hoveredSheet.letter = "";

    appStateStream$.next(appState);
}

function setOpenedSheet(appState, row, column) {
    appState.openedSheet.row = row;
    appState.openedSheet.column = column;
    appState.sheetOverlayIsShown = true;

    appStateStream$.next(appState);
}