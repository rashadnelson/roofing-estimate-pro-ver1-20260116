import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:8085", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click the Privacy Policy link in the footer to verify page loads and content is displayed properly.
        frame = context.pages[-1]
        # Click Privacy Policy link in footer
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the Terms of Service link in the footer to verify page loads and content is displayed properly.
        frame = context.pages[-1]
        # Click Terms of Service link in footer
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to another page in the app, such as the home page, to verify footer links for Terms of Service and Privacy Policy and their content.
        frame = context.pages[-1]
        # Click PlumbPro Estimate Home link to navigate to home page
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try to navigate to another page by clicking the 'Features' link in the header to verify footer links and content on a different page.
        frame = context.pages[-1]
        # Click Features link in header to navigate to Features page
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Attempt direct URL navigation to the home page to verify footer links and content on a different page.
        await page.goto('http://localhost:8085', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click the Terms of Service link in the footer on the home page to verify page loads and content is displayed properly.
        frame = context.pages[-1]
        # Click Terms of Service link in footer on home page
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the Privacy Policy link in the footer on the Terms of Service page to verify it loads and displays content properly.
        frame = context.pages[-1]
        # Click Privacy Policy link in footer on Terms of Service page
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify footer links and content on one more app page to confirm consistency across multiple pages.
        frame = context.pages[-1]
        # Click PlumbPro Estimate Home link to navigate to home page for final footer verification
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the Terms of Service link in the footer on the home page to verify page loads and content is displayed properly.
        frame = context.pages[-1]
        # Click Terms of Service link in footer on home page
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the Privacy Policy link in the footer on the Terms of Service page to verify it loads and displays content properly.
        frame = context.pages[-1]
        # Click Privacy Policy link in footer on Terms of Service page
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify footer links and content on one more app page to confirm consistency across multiple pages.
        frame = context.pages[-1]
        # Click PlumbPro Estimate Home link to navigate to home page for final footer verification
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the Terms of Service link in the footer on the current page to verify page loads and content is displayed properly.
        frame = context.pages[-1]
        # Click Terms of Service link in footer on current page
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Terms of Service').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Privacy Policy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Last updated: January 5, 2026').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1. Acceptance of Terms').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=By accessing or using PlumbPro Estimate, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3. Subscription and Payment').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Annual subscription fee: $99/year').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Payment is processed through Stripe').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Access is granted immediately upon successful payment').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Subscriptions auto-renew unless cancelled').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=4. User Responsibilities').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=You are responsible for:').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Maintaining the confidentiality of your account').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=All activities that occur under your account').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ensuring the accuracy of information you provide').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Complying with all applicable laws and regulations').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5. Intellectual Property').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=All content, features, and functionality of PlumbPro Estimate are owned by us and are protected by copyright, trademark, and other intellectual property laws. You retain ownership of any content you create using our service.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=6. Limitation of Liability').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PlumbPro Estimate is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the service.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=7. Termination').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We reserve the right to suspend or terminate your access to the service at our discretion, particularly for violations of these terms. You may cancel your subscription at any time through your account settings.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=8. Changes to Terms').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We may update these terms from time to time. We will notify you of significant changes via email or through the service. Continued use after changes constitutes acceptance.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=9. Contact').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=For questions about these Terms of Service, contact us at: support@plumbproestimate.dev').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PlumbProEstimate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Features').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pricing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Get Started').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Terms of Service').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Last updated: January 5, 2026').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2026 PlumbPro Estimate. All rights reserved.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    