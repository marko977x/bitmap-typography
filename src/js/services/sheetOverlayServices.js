import { appStateStream$ } from "../app";

export const sheetOverlayControl = {
    changeCellColor,
    hideSheetOverlay,
    resetCellsColor,
    showNextSheet,
    showPreviousSheet
}

function changeCellColor(appState, id) {
    const cell = appState.getCell(appState.openedSheet.id, id);
    cell.isColored = !cell.isColored;

    appStateStream$.next(appState);
}

function hideSheetOverlay(appState) {
    appState.sheetOverlayIsShown = false;
    appStateStream$.next(appState);
}

function resetCellsColor(appState) {
    const sheet = appState.getSheet(appState.openedSheet.id);

    sheet.cells.forEach(cell => {
        cell.isColored = false;
    });

    appStateStream$.next(appState);
}

function showNextSheet(appState) {
    if (appState.openedSheet.id != appState.sheetsMatrix.count)
        appState.openedSheet.id++;

    appStateStream$.next(appState);
}

function showPreviousSheet(appState) {
    if (appState.openedSheet.id != 0)
        appState.openedSheet.id--;

    appStateStream$.next(appState);
}