/**
 * ==============================================================================
 * SCRIPT: scripts/capture_detailed_sections.cjs
 * Project: Bệnh viện Thú y Lê Sơn
 * Description: Programmatically captures granular, individual section screenshots
 *              and interactive component states using Playwright.
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/Admin/AppData/Roaming/npm/node_modules/playwright');

const BASE_URL = 'http://127.0.0.1:5173';
const OUTPUT_DIR = path.resolve('docs/qa/demo-screenshots/detailed');
const ARTIFACT_DIR = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/63a030f8-cca4-4a9e-9b5d-dc08723a8d72/detailed');

// Ensure output directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function saveScreenshot(elementOrPage, filename, description) {
    const localPath = path.join(OUTPUT_DIR, filename);
    const artifactPath = path.join(ARTIFACT_DIR, filename);

    console.log(`[CAPTURE] ${description} -> ${filename}`);
    await elementOrPage.screenshot({ path: localPath });
    fs.copyFileSync(localPath, artifactPath);
    console.log(`   ✓ Saved to docs/qa/demo-screenshots/detailed/${filename}`);
}

async function runCapture() {
    console.log('=== STARTING DETAILED DEMO SCREENSHOT CAPTURE ===\n');

    const browser = await chromium.launch({ headless: true });

    try {
        // ==================================================================
        // 1. DESKTOP HOMEPAGE SECTIONS (1440 x 900)
        // ==================================================================
        console.log('--- 1. Capturing Desktop Homepage Sections ---');
        const desktopContext = await browser.newContext({
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 1.5,
        });
        const desktopPage = await desktopContext.newPage();
        await desktopPage.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
        await desktopPage.waitForTimeout(1500);

        // 1.0 Header Desktop
        const header = desktopPage.locator('header');
        if (await header.count() > 0) {
            await saveScreenshot(header, '01_sec_00_header_desktop.png', 'Desktop Header');
        }

        // 1.1 Section 1: Hero
        const hero = desktopPage.locator('main section').first();
        if (await hero.count() > 0) {
            await saveScreenshot(hero, '02_sec_01_hero.png', 'Section 1: Hero');
        }

        // 1.2 Section 2: Why Choose Us
        const whyUs = desktopPage.locator('#vi-sao-chon-le-son');
        if (await whyUs.count() > 0) {
            await whyUs.scrollIntoViewIfNeeded();
            await desktopPage.waitForTimeout(500);
            await saveScreenshot(whyUs, '03_sec_02_why_choose_us.png', 'Section 2: Vì sao chọn Lê Sơn');
        }

        // 1.3 Section 3: Featured Services
        const services = desktopPage.locator('#dich-vu-tieu-bieu');
        if (await services.count() > 0) {
            await services.scrollIntoViewIfNeeded();
            await desktopPage.waitForTimeout(500);
            await saveScreenshot(services, '04_sec_03_featured_services.png', 'Section 3: Dịch vụ tiêu biểu');
        }

        // 1.4 Section 4: Highlight Story
        const story = desktopPage.locator('#cau-chuyen-noi-bat');
        if (await story.count() > 0) {
            await story.scrollIntoViewIfNeeded();
            await desktopPage.waitForTimeout(500);
            await saveScreenshot(story, '05_sec_04_highlight_story.png', 'Section 4: Câu chuyện nổi bật');
        }

        // 1.5 Section 5: Editorial Knowledge
        const knowledge = desktopPage.locator('#goc-kien-thuc');
        if (await knowledge.count() > 0) {
            await knowledge.scrollIntoViewIfNeeded();
            await desktopPage.waitForTimeout(500);
            await saveScreenshot(knowledge, '06_sec_05_editorial_knowledge.png', 'Section 5: Góc kiến thức');
        }

        // 1.6 Section 6: Booking & Contact
        const bookingSec = desktopPage.locator('#dat-lich-va-lien-he');
        if (await bookingSec.count() > 0) {
            await bookingSec.scrollIntoViewIfNeeded();
            await desktopPage.waitForTimeout(500);
            await saveScreenshot(bookingSec, '07_sec_06_booking_contact.png', 'Section 6: Đặt lịch & Liên hệ');
        }

        // 1.7 Footer Desktop
        const footer = desktopPage.locator('footer');
        if (await footer.count() > 0) {
            await footer.scrollIntoViewIfNeeded();
            await desktopPage.waitForTimeout(500);
            await saveScreenshot(footer, '08_sec_07_footer_desktop.png', 'Desktop Footer');
        }

        // ==================================================================
        // 2. INTERACTIVE HEADER DROPDOWNS (1440 x 900)
        // ==================================================================
        console.log('\n--- 2. Capturing Interactive Header Dropdowns ---');
        await desktopPage.evaluate(() => window.scrollTo(0, 0));
        await desktopPage.waitForTimeout(400);

        // 2.1 Dropdown "Về Lê Sơn"
        const aboutBtn = desktopPage.locator('header button:has-text("Về Lê Sơn")');
        if (await aboutBtn.count() > 0) {
            await aboutBtn.click();
            await desktopPage.waitForTimeout(500);
            // Capture top portion showing the open menu
            await desktopPage.setViewportSize({ width: 1440, height: 500 });
            await saveScreenshot(desktopPage, '09_interactive_dropdown_about.png', 'Header Dropdown - Về Lê Sơn');
            await aboutBtn.click(); // close
            await desktopPage.waitForTimeout(300);
        }

        // 2.2 Dropdown "Dịch vụ"
        const servicesBtn = desktopPage.locator('header button:has-text("Dịch vụ")');
        if (await servicesBtn.count() > 0) {
            await servicesBtn.click();
            await desktopPage.waitForTimeout(500);
            await desktopPage.setViewportSize({ width: 1440, height: 600 });
            await saveScreenshot(desktopPage, '10_interactive_dropdown_services.png', 'Header Dropdown - Dịch vụ y tế');
            await servicesBtn.click(); // close
            await desktopPage.waitForTimeout(300);
        }

        // 2.3 Dropdown "Góc thú cưng"
        const petCornerBtn = desktopPage.locator('header button:has-text("Góc thú cưng")');
        if (await petCornerBtn.count() > 0) {
            await petCornerBtn.click();
            await desktopPage.waitForTimeout(500);
            await desktopPage.setViewportSize({ width: 1440, height: 500 });
            await saveScreenshot(desktopPage, '11_interactive_dropdown_petcorner.png', 'Header Dropdown - Góc thú cưng');
            await petCornerBtn.click(); // close
            await desktopPage.waitForTimeout(300);
        }

        await desktopContext.close();

        // ==================================================================
        // 3. MOBILE VIEWS & DRAWER (390 x 844)
        // ==================================================================
        console.log('\n--- 3. Capturing Mobile Views & Drawer ---');
        const mobileContext = await browser.newContext({
            viewport: { width: 390, height: 844 },
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
        });
        const mobilePage = await mobileContext.newPage();
        await mobilePage.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
        await mobilePage.waitForTimeout(1000);

        // Mobile Header & Top
        await saveScreenshot(mobilePage, '12_mobile_01_viewport_top.png', 'Mobile Viewport Top');

        // Open Mobile Navigation Drawer
        const menuBtn = mobilePage.locator('header button[aria-haspopup="dialog"]');
        if (await menuBtn.count() > 0) {
            await menuBtn.click();
            await mobilePage.waitForTimeout(600);
            await saveScreenshot(mobilePage, '13_mobile_02_drawer_opened.png', 'Mobile Drawer Opened');
        }

        await mobileContext.close();

        // ==================================================================
        // 4. DEEP PAGES & INTERACTIVE BOOKING FORM (1440 x 900)
        // ==================================================================
        console.log('\n--- 4. Capturing Deep Pages & Form Interaction ---');
        const pageContext = await browser.newContext({
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 1.5,
        });
        const page = await pageContext.newPage();

        // 4.1 About Page (/gioi-thieu) - Main content
        await page.goto(BASE_URL + '/gioi-thieu', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        const aboutHero = page.locator('main section').first();
        if (await aboutHero.count() > 0) {
            await saveScreenshot(aboutHero, '14_page_about_hero.png', 'Trang Giới thiệu - Hero');
        }
        const aboutContent = page.locator('main');
        if (await aboutContent.count() > 0) {
            await page.setViewportSize({ width: 1440, height: 1100 });
            await saveScreenshot(page, '15_page_about_fullview.png', 'Trang Giới thiệu - Nội dung chính');
        }

        // 4.2 Team Page (/doi-ngu)
        await page.goto(BASE_URL + '/doi-ngu', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        await page.setViewportSize({ width: 1440, height: 1200 });
        await saveScreenshot(page, '16_page_team_doctors.png', 'Trang Đội ngũ Bác sĩ - Danh sách');

        // 4.3 Facilities Page (/co-so-vat-chat)
        await page.goto(BASE_URL + '/co-so-vat-chat', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        await page.setViewportSize({ width: 1440, height: 1200 });
        await saveScreenshot(page, '17_page_facilities_overview.png', 'Trang Cơ sở vật chất');

        // 4.4 Booking Page (/dat-lich) - Interactive Form Fill
        await page.goto(BASE_URL + '/dat-lich', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        await page.setViewportSize({ width: 1440, height: 950 });

        // Fill Form
        try {
            await page.fill('input#ownerName, input[name="ownerName"]', 'Nguyễn Thị Thu Hà');
            await page.fill('input#phone, input[name="phone"]', '0912345678');
            await page.fill('input#petName, input[name="petName"]', 'Bé Bông (Poodle trắng)');
            
            // Fill date
            const today = new Date().toISOString().split('T')[0];
            const dateInput = page.locator('input[type="date"]');
            if (await dateInput.count() > 0) {
                await dateInput.fill(today);
            }

            // Fill symptoms
            const textarea = page.locator('textarea');
            if (await textarea.count() > 0) {
                await textarea.fill('Bé có biểu hiện biếng ăn 2 ngày nay, hơi sốt nhẹ và uống nhiều nước hơn bình thường. Xin đặt lịch bác sĩ kiểm tra tiêu hóa và xét nghiệm máu tổng quát.');
            }
            await page.waitForTimeout(500);
        } catch (fillErr) {
            console.warn('Form fill note:', fillErr.message);
        }

        const bookingForm = page.locator('form, main');
        await saveScreenshot(page, '18_page_booking_form_interactive.png', 'Trang Đặt lịch - Biểu mẫu tương tác đã điền');

        // 4.5 Coming Soon Page (/dich-vu)
        await page.goto(BASE_URL + '/dich-vu', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        await page.setViewportSize({ width: 1440, height: 800 });
        await saveScreenshot(page, '19_page_coming_soon.png', 'Trang Dịch vụ y tế (Coming Soon)');

        // 4.6 404 Not Found Page
        await page.goto(BASE_URL + '/trang-khong-ton-tai-404', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        await page.setViewportSize({ width: 1440, height: 800 });
        await saveScreenshot(page, '20_page_not_found_404.png', 'Trang 404 Không tìm thấy');

        await pageContext.close();

    } finally {
        await browser.close();
    }

    console.log('\n=== ALL DETAILED SCREENSHOTS CAPTURED AND COPIED! ===');
}

runCapture().catch((err) => {
    console.error('Execution failed:', err);
    process.exit(1);
});
