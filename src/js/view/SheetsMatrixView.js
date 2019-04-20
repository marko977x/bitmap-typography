import { execute } from "../executor";
import { sheetsMatrixControl } from "../services/sheetMatrixService";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

export class SheetsMatrixView {

    constructor(appStateStream$, appState) {
        this.container = document.querySelector(".sheets-container");
        this.state = appState;

        appStateStream$.pipe(
            filter(appState => !appState.appIsLoaded)
        ).subscribe(appState => {
            this.state = appState;
            this.render();
        });

        this.onLoadWindow();
    }

    render() {
        this.container.innerHTML = "";
        let matrix = this.state.sheetsMatrix;
        for (let row = 0; row < matrix.rows; row++) {
            const rowContainer = this.createRow(this.container, row)
            for (let column = 0; column < matrix.columns; column++) {
                if (this.isMatrixFull(row, column))
                    this.createSheet(rowContainer, column);
            }
        }
    }

    createRow(container, id) {
        const row = document.createElement("div");
        row.className = "sheet-row";
        row.id = id;
        container.appendChild(row);
        return row;
    }

    isMatrixFull(row, column) {
        return row * this.state.sheetsMatrix.columns + column + 1
            <= this.state.sheetsMatrix.count;
    }

    createSheet(container, id) {
        const sheet = document.createElement("div");
        sheet.className = "sheet";
        sheet.id = id;

        this.onMouseEnterSheet(sheet, parseInt(container.id), id);
        this.onMouseLeaveSheet(sheet);
        this.onMouseClickSheet(sheet, parseInt(container.id), id);

        this.createCells(sheet);

        container.appendChild(sheet);
        return sheet;
    }

    onMouseEnterSheet(sheet, row, column) {
        fromEvent(sheet, 'mouseenter').pipe(
            filter(() => this.state.appIsLoaded)
        ).subscribe(() => {
            execute(sheetsMatrixControl, {
                action: "onMouseEnterSheet",
                parameters: [this.state, row, column]
            });
        });
    }

    onMouseLeaveSheet(sheet) {
        fromEvent(sheet, 'mouseleave').pipe(
            filter(() => this.state.appIsLoaded)
        ).subscribe(() => {
            execute(sheetsMatrixControl, {
                action: "onMouseLeaveSheet",
                parameters: [this.state]
            });
        });
    }

    onMouseClickSheet(sheet, row, column) {
        fromEvent(sheet, 'click').pipe(
            filter(() => this.state.appIsLoaded)
        ).subscribe(() => {
            execute(sheetsMatrixControl, {
                action: "onMouseClickSheet",
                parameters: [this.state, row, column]
            });
        });
    }

    createCells(container) {
        for (let row = 0; row < this.state.sheet.rows; row++) {
            const rowContainer = this.createCellsRow(container, row)
            rowContainer.className = "cell-row";
            for (let column = 0; column < this.state.sheet.columns; column++) {
                this.createCell(rowContainer, column);
            }
        }
    }

    createCellsRow(container, id) {
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

    onLoadWindow() {
        fromEvent(window, 'onload').subscribe(
            execute(sheetsMatrixControl, {
                action: "onLoadWindow",
                parameters: [this.state]
            })
        );
    }
}