import { partition, map } from "rxjs/operators";
import { CLICKED_CELL_COLOR, DEFAULT_CELL_COLOR } from "../data/constants";
import { range, from } from "rxjs";

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
        from(document.querySelectorAll(".sheet")).subscribe(
            sheet => this.createCells(sheet));
    }

    createCells(sheet) {
        range(0, this.state.sheet.rows).pipe(
            map(row => this.createCellRow(sheet, row))
        ).subscribe(rowContainer => {
            range(0, this.state.sheet.columns).subscribe(column => {
                this.createCell(rowContainer, column);
            });
        });
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
        from(document.querySelectorAll(".sheet")).subscribe(sheet => {
            this.updateSheet(state, sheet);
        });
    }

    updateSheet(state, sheet) {
        from(sheet.childNodes).subscribe(cellRow => {
            this.updateCellRow(state, sheet, cellRow);
        });
    }

    updateCellRow(state, sheet, cellRow) {
        from(cellRow.childNodes).subscribe(cell => {
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
