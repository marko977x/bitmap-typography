import { fromEvent } from "rxjs";
import { execute } from "../executor";
import { sidebarControl } from "../services/sidebarServices";
import { appStateStream$ } from "../app";
import { SidebarActions } from "../data/actions";

export class SidebarView {

    constructor() {
        this.letterWindow = document.querySelector(".letter-window");
        this.usedBits = document.querySelector(".used-bits");

        appStateStream$.subscribe(appState => {
            this.state = appState;
            this.render()
        });
        this.handleButtonsEvent();
    }

    handleButtonsEvent() {
        this.onClick("clear-bitmap-button", SidebarActions.RESET_ALL_CELLS_COLOR);
        this.onClick("start-typing-button", SidebarActions.ON_CLICK_START_TYPING);
        
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

    render() {
        this.letterWindow.innerHTML = this.state.hoveredSheet.letter;
    }
}