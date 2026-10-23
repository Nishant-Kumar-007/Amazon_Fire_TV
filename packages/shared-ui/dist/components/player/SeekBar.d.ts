import React from "react";
interface SeekBarProps {
    currentTime: number;
    duration: number;
    previewImage?: string;
    onSeekTo?: (timeSec: number) => void;
}
declare const SeekBar: React.FC<SeekBarProps>;
export default SeekBar;
//# sourceMappingURL=SeekBar.d.ts.map