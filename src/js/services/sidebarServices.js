import { appStateStream$ } from "../app";

export const sidebarControl = {
    onClickStartTyping,
    onClickClearBitmap
};

function onClickClearBitmap(appState) {
    appState.sheetsMatrix.sheets.forEach(sheet => {
        clearSheetBitmap(sheet);
    });

    appStateStream$.next(appState);
}

function clearSheetBitmap(sheet) {
    sheet.cells.forEach(cells => {
        cells.isColored = false;
    });
}

function onClickStartTyping() {

}