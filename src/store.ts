import { StateManager } from "@giveback007/util-lib/dist/browser/state-manager";
import { HegConnection } from "./heg-connection/heg-connection";

export type State = {
    showGraph: boolean;
    showApplets: boolean;
}

export const store = new StateManager<State>({
    showGraph: true,
    showApplets: false,
});

export const heg = new HegConnection();
