const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

function getMd5(filePath) {
    const data = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(data).digest('hex');
}

const sourceDir = path.resolve('D:/webbvct/docs/architecture');
const qaSourceDir = path.resolve('D:/webbvct/docs/qa');

const archFilesToSync = [
    'PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md',
    'OWNER_DECISION_REGISTER.md',
    'PHASE4A_V169_CHANGELOG.md',
    'PHASE4A_V169_REGRESSION_CHECKLIST.md',
    'PHASE4A_FINAL_OWNER_REVIEW.md',
    'PHASE4A_OWNER_APPROVAL_REQUEST.md',
    'PHASE4B_IMPLEMENTATION_PLAN.md',
    'PHASE4B_TEST_AND_ACCEPTANCE_MATRIX.md',
    'BAO_CAO_TRINH_CEO_PHASE4A.md'
];

const qaFilesToSync = [
    'qa-phase4a-v1.6.9-review.md',
    'PHASE4A_STATIC_QA_EVIDENCE_AUDIT.md'
];

const targetDirs = [
    path.resolve('D:/webbvct/work/claude-qa/docs/architecture'),
    path.resolve('D:/webbvct/work/antigravity-ui/docs/architecture'),
    path.resolve('D:/webbvct/deliverables/docs'),
    path.resolve('C:/Users/Admin/.gemini/antigravity/brain/6f5020a8-5310-41e1-a151-7821d0315e27')
];

console.log('=== SYNCING ARCHITECTURE & QA DELIVERABLES v1.6.9 ===');

// Run verification scripts and produce combined stdout report
console.log('\nRunning verification scripts to generate VERIFICATION_RUN_OUTPUT_v169.txt...');
const verifyOutput = execSync('node scripts/verify_v1_6_9_comprehensive.cjs', { encoding: 'utf8' });
const dupOutput = execSync('node scripts/find_duplicates.cjs', { encoding: 'utf8' });
const deepQaOutput = execSync('node scripts/deep_qa_audit_v169.cjs', { encoding: 'utf8' });

const combinedVerificationReport = `# BÁO CÁO KẾT QUẢ CHẠY SCRIPT KIỂM ĐỊNH TỰ ĐỘNG v1.6.9
Thời điểm kiểm tra: ${new Date().toISOString()}

## 1. Kết Quả Chạy deep_qa_audit_v169.cjs (26 Tiêu Chí Chuyên Sâu)
\`\`\`
${deepQaOutput}
\`\`\`

## 2. Kết Quả Chạy verify_v1_6_9_comprehensive.cjs
\`\`\`
${verifyOutput}
\`\`\`

## 3. Kết Quả Chạy find_duplicates.cjs
\`\`\`
${dupOutput}
\`\`\`
`;

const verifOutputFile = path.join(sourceDir, 'VERIFICATION_RUN_OUTPUT_v169.txt');
fs.writeFileSync(verifOutputFile, combinedVerificationReport, 'utf8');
console.log('Generated: VERIFICATION_RUN_OUTPUT_v169.txt');

// Check source checksums for architecture files
const sourceChecksums = {};
const allArchFiles = [...archFilesToSync, 'VERIFICATION_RUN_OUTPUT_v169.txt'];

allArchFiles.forEach(f => {
    const p = path.join(sourceDir, f);
    if (!fs.existsSync(p)) throw new Error(`Source file missing: ${p}`);
    sourceChecksums[f] = getMd5(p);
    console.log(`Source Arch: ${f} -> MD5: ${sourceChecksums[f]} (${fs.statSync(p).size} bytes)`);
});

const qaSourceChecksums = {};
qaFilesToSync.forEach(f => {
    const p = path.join(qaSourceDir, f);
    if (!fs.existsSync(p)) throw new Error(`Source QA file missing: ${p}`);
    qaSourceChecksums[f] = getMd5(p);
    console.log(`Source QA: ${f} -> MD5: ${qaSourceChecksums[f]} (${fs.statSync(p).size} bytes)`);
});

// Sync architecture files to target dirs
targetDirs.forEach(tDir => {
    console.log(`\nSyncing to: ${tDir}`);
    if (!fs.existsSync(tDir)) {
        fs.mkdirSync(tDir, { recursive: true });
        console.log(`  Created directory: ${tDir}`);
    }

    allArchFiles.forEach(f => {
        const srcFile = path.join(sourceDir, f);
        const dstFile = path.join(tDir, f);
        fs.copyFileSync(srcFile, dstFile);
        const dstMd5 = getMd5(dstFile);
        if (dstMd5 !== sourceChecksums[f]) {
            throw new Error(`Checksum mismatch for ${dstFile}! Expected ${sourceChecksums[f]}, got ${dstMd5}`);
        }
        console.log(`  Synced ${f}: MD5 MATCH (${dstMd5})`);
    });

    // Sync QA files
    qaFilesToSync.forEach(f => {
        let targetQaPath;
        if (tDir.includes('docs/architecture')) {
            targetQaPath = path.join(path.dirname(tDir), 'qa', f);
        } else {
            targetQaPath = path.join(tDir, f);
        }
        const targetParent = path.dirname(targetQaPath);
        if (!fs.existsSync(targetParent)) fs.mkdirSync(targetParent, { recursive: true });
        const srcQaFile = path.join(qaSourceDir, f);
        fs.copyFileSync(srcQaFile, targetQaPath);
        const dstMd5 = getMd5(targetQaPath);
        if (dstMd5 !== qaSourceChecksums[f]) {
            throw new Error(`Checksum mismatch for QA file ${targetQaPath}! Expected ${qaSourceChecksums[f]}, got ${dstMd5}`);
        }
        console.log(`  Synced QA ${f}: MD5 MATCH (${dstMd5})`);
    });
});

console.log('\n>>> ALL 6 LOCATIONS SYNCHRONIZED AND VERIFIED 100% MATCHING MD5! <<<');

// Create ZIP bundle containing all 12 deliverables strictly on D: drive
const deliverablesZip = path.resolve('D:/webbvct/deliverables/LeSon-Phase4A-v1.6.9-Deliverables.zip');

const filesForZip = [
    ...allArchFiles.map(f => path.join(sourceDir, f)),
    ...qaFilesToSync.map(f => path.join(qaSourceDir, f))
];

const psCommand = `Compress-Archive -Path '${filesForZip.join("', '")}' -DestinationPath '${deliverablesZip}' -Force`;
execSync(`powershell -Command "${psCommand}"`);

console.log(`\nCreated ZIP bundle on D: drive (containing ${filesForZip.length} files):`);
console.log(`  ${deliverablesZip} (${fs.statSync(deliverablesZip).size} bytes)`);
