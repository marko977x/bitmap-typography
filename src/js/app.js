import { fromEvent } from "rxjs";
import { AppState } from "./data/AppState";
import { BehaviorSubject } from "rxjs";
import { SheetsMatrixView } from "./view/SheetsMatrixView";
import { SheetView } from "./view/SheetView";
import { SheetOverlayView } from "./view/SheetOverlayView";
import { execute } from "./executor";
import { appControl } from "./services/appServices";
import { SidebarView } from "./view/SidebarView";
import { TypingOverlayView } from "./view/TypingOverlayView";

const appState = new AppState();
export const appStateStream$ = new BehaviorSubject(appState);

new SheetsMatrixView(appStateStream$, appState);
new SheetView(appStateStream$);
new SheetOverlayView(appStateStream$);
new SidebarView(appStateStream$);
new TypingOverlayView(appStateStream$);

fromEvent(window, 'onload').subscribe(
    execute(appControl, {
        action: "onLoadWindow",
        parameters: [appState]
    })
);
