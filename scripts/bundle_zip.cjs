const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = [
    'D:/webbvct/docs/architecture/PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md',
    'D:/webbvct/docs/architecture/OWNER_DECISION_REGISTER.md',
    'D:/webbvct/docs/architecture/PHASE4A_V169_CHANGELOG.md',
    'D:/webbvct/docs/architecture/PHASE4A_V169_REGRESSION_CHECKLIST.md',
    'D:/webbvct/docs/architecture/PHASE4A_FINAL_OWNER_REVIEW.md',
    'D:/webbvct/docs/architecture/PHASE4A_OWNER_APPROVAL_REQUEST.md',
    'D:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md',
    'D:/webbvct/docs/architecture/PHASE4B_TEST_AND_ACCEPTANCE_MATRIX.md',
    'D:/webbvct/docs/architecture/BAO_CAO_TRINH_CEO_PHASE4A.md',
    'D:/webbvct/docs/architecture/VERIFICATION_RUN_OUTPUT_v169.txt',
    'D:/webbvct/docs/qa/qa-phase4a-v1.6.9-review.md',
    'D:/webbvct/docs/qa/PHASE4A_STATIC_QA_EVIDENCE_AUDIT.md'
];

const targetZip = 'D:/webbvct/deliverables/LeSon-Phase4A-v1.6.9-Deliverables.zip';
const targetDir = path.dirname(targetZip);
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const psCommand = `Compress-Archive -Path '${files.join("', '")}' -DestinationPath '${targetZip}' -Force`;
execSync(`powershell -Command "${psCommand}"`);

console.log('Zip created strictly on D: drive!');
console.log('Location:', targetZip, fs.statSync(targetZip).size, 'bytes');
