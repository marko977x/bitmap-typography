export class AppState {

    constructor() {
        this.sheetsMatrix = {
            rows: 4,
            columns: 7,
            count: 26,
            sheets: []
        };

        this.sheet = {
            rows: 4,
            columns: 4,
        };

        this.openedSheet = {
            row: -1,
            column: -1
        };

        this.hoveredSheet = {
            row: -1,
            column: -1,
            letter: ""
        };

        this.appIsLoaded = false;
        this.sheetOverlayIsShown = false;
    }

    getSheet(row, column) {
        return this.sheetsMatrix.sheets[row * this.sheetsMatrix.columns + column];
    }

    getCell(sheet, cell) {
        return this.getSheet(sheet.row, sheet.column).cells[
            cell.row * this.sheet.columns + cell.column
        ];
    }
}