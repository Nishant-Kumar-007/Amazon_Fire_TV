import { SupportedKeys } from './SupportedKeys';
import { RemoteControlManagerInterface } from './RemoteControlManager.interface';
declare class RemoteControlManager implements RemoteControlManagerInterface {
    private eventEmitter;
    private tvEventSubscription?;
    constructor();
    private handleKeyDown;
    addKeydownListener: (listener: (event: SupportedKeys) => void) => ((event: SupportedKeys) => void);
    removeKeydownListener: (listener: (event: SupportedKeys) => void) => void;
    emitKeyDown: (key: SupportedKeys) => void;
    cleanup: () => void;
}
declare const _default: RemoteControlManager;
export default _default;
//# sourceMappingURL=RemoteControlManager.ios.d.ts.map