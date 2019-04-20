export class SidebarView {

    constructor(appStateStream$) {
        this.letterWindow = document.querySelector(".letter-window");

        appStateStream$.subscribe(appState => this.render(appState));
    }

    render(appState) {
        this.letterWindow.innerHTML = appState.hoveredSheet.letter;
    }
}