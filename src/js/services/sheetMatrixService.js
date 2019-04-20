import { appStateStream$ } from "../index";

export const sheetsMatrixControl = {
    onLoadWindow,
    onClickSheet,
    onMouseEnterSheet,
    onMouseLeaveSheet,
    onMouseClickSheet
};

const LOWER_A_ASCII = 97;

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
        letter: String.fromCharCode(LOWER_A_ASCII + asciiOffset),
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

function onClickSheet(appState, row, column) {
    appState.hoveredSheet.row = row;
    appState.hoveredSheet.column = column;
    appState.hoveredSheet.letter = appState.sheetsMatrix.sheets[
        row * appState.sheetsMatrix.columns + column
    ];

    appStateStream$.next(appState);
}

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

    appStateStream$.next(appState);
}