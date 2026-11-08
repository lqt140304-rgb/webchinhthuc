const fs = require('fs');
const path = require('path');

const testDir = path.resolve('test/runtime');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.cjs')).sort();

let grandTotal = 0;
const report = [];

for (const file of files) {
    const fullPath = path.join(testDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    // Count assert calls matching pattern assert('...' or assert("..."
    const matches = content.match(/assert\s*\(\s*['"][^'"]+['"]/g) || [];
    report.push({
        file,
        assertCount: matches.length,
        testIds: matches.map(m => m.replace(/assert\s*\(\s*['"]/, '').replace(/['"]/, ''))
    });
    grandTotal += matches.length;
}

console.log('=== EXACT MACHINE COUNT OF RUNTIME TEST SUITES ===');
for (const r of report) {
    console.log(`Suite: ${r.file.padEnd(45)} -> ${r.assertCount} tests`);
}
console.log('--------------------------------------------------');
console.log(`GRAND TOTAL UNIQUE ASSERTIONS: ${grandTotal}\n`);

// Check for duplicate test IDs across suites
const allIds = report.flatMap(r => r.testIds);
const duplicates = allIds.filter((item, index) => allIds.indexOf(item) !== index);
if (duplicates.length > 0) {
    console.warn('WARNING: Duplicate test IDs found:', duplicates);
} else {
    console.log('✓ All test IDs are completely unique. Zero duplicates.');
}
