export class AppState {

    constructor() {
        this.sheetsMatrix = {
            id: -1,
            count: 26,
            sheets: []
        };

        this.sheet = {
            count: 16,
            rows: 4,
            columns: 4
        };

        this.openedSheet = {
            id: -1
        };

        this.hoveredSheet = {
            id: -1,
            letter: ""
        };

        this.typedText = {
            lastAddedSheetIndex: -1,
            count: 0
        }

        this.appIsLoaded = false;
        this.sheetOverlayIsShown = false;
        this.typingOverlayIsShown = false;
    }

    getSheet(id) {
        return this.sheetsMatrix.sheets[id];
    }

    getCell(sheetId, cellId) {
        return this.getSheet(sheetId).cells[cellId];
    }
}