import { map, filter } from "rxjs/operators";

export class SheetView {

    constructor(appStateStream) {
        this.letterWindow = document.querySelector(".letter-window");

        appStateStream.pipe(
            filter(state => !state.appIsLoaded)
        ).subscribe(appState => {
            this.state = appState;
            this.render();
        });

        this.handleHoveringOverSheet(appStateStream);
    }

    render() {
        document.querySelectorAll(".sheet").forEach(
            sheet => this.createCells(sheet));
    }

    createCells(sheet) {
        for (let row = 0; row < this.state.sheet.rows; row++) {
            const rowContainer = this.createCellRow(sheet, row)
            rowContainer.className = "cell-row";
            for (let column = 0; column < this.state.sheet.columns; column++) {
                this.createCell(rowContainer, column);
            }
        }
    }

    createCellRow(container, id) {
        const row = document.createElement("div");
        row.className = "cell-row";
        row.style.height = 100 / this.state.sheet.rows + '%';
        row.id = id;
        container.appendChild(row);
        return row;
    }

    createCell(container, id) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = id;
        cell.style.width = 100 / this.state.sheet.columns + '%';
        container.appendChild(cell);
    }

    handleHoveringOverSheet(appStateStream) {
        appStateStream.pipe(
            map((state) => state.hoveredSheet.letter)
        ).subscribe(letter => this.letterWindow.innerHTML = letter);
    }
}
