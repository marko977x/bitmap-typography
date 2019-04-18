import { stream } from "../index";

export const sheetsMatrixControl = {
    onLoadWindow,
    onClickSheet,
    onMouseOverSheet,
    onMouseOutSheet
};

const ASCII_START_LETTER = 97;

function onLoadWindow(appState) {
    appState.sheetsMatrix.sheets = [];
    document.querySelectorAll(".sheet-row").forEach(row => {
        row.childNodes.forEach(sheet => {
            appState.sheetsMatrix.sheets.push({
                row: parseInt(row.id),
                column: parseInt(sheet.id),
                letter: String.fromCharCode(
                    ASCII_START_LETTER +
                    parseInt(row.id) * appState.sheetsMatrix.columns +
                    parseInt(sheet.id))
            })
        })
    })
    appState.appIsLoaded = true;
    stream.next(appState);
}

function onClickSheet(appState, row, column) {
    appState.hoveredSheet.row = row;
    appState.hoveredSheet.column = column;
    appState.hoveredSheet.letter = appState.sheetsMatrix.sheets[
        row * appState.sheetsMatrix.columns + column
    ];

    stream.next(appState);
}

function onMouseOverSheet(appState, row, column) {
    appState.hoveredSheet.row = row;
    appState.hoveredSheet.column = column;
    appState.hoveredSheet.letter = appState.sheetsMatrix.sheets[
        row * appState.sheetsMatrix.columns + column
    ].letter;

    stream.next(appState);
}

function onMouseOutSheet(appState) {
    appState.hoveredSheet.row = -1;
    appState.hoveredSheet.column = -1;
    appState.hoveredSheet.letter = "";

    stream.next(appState);
}