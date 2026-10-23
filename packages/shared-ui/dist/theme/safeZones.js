"use strict";
// TV Safe Zone Configuration
// Industry standard: 5% margin from each edge (title-safe area)
// Action-safe area: 3.5% margin (for interactive elements)
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeZones = void 0;
exports.safeZones = {
    // Title-safe margins (5% of screen dimension)
    titleSafe: {
        horizontal: 90, // ~5% of 1920px
        vertical: 54, // ~5% of 1080px
    },
    // Action-safe margins (3.5% of screen dimension) 
    actionSafe: {
        horizontal: 67, // ~3.5% of 1920px
        vertical: 38, // ~3.5% of 1080px
    },
};
