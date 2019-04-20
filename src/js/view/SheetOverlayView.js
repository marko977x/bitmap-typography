import { filter } from "rxjs/operators";
import { fromEvent, combineLatest } from "rxjs";
import { execute } from "../executor";
import { sheetOverlayControl } from "../services/sheetOverlayServices";
import { CLICKED_CELL_COLOR, DEFAULT_CELL_COLOR } from "../data/constants";

export class SheetOverlayView {

    constructor(appStateStream$) {
        this.sheetOverlay = document.querySelector(".sheet-overlay");
        this.board = document.querySelector(".so-board");
        const exitButton = document.querySelector(".exit-button");

        appStateStream$.pipe(
            filter(state => state.sheetOverlayIsShown)
        ).subscribe(state => {
            this.state = state;
            this.render(state);
        });

        exitButton.onclick = () => {
            this.sheetOverlay.style.height = "0%";
            this.state.sheetOverlayIsShown = false;
        }
    }

    render(state) {
        this.board.innerHTML = "";
        this.createCells(state);
        this.sheetOverlay.style.height = "100%";
    }

    createCells(state) {
        for (let row = 0; row < state.sheet.rows; row++) {
            const rowContainer = this.appendRow(this.board, row);
            for (let column = 0; column < state.sheet.columns; column++) {
                const cellData = state.getCell(
                    { row: state.openedSheet.row, column: state.openedSheet.column },
                    { row: row, column: column }
                );
                this.createCell(rowContainer, column, cellData);
            }
        }
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

        this.onClickCell(cell, parseInt(container.id), id);

        container.appendChild(cell);
    }

    onClickCell(cell, row, column) {
        fromEvent(cell, 'mousedown').subscribe(() => {
            execute(sheetOverlayControl, {
                action: "onClickCell",
                parameters: [this.state, row, column]
            })
        })
    }
}