import { stream } from "../index";

export const sheetsMatrixControl = {
    onLoadWindow
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

    stream.next(appState);
}