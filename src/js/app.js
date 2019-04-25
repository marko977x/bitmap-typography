import { AppState } from "./data/AppState";
import { BehaviorSubject, fromEvent } from "rxjs";
import { SheetsMatrixView } from "./view/SheetsMatrixView";
import { SheetView } from "./view/SheetView";
import { SheetOverlayView } from "./view/SheetOverlayView";
import { execute } from "./executor";
import { appControl } from "./services/appServices";
import { SidebarView } from "./view/SidebarView";
import { TypingOverlayView } from "./view/TypingOverlayView";
import { AppActions } from "./data/actions";

const appState = new AppState();
export const appStateStream$ = new BehaviorSubject(appState);

new SheetsMatrixView();
new SheetView();
new SheetOverlayView();
new SidebarView();
new TypingOverlayView();

fromEvent(window, 'onload').subscribe(
    execute(appControl, {
        action: AppActions.ON_LOAD_WINDOW,
        parameters: [appState]
    })
);