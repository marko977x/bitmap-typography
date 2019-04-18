export class Sheet {

    constructor(appStateStream) {
        this.letterWindow = document.querySelector(".letter-window");

        appStateStream.subscribe(appState => {
            this.state = appState;
            this.render();
        })
    }

    render() {
        if (this.state.mouseOverSheet.row != -1) {
            const sheet = this.state.mouseOverSheet;
            this.letterWindow.innerHTML = this.state.sheetsMatrix.sheets[
                sheet.row * this.state.sheetsMatrix.columns + sheet.column
            ].letter;
        }
        else {
            this.letterWindow.innerHTML = "";
        }
    }
}