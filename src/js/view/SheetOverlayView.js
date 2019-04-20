import { filter } from "rxjs/operators";

const CLICKED_CELL_COLOR = "black";
const DEFAULT_CELL_COLOR = "white";

export class SheetOverlayView {

    constructor(appStateStream) {
        this.sheetOverlay = document.querySelector(".sheet-overlay");
        this.board = document.querySelector(".so-board");

        appStateStream.pipe(
            filter(state => state.openedSheet.row != -1)
        ).subscribe(state => {
            this.state = state;
            this.render(state);
        });
    }

    render(state) {
        this.board.innerHTML = "";
        const openedSheet = state.sheetsMatrix.sheets[state.openedSheet.row +
            state.sheetsMatrix.columns + state.openedSheet.column];

        for (let row = 0; row < state.sheet.rows; row++) {
            const rowContainer = this.appendRow(this.board, row);
            for (let column = 0; column < state.sheet.columns; column++) {
                this.createCell(rowContainer, column,
                    openedSheet.cells[row * state.sheet.columns + column]);
            }
        }

        this.sheetOverlay.style.height = "100%";
    }

    appendRow(container, id) {
        const row = document.createElement("div");
        row.className = "so-cell-row";
        row.style.height = 100 / this.state.sheet.rows + '%';
        row.id = id;
        container.appendChild(row);
        return row;
    }

    createCell(container, id, cellData) {
        const cell = document.createElement("div");
        cell.className = "so-cell";
        cell.style.backgroundColor = cellData.isColored ?
            CLICKED_CELL_COLOR : DEFAULT_CELL_COLOR;
        cell.style.width = 100 / this.state.sheet.columns + '%';
        cell.id = id;
        container.appendChild(cell);
    }
}