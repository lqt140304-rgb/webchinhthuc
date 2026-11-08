const fs = require('fs');
const content = fs.readFileSync('docs/qa/PHASE4B_92_SCENARIOS_TRACEABILITY_MATRIX_CORRECTED.md', 'utf8');
const lines = content.split('\n');
const sec = [];
const imp = [];

for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const parts = line.split('|').map(s => s.trim().replace(/\*\*/g, '').replace(/`/g, ''));
    if (parts.length < 5) continue;
    const id = parts[1];
    const status = parts[parts.length - 2];
    if (id.startsWith('SEC-')) {
        sec.push({ id, status });
    } else if (id.startsWith('IMP-')) {
        imp.push({ id, status });
    }
}

console.log('Total SEC rows:', sec.length);
console.log('Total IMP rows:', imp.length);

function countStatus(arr) {
    const counts = {};
    for (const item of arr) {
        counts[item.status] = (counts[item.status] || 0) + 1;
    }
    return counts;
}

console.log('SEC breakdown:', countStatus(sec));
console.log('IMP breakdown:', countStatus(imp));
