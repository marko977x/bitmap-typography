import { partition } from "rxjs/operators";
import { CLICKED_CELL_COLOR, DEFAULT_CELL_COLOR } from "../data/constants";

export class SheetView {

    constructor(appStateStream$) {
        const stream = appStateStream$.pipe(
            partition(state => !state.appIsLoaded));

        const renderApp = stream[0];
        const updateSheets = stream[1];

        renderApp.subscribe(state => {
            this.state = state;
            this.render();
        });

        updateSheets.subscribe(state => {
            this.updateSheets(state)
        });
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

    updateSheets(state) {
        document.querySelectorAll(".sheet").forEach(sheet => {
            this.updateSheet(state, sheet);
        });
    }

    updateSheet(state, sheet) {
        sheet.childNodes.forEach(cellRow => {
            this.updateCellRow(state, sheet, cellRow);
        });
    }

    updateCellRow(state, sheet, cellRow) {
        cellRow.childNodes.forEach(cell => {
            this.updateCell(state, sheet, cell);
        });
    }

    updateCell(state, sheet, cell) {
        const cellData = state.getCell(
            { row: parseInt(sheet.parentNode.id), column: parseInt(sheet.id) },
            { row: parseInt(cell.parentNode.id), column: parseInt(cell.id) }
        );
        cell.style.backgroundColor = cellData.isColored ?
            CLICKED_CELL_COLOR : DEFAULT_CELL_COLOR;
    }
}
