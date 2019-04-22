import { appStateStream$ } from "../app";

export const sheetOverlayControl = {
    changeCellColor,
    hideSheetOverlay,
    resetCellsColor,
    showNextSheet,
    showPreviousSheet
}

function changeCellColor(appState, row, column) {
    const cell = appState.getCell(
        { row: appState.openedSheet.row, column: appState.openedSheet.column },
        { row: row, column: column }
    );

    cell.isColored = !cell.isColored;

    appStateStream$.next(appState);
}

function hideSheetOverlay(appState) {
    appState.sheetOverlayIsShown = false;
    appStateStream$.next(appState);
}

function resetCellsColor(appState) {
    const sheet = appState.getSheet(
        appState.openedSheet.row, appState.openedSheet.column);

    sheet.cells.forEach(cell => {
        cell.isColored = false;
    });

    appStateStream$.next(appState);
}

function showNextSheet(appState) {
    if (!lastCell(appState)) {
        appState.openedSheet.column++;
        if (appState.openedSheet.column == appState.sheetsMatrix.columns) {
            appState.openedSheet.column = 0;
            appState.openedSheet.row++;
        }
    }

    appStateStream$.next(appState);
}

function lastCell(state) {
    return state.openedSheet.row * state.sheetsMatrix.columns +
        state.openedSheet.column == state.sheetsMatrix.count - 1;
}

function showPreviousSheet(appState) {
    if (!firstCell(appState)) {
        appState.openedSheet.column -= 1;
        if (appState.openedSheet.column == -1) {
            appState.openedSheet.column = appState.sheetsMatrix.columns - 1;
            appState.openedSheet.row--;
        }
    }

    appStateStream$.next(appState);
}

function firstCell(state) {
    return state.openedSheet.row == 0 && state.openedSheet.column == 0;
}