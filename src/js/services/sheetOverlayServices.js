import { appStateStream$ } from "../app";

export const sheetOverlayControl = {
    onClickCell
}

function onClickCell(appState, row, column) {
    const cell = appState.getCell(
        { row: appState.openedSheet.row, column: appState.openedSheet.column },
        { row: row, column: column }
    );

    cell.isColored = !cell.isColored;

    appStateStream$.next(appState);
}