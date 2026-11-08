const fs = require('fs');

const reclassifications = {
    'SEC-11': 'PARTIAL',
    'SEC-15': 'PARTIAL',
    'SEC-17': 'SIMULATED',
    'SEC-22': 'DESIGN VERIFIED',
    'SEC-29': 'DESIGN VERIFIED',
    'SEC-32': 'PARTIAL',
    'SEC-35': 'RUNTIME PASS',
    'SEC-39': 'PARTIAL',
    'SEC-40': 'SIMULATED',
    'IMP-12': 'SIMULATED',
    'IMP-13': 'SIMULATED',
    'IMP-22': 'PARTIAL',
};

const matrixPath = 'docs/qa/PHASE4B_92_SCENARIOS_TRACEABILITY_MATRIX_CORRECTED.md';
let content = fs.readFileSync(matrixPath, 'utf8');
const lines = content.split('\n');
const newLines = [];

for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) {
        newLines.push(line);
        continue;
    }
    // Match | **ID** | ... | **`STATUS`** |
    const match = trimmed.match(/^\|\s*\*\*([A-Z0-9_-]+)\*\*\s*\|(.*)\|\s*(\*\*(?:`[^`]+`|[^*]+)\*\*)\s*\|$/);
    if (match) {
        const id = match[1];
        const body = match[2];
        const currentStatus = match[3];
        if (reclassifications[id]) {
            newLines.push(`| **${id}** |${body}| **\`${reclassifications[id]}\`** |`);
        } else {
            newLines.push(line);
        }
    } else {
        newLines.push(line);
    }
}

fs.writeFileSync(matrixPath, newLines.join('\n'));
console.log('Matrix updated cleanly.');
