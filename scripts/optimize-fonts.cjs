/**
 * OPTIMIZE FONTS SCRIPT — BỆNH VIỆN THÚ Y LÊ SƠN 2026
 * SIL Open Font License (OFL 1.1)
 *
 * Tiered Loading Strategy (Phương án C — CEO Directive 011-A, Fix 2B-28)
 * - Synchronized strictly with approved typography:
 *   1. Be Vietnam Pro 400 (Critical)
 *   2. Be Vietnam Pro 500 (Secondary - True weight 500)
 *   3. Be Vietnam Pro 600 (Critical)
 *   4. Be Vietnam Pro 700 (Secondary - True weight 700)
 *   5. Be Vietnam Pro Italic 400 (Secondary - True italic)
 *   6. Lora 600 (Critical - Approved Luxury Editorial Headings)
 *
 * Idempotent execution:
 * - Does NOT re-download existing valid files unless --force is passed.
 * - Removes unapproved/unreferenced files (e.g. lora-400, lora-700, legacy subsets).
 * - Generates src/styles/fonts.css identically matching approved configuration.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join('public', 'fonts');
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

// Approved 6 single-file complete WOFF2 fonts with 100% full Vietnamese + Latin support
const fontFiles = [
  {
    filename: 'be-vietnam-pro-400.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVPSTAyLFyeg_IDWvOJmVES_Ew1.woff2',
    family: 'Be Vietnam Pro',
    weight: '400',
    style: 'normal',
    tier: 'CRITICAL',
    desc: 'Regular body text, paragraphs, descriptions'
  },
  {
    filename: 'be-vietnam-pro-500.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVMSTAyLFyeg_IDWvOJmVES_HTEJl83.woff2',
    family: 'Be Vietnam Pro',
    weight: '500',
    style: 'normal',
    tier: 'SECONDARY',
    desc: 'Medium labels, subheaders, badges (true weight 500)'
  },
  {
    filename: 'be-vietnam-pro-600.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVMSTAyLFyeg_IDWvOJmVES_HToIV83.woff2',
    family: 'Be Vietnam Pro',
    weight: '600',
    style: 'normal',
    tier: 'CRITICAL',
    desc: 'SemiBold navigation links, buttons, CTA'
  },
  {
    filename: 'be-vietnam-pro-700.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVMSTAyLFyeg_IDWvOJmVES_HSMIF83.woff2',
    family: 'Be Vietnam Pro',
    weight: '700',
    style: 'normal',
    tier: 'SECONDARY',
    desc: 'Bold eyebrow titles, status badges (true weight 700)'
  },
  {
    filename: 'be-vietnam-pro-italic-400.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVNSTAyLFyeg_IDWvOJmVES_HwyBXo.woff2',
    family: 'Be Vietnam Pro',
    weight: '400',
    style: 'italic',
    tier: 'SECONDARY',
    desc: 'Italic notes and editorial captions (true italic)'
  },
  {
    filename: 'lora-600.woff2',
    url: 'https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787zAvCJD.woff2',
    family: 'Lora',
    weight: '400 900',
    style: 'normal',
    tier: 'CRITICAL',
    desc: 'Approved luxury editorial serif headings (h1, h2, brand logo)'
  }
];

const approvedFilenames = new Set([...fontFiles.map(f => f.filename), '.gitkeep']);

function fetchFile(u, dest) {
  return new Promise((resolve, reject) => {
    https.get(u, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${u}: HTTP ${res.statusCode}`));
      }
      const data = [];
      res.on('data', c => data.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(data);
        fs.writeFileSync(dest, buf);
        resolve(buf.length);
      });
    }).on('error', reject);
  });
}

async function run() {
  const force = process.argv.includes('--force');
  console.log('=== VERIFYING / SYNCHRONIZING APPROVED FONTS (Phương án C) ===\n');

  let totalBytes = 0;
  for (const f of fontFiles) {
    const dest = path.join(fontsDir, f.filename);
    let size = 0;
    if (fs.existsSync(dest) && !force) {
      size = fs.statSync(dest).size;
      console.log(`  ✓ [EXISTS] ${f.filename.padEnd(32)} ${(size / 1024).toFixed(1)} KB — ${f.family} ${f.weight} [${f.tier}]`);
    } else {
      console.log(`  ↓ [DOWNLOADING] ${f.filename} from official CDN...`);
      size = await fetchFile(f.url, dest);
      console.log(`  ✓ [DOWNLOADED] ${f.filename.padEnd(30)} ${(size / 1024).toFixed(1)} KB — ${f.family} ${f.weight} [${f.tier}]`);
    }
    totalBytes += size;
  }
  console.log(`\nVerified ${fontFiles.length} approved font files. Total disk size: ${(totalBytes / 1024).toFixed(1)} KB`);

  // Remove any unapproved / legacy font files from public/fonts
  const existingFiles = fs.readdirSync(fontsDir);
  let removedCount = 0;
  for (const f of existingFiles) {
    if (!approvedFilenames.has(f)) {
      fs.unlinkSync(path.join(fontsDir, f));
      console.log(`  ✕ Removed unapproved font file: ${f}`);
      removedCount++;
    }
  }
  if (removedCount > 0) {
    console.log(`Cleaned up ${removedCount} unapproved font files from public/fonts/`);
  } else {
    console.log('Repository hygiene check: public/fonts/ is clean (0 unapproved files).');
  }

  // Generate fonts.css matching exactly the approved configuration
  const css = `/* ==========================================================================
   SELF-HOSTED FONTS — BỆNH VIỆN THÚ Y LÊ SƠN 2026
   SIL Open Font License (OFL 1.1)
   Architecture: Tiered Loading Strategy (Phương án C — CEO Directive 011-A)
   - Critical (Preloaded): Be Vietnam Pro 400, Be Vietnam Pro 600, Lora 600
   - Secondary (On-demand true weights): Be Vietnam Pro 500, Be Vietnam Pro 700, Italic 400
   100% full Vietnamese (dấu tiếng Việt) + Latin support per single-file WOFF2.
   Zero render-blocking external requests. font-display: swap.
   ========================================================================== */

/* 1. Be Vietnam Pro — Regular 400 (Body text / paragraphs) [CRITICAL] */
@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-400.woff2') format('woff2');
}

/* 2. Be Vietnam Pro — SemiBold 600 (Buttons / Navigation / CTA) [CRITICAL] */
@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-600.woff2') format('woff2');
}

/* 3. Be Vietnam Pro — Medium 500 (True Weight 500: Subtitles / Badges) [SECONDARY] */
@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-500.woff2') format('woff2');
}

/* 4. Be Vietnam Pro — Bold 700 (True Weight 700: Eyebrow badges / Status) [SECONDARY] */
@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-700.woff2') format('woff2');
}

/* 5. Be Vietnam Pro — Italic 400 (True 400 Italic: Footnotes / Disclaimers) [SECONDARY] */
@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-italic-400.woff2') format('woff2');
}

/* 6. Lora — Luxury Editorial Headings (Approved SemiBold 600) [CRITICAL] */
@font-face {
  font-family: 'Lora';
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: url('/fonts/lora-600.woff2') format('woff2');
}
`;

  const fontsCssPath = path.join('src', 'styles', 'fonts.css');
  fs.writeFileSync(fontsCssPath, css, 'utf8');
  console.log(`Successfully verified and synchronized ${fontsCssPath} (Phương án C).\n`);
}

run().catch(console.error);
