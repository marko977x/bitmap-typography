import { appStateStream$ } from "../app";
import { LOWERCASE_A_ASCII_KEY_CODE } from "../data/constants";
import { from } from "rxjs";

export const appControl = {
    onLoadWindow
}

function onLoadWindow(appState) {
    from(document.querySelectorAll(".sheet")).subscribe(sheet => {
        writeSheetDataToAppState(appState, sheet);
    });

    appState.appIsLoaded = true;
    appStateStream$.next(appState);
}

function writeSheetDataToAppState(appState, sheet) {
    appState.sheetsMatrix.sheets.push({
        id: parseInt(sheet.id),
        letter: String.fromCharCode(LOWERCASE_A_ASCII_KEY_CODE + parseInt(sheet.id)),
        cells: getCells(sheet)
    });
}

function getCells(sheet) {
    const cells = [];
    sheet.childNodes.forEach(cell => {
        cells.push({
            id: parseInt(cell.id),
            isColored: false
        })
    });
    return cells;
}