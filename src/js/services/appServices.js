import { appStateStream$ } from "../app";
import { LOWERCASE_A_ASCII_KEY_CODE } from "../data/constants";

export const appControl = {
    onLoadWindow
}

function onLoadWindow(appState) {
    document.querySelectorAll(".sheet-row").forEach(row => {
        writeSheetRowDataToAppState(appState, row);
    });

    appState.appIsLoaded = true;
    appStateStream$.next(appState);
}

function writeSheetRowDataToAppState(appState, row) {
    row.childNodes.forEach(sheet => {
        writeSheetDataToAppState(appState, sheet, parseInt(row.id));
    });
}

function writeSheetDataToAppState(appState, sheet, sheetRow) {
    let asciiOffset = sheetRow * appState.sheetsMatrix.columns +
        parseInt(sheet.id);

    appState.sheetsMatrix.sheets.push({
        row: sheetRow,
        column: parseInt(sheet.id),
        letter: String.fromCharCode(LOWERCASE_A_ASCII_KEY_CODE + asciiOffset),
        cells: getCells(sheet)
    });
}

function getCells(sheet) {
    const cells = [];
    sheet.childNodes.forEach(cellRow => {
        cellRow.childNodes.forEach(cell => {
            cells.push({
                row: parseInt(cellRow.id),
                column: parseInt(cell.id),
                isColored: false
            })
        })
    });

    return cells;
}