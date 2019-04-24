import { fromEvent } from "rxjs";
import { execute } from "../executor";
import { sidebarControl } from "../services/sidebarServices";

export class SidebarView {

    constructor(appStateStream$) {
        this.letterWindow = document.querySelector(".letter-window");

        appStateStream$.subscribe(appState => {
            this.state = appState;
            this.render(appState)
        });
        this.handleButtonsEvent();
    }

    handleButtonsEvent() {
        this.onClick("clear-bitmap-button", "resetAllCellsColor");
        this.onClick("start-typing-button", "onClickStartTyping");
        fromEvent(document.querySelector(".start-typing-button"), 'click').subscribe(() => {
            document.querySelector(".typing-overlay").style.height = '100%';
        });
    }

    onClick(buttonClassName, action) {
        const button = document.querySelector("." + buttonClassName);

        fromEvent(button, 'click').subscribe(() => {
            execute(sidebarControl, {
                action: action,
                parameters: [this.state]
            })
        })
    }

    render(appState) {
        this.letterWindow.innerHTML = appState.hoveredSheet.letter;
    }
}