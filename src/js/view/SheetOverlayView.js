import { partition } from "rxjs/operators";
import { fromEvent, range } from "rxjs";
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
        this.letterWindow.innerHTML = state.getSheet(state.openedSheet.id).letter;
    }

    createCells(state) {
        range(0, state.sheet.count).subscribe(cellId => {
            const cellData = state.getCell(state.openedSheet.id, cellId);
            this.createCell(cellData);
        })
    }

    createCell(cellData) {
        const cell = document.createElement("div");
        cell.className = "so-cell";
        cell.style.backgroundColor = cellData.isColored ?
            CLICKED_CELL_COLOR : DEFAULT_CELL_COLOR;
        cell.style.width = 100 / this.state.sheet.columns + '%';
        cell.id = cellData.id;

        this.onClickCell(cell, cellData.id);

        this.board.appendChild(cell);
    }

    onClickCell(cell, id) {
        fromEvent(cell, 'mousedown').subscribe(() => {
            execute(sheetOverlayControl, {
                action: "changeCellColor",
                parameters: [this.state, id]
            })
        })
    }

    defineButtonsEvents() {
        this.onClick("exit-button", "hideSheetOverlay");
        this.onClick("delete-button", "resetCellsColor");
        this.onClick("next-button", "showNextSheet");
        this.onClick("previous-button", "showPreviousSheet");
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