import { SupportedKeys } from './SupportedKeys';
import { RemoteControlManagerInterface } from './RemoteControlManager.interface';
declare class RemoteControlManager implements RemoteControlManagerInterface {
    private eventEmitter;
    constructor();
    private handleKeyDown;
    addKeydownListener: (listener: (event: SupportedKeys) => void) => ((event: SupportedKeys) => void);
    removeKeydownListener: (listener: (event: SupportedKeys) => void) => void;
    emitKeyDown: (key: SupportedKeys) => void;
    cleanup: () => void;
}
declare const _default: RemoteControlManager;
export default _default;
//# sourceMappingURL=RemoteControlManager.android.d.ts.map