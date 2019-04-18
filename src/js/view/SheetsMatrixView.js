import { execute } from "../executor";
import { sheetsMatrixControl } from "../services/sheetMatrixService";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

export class SheetsMatrixView {

    constructor(appStateStream) {
        this.container = document.querySelector(".sheets-container");

        appStateStream.pipe(
            filter(appState => !appState.appIsLoaded)
        ).subscribe(appState => {
            this.state = appState;
            this.render();
        });

        window.onload = () => {
            execute(sheetsMatrixControl, {
                action: "onLoadWindow",
                parameters: [this.state]
            });
        }
    }

    render() {
        this.container.innerHTML = "";
        let matrix = this.state.sheetsMatrix;
        for (let row = 0; row < matrix.rows; row++) {
            const rowContainer = this.appendRow(this.container, row)
            for (let column = 0; column < matrix.columns; column++) {
                if (row * matrix.columns + column + 1 <= matrix.count)
                    this.createSheet(rowContainer, column);
            }
        }
    }

    appendRow(container, id) {
        const row = document.createElement("div");
        row.className = "sheet-row d-flex justify-content-center";
        row.id = id;
        container.appendChild(row);
        return row;
    }

    createSheet(container, id) {
        const sheet = document.createElement("div");
        sheet.className = "sheet border border-dark";
        sheet.id = id;

        fromEvent(sheet, 'mouseenter').pipe(
            filter(() => this.state.sheetsMatrix.sheets.length != 0)
        ).subscribe(() => {
            execute(sheetsMatrixControl, {
                action: "onMouseOverSheet",
                parameters: [this.state, parseInt(container.id), id]
            });
        });

        fromEvent(sheet, 'mouseleave').pipe(
            filter(() => this.state.sheetsMatrix.sheets.length != 0)  
        ).subscribe(() => {
            execute(sheetsMatrixControl, {
                action: "onMouseOutSheet",
                parameters: [this.state]
            });
        });

        this.createCells(sheet);

        container.appendChild(sheet);
        return sheet;
    }

    createCells(container) {
        container.className += " d-flex flex-column justify-content-center";
        for (let row = 0; row < this.state.sheet.rows; row++) {
            const rowContainer = this.appendCellsRow(container, row)
            rowContainer.className = "d-flex justify-content-center";
            for (let column = 0; column < this.state.sheet.columns; column++) {
                this.createCell(rowContainer, column);
            }
        }
    }

    appendCellsRow(container, id) {
        const row = document.createElement("div");
        row.className = "cell-row d-flex justify-content-center";
        row.style.height = 100 / this.state.sheet.columns + '%';
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
}