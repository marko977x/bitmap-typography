import { appStateStream$ } from "../app";

export const sheetsMatrixControl = {
    onMouseEnterSheet,
    onMouseLeaveSheet,
    onMouseClickSheet
};

function onMouseEnterSheet(appState, row, column) {
    appState.hoveredSheet.row = row;
    appState.hoveredSheet.column = column;
    appState.hoveredSheet.letter = appState.sheetsMatrix.sheets[
        row * appState.sheetsMatrix.columns + column
    ].letter;

    appStateStream$.next(appState);
}

function onMouseLeaveSheet(appState) {
    appState.hoveredSheet.row = -1;
    appState.hoveredSheet.column = -1;
    appState.hoveredSheet.letter = "";

    appStateStream$.next(appState);
}

function onMouseClickSheet(appState, row, column) {
    appState.openedSheet.row = row;
    appState.openedSheet.column = column;
    appState.sheetOverlayIsShown = true;

    appStateStream$.next(appState);
}