import React from 'react';
interface MenuContextType {
    isOpen: boolean;
    toggleMenu: (isOpen: boolean) => void;
}
export declare const MenuProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useMenuContext: () => MenuContextType;
export {};
//# sourceMappingURL=MenuContext.d.ts.map