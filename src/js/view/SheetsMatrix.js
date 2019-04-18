import { execute } from "../executor";
import { sheetsMatrixControl } from "../services/sheetMatrixService";

export class SheetsMatrix {

    constructor(appStateStream) {
        this.container = document.querySelector(".sheets-container");
        appStateStream.subscribe(appState => {
            this.state = appState;
            this.render();
            console.log(this.state);
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
        for (let row = 0; row < this.state.sheetsMatrix.rows; row++) {
            const rowContainer = this.appendRow(this.container, row)
            for (let column = 0; column < this.state.sheetsMatrix.columns; column++) {
                if (row * this.state.sheetsMatrix.columns + column + 1 <= this.state.sheetsMatrix.count)
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