import { StateManager, stateManagerReactLinker } from "@giveback007/browser-utils";
import { HegConnection } from "heg-alpha-ble";

export type State = {
    showGraph: boolean;
    showApplets: boolean;
}

export const store = new StateManager<State>({
    showGraph: true,
    showApplets: false,
});

export const linker = stateManagerReactLinker(store);

export const heg = new HegConnection();
