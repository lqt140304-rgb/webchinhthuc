const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join('public', 'fonts');
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

// Complete single-file WOFF2 fonts with 100% full Vietnamese + Latin + Latin-ext support
// Extracted from Google Fonts (official SIL Open Font License distribution)
const fontFiles = [
  {
    filename: 'be-vietnam-pro-400.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVPSTAyLFyeg_IDWvOJmVES_Ew1.woff2',
    family: 'Be Vietnam Pro',
    weight: '400',
    style: 'normal',
    desc: 'Regular body text, paragraphs, descriptions'
  },
  {
    filename: 'be-vietnam-pro-500.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVMSTAyLFyeg_IDWvOJmVES_HTEJl83.woff2',
    family: 'Be Vietnam Pro',
    weight: '500',
    style: 'normal',
    desc: 'Medium labels, subheaders, badges'
  },
  {
    filename: 'be-vietnam-pro-600.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVMSTAyLFyeg_IDWvOJmVES_HToIV83.woff2',
    family: 'Be Vietnam Pro',
    weight: '600',
    style: 'normal',
    desc: 'SemiBold navigation links, buttons, CTA'
  },
  {
    filename: 'be-vietnam-pro-700.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVMSTAyLFyeg_IDWvOJmVES_HSMIF83.woff2',
    family: 'Be Vietnam Pro',
    weight: '700',
    style: 'normal',
    desc: 'Bold eyebrow titles, status badges'
  },
  {
    filename: 'be-vietnam-pro-italic-400.woff2',
    url: 'https://fonts.gstatic.com/s/bevietnampro/v12/QdVNSTAyLFyeg_IDWvOJmVES_HwyBXo.woff2',
    family: 'Be Vietnam Pro',
    weight: '400',
    style: 'italic',
    desc: 'Italic notes and editorial captions'
  },
  {
    filename: 'lora-600.woff2',
    url: 'https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787zAvCJD.woff2',
    family: 'Lora',
    weight: '600',
    style: 'normal',
    desc: 'SemiBold editorial headers (Hero frame captions)'
  },
  {
    filename: 'lora-700.woff2',
    url: 'https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787z5vCJD.woff2',
    family: 'Lora',
    weight: '700',
    style: 'normal',
    desc: 'Bold luxury headline (h1 Hero, h2 section titles, logo)'
  },
  {
    filename: 'lora-400.woff2',
    url: 'https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuyJD.woff2',
    family: 'Lora',
    weight: '400',
    style: 'normal',
    desc: 'Regular serif fallback for editorial text'
  }
];

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
  console.log('Downloading optimized complete single-file WOFF2 fonts...');
  let totalBytes = 0;

  for (const f of fontFiles) {
    const dest = path.join(fontsDir, f.filename);
    const size = await fetchFile(f.url, dest);
    totalBytes += size;
    console.log(`  ✓ ${f.filename.padEnd(30)} ${(size / 1024).toFixed(1)} KB — ${f.family} ${f.weight} ${f.style}`);
  }

  console.log(`\nDownloaded ${fontFiles.length} files. Total disk size: ${(totalBytes / 1024).toFixed(1)} KB`);

  // Generate fonts.css
  const css = `/* ==========================================================================
   SELF-HOSTED OPTIMIZED FONTS — BỆNH VIỆN THÚ Y LÊ SƠN 2026
   SIL Open Font License (OFL 1.1)
   Architecture: Single-file complete WOFF2 per weight with full Latin + Vietnamese
   Eliminates multi-file subset waterfalls and network contention.
   Zero render-blocking external requests. font-display: swap.
   ========================================================================== */

/* 1. Be Vietnam Pro — Sans-Serif Body & UI Typography */
@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-400.woff2') format('woff2');
}

@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-500.woff2') format('woff2');
}

@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-600.woff2') format('woff2');
}

@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-700.woff2') format('woff2');
}

@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/be-vietnam-pro-italic-400.woff2') format('woff2');
}

/* 2. Lora — Luxury Editorial Serif Typography (Headings & Brand Identity) */
@font-face {
  font-family: 'Lora';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/lora-400.woff2') format('woff2');
}

@font-face {
  font-family: 'Lora';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/lora-600.woff2') format('woff2');
}

@font-face {
  font-family: 'Lora';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/lora-700.woff2') format('woff2');
}
`;

  fs.writeFileSync(path.join('src', 'styles', 'fonts.css'), css, 'utf8');
  console.log('Successfully wrote src/styles/fonts.css');

  // Remove the old 21 split subset files
  const existingFiles = fs.readdirSync(fontsDir);
  let removedCount = 0;
  for (const f of existingFiles) {
    if (f.includes('-vietnamese') || f.includes('-latin-ext') || (f.includes('-latin') && !fontFiles.some(ff => ff.filename === f))) {
      fs.unlinkSync(path.join(fontsDir, f));
      removedCount++;
    }
  }
  console.log(`Cleaned up ${removedCount} legacy subset files from public/fonts/`);
}

run().catch(console.error);
