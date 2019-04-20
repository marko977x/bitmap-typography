import { partition } from "rxjs/operators";
import { fromEvent } from "rxjs";
import { execute } from "../executor";
import { sheetOverlayControl } from "../services/sheetOverlayServices";
import { CLICKED_CELL_COLOR, DEFAULT_CELL_COLOR } from "../data/constants";

export class SheetOverlayView {

    constructor(appStateStream$) {
        this.sheetOverlay = document.querySelector(".sheet-overlay");
        this.board = document.querySelector(".so-board");
        this.letterWindow = document.querySelector(".so-letter-window");

        this.handleAppStateStream(appStateStream$);
        this.defineButtonsEvents();
    }

    handleAppStateStream(appStateStream$) {
        const stream$ = appStateStream$.pipe(
            partition(state => state.sheetOverlayIsShown)
        );

        const showOverlay = stream$[0];
        const hideOverlay = stream$[1];

        showOverlay.subscribe(state => {
            this.state = state;
            this.render(state);
        })

        hideOverlay.subscribe(() => this.sheetOverlay.style.height = '0%');
    }

    render(state) {
        this.board.innerHTML = "";
        this.createCells(state);
        this.sheetOverlay.style.height = "100%";
        this.letterWindow.innerHTML = state.getSheet(
            state.openedSheet.row, state.openedSheet.column).letter;
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

    defineButtonsEvents() {
        this.onClick("exit-button", "onClickExitButton");
        this.onClick("delete-button", "onClickDeleteButton");
        this.onClick("next-button", "onClickNextButton");
        this.onClick("previous-button", "onClickPreviousButton");
    }

    onClick(buttonClassName, action) {
        const button = document.querySelector("." + buttonClassName);

        fromEvent(button, 'click').subscribe(() => {
            execute(sheetOverlayControl, {
                action: action,
                parameters: [this.state]
            })
        });
    }
}