/**
 * ==============================================================================
 * SCRIPT: scripts/capture_full_demo.cjs
 * Project: Bệnh viện Thú y Lê Sơn
 * Description: Captures full-page screenshots of all key demo pages across
 *              desktop, tablet, and mobile viewports.
 * ==============================================================================
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:5173';
const OUTPUT_DIR = path.resolve('docs/qa/demo-screenshots');
const ARTIFACT_DIR = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/63a030f8-cca4-4a9e-9b5d-dc08723a8d72');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const PAGES = [
    {
        name: '01_homepage_desktop_1440.png',
        route: '/',
        viewport: '1440,900',
        fullPage: true,
        title: 'Trang chủ (Desktop 1440px - Full 6 Sections)'
    },
    {
        name: '02_homepage_mobile_390.png',
        route: '/',
        viewport: '390,844',
        fullPage: true,
        title: 'Trang chủ (Mobile 390px - Full Page)'
    },
    {
        name: '03_homepage_tablet_768.png',
        route: '/',
        viewport: '768,1024',
        fullPage: true,
        title: 'Trang chủ (Tablet 768px - Full Page)'
    },
    {
        name: '04_about_page_desktop_1440.png',
        route: '/gioi-thieu',
        viewport: '1440,900',
        fullPage: true,
        title: 'Về Lê Sơn (Desktop 1440px)'
    },
    {
        name: '05_team_page_desktop_1440.png',
        route: '/doi-ngu',
        viewport: '1440,900',
        fullPage: true,
        title: 'Đội ngũ Y Bác sĩ (Desktop 1440px)'
    },
    {
        name: '06_facilities_page_desktop_1440.png',
        route: '/co-so-vat-chat',
        viewport: '1440,900',
        fullPage: true,
        title: 'Cơ sở vật chất & Trang thiết bị (Desktop 1440px)'
    },
    {
        name: '07_booking_page_desktop_1440.png',
        route: '/dat-lich',
        viewport: '1440,900',
        fullPage: true,
        title: 'Đặt lịch khám (Desktop 1440px)'
    },
    {
        name: '08_booking_page_mobile_390.png',
        route: '/dat-lich',
        viewport: '390,844',
        fullPage: true,
        title: 'Đặt lịch khám (Mobile 390px)'
    },
    {
        name: '09_coming_soon_desktop_1440.png',
        route: '/dich-vu',
        viewport: '1440,900',
        fullPage: true,
        title: 'Danh mục dịch vụ y tế (Coming Soon 1440px)'
    },
    {
        name: '10_not_found_page_desktop_1440.png',
        route: '/trang-khong-ton-tai',
        viewport: '1440,900',
        fullPage: true,
        title: 'Trang 404 Không tìm thấy (Desktop 1440px)'
    }
];

async function captureAll() {
    console.log('=== STARTING FULL DEMO SCREENSHOT CAPTURE ===\n');

    for (const p of PAGES) {
        const outPath = path.join(OUTPUT_DIR, p.name);
        const url = `${BASE_URL}${p.route}`;
        const cmd = `npx playwright screenshot --full-page --viewport-size="${p.viewport}" --wait-for-timeout=2500 "${url}" "${outPath}"`;
        
        console.log(`[CAPTURING] ${p.title}...`);
        try {
            execSync(cmd, { stdio: 'pipe', encoding: 'utf8' });
            console.log(`   -> Saved: ${outPath}`);

            // Copy to artifact directory if available
            if (fs.existsSync(ARTIFACT_DIR)) {
                const artifactDest = path.join(ARTIFACT_DIR, p.name);
                fs.copyFileSync(outPath, artifactDest);
                console.log(`   -> Copied to artifact: ${artifactDest}`);
            }
        } catch (err) {
            console.error(`   -> Error capturing ${p.name}: ${err.message}`);
        }
    }

    console.log('\n=== ALL SCREENSHOTS CAPTURED SUCCESSFULLY ===');
}

captureAll();
