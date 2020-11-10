import { StateManager } from "@giveback007/util-lib/dist/browser/state-manager";

export type State = {
    showGraph: boolean;
}

export const store = new StateManager<State>({
    showGraph: false,
})