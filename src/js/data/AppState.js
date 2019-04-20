export class AppState {

    constructor() {
        this.sheetsMatrix = {
            rows: 4,
            columns: 7,
            count: 26,
            sheets: []
        };

        this.sheet = {
            rows: 15,
            columns: 10,
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
    }
}