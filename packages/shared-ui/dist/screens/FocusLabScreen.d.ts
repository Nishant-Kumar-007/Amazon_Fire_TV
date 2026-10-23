import React from 'react';
export interface DiagnosticTestResult {
    id: string;
    name: string;
    category: 'Focus' | 'Remote' | 'Navigation' | 'Storage' | 'Display';
    status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'UNTESTED';
    durationMs: number;
    message: string;
}
export default function FocusLabScreen(): React.JSX.Element;
//# sourceMappingURL=FocusLabScreen.d.ts.map