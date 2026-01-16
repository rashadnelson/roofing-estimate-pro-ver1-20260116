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
        # -> Click the Privacy Policy link in the footer to verify its content.
        frame = context.pages[-1]
        # Click Privacy Policy link in footer
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the Terms of Service link in the footer to verify its content.
        frame = context.pages[-1]
        # Click Terms of Service link in footer
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Confirm footer links for Terms of Service and Privacy Policy are accessible from another page to ensure consistency.
        frame = context.pages[-1]
        # Click PlumbPro Estimate Home link in header/footer to navigate to homepage
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to the homepage by direct URL entry to verify footer links accessibility on a different page.
        await page.goto('http://localhost:8085/', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click the Terms of Service link in the footer to verify it loads correctly from this page.
        frame = context.pages[-1]
        # Click Terms of Service link in footer
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the Privacy Policy link in the footer from the Terms of Service page to verify it loads correctly from this page.
        frame = context.pages[-1]
        # Click Privacy Policy link in footer from Terms of Service page
        elem = frame.locator('xpath=html/body/div/div[2]/footer/div/div/div[2]/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Privacy Policy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Last updated: January 5, 2026').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1. Information We Collect').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Account information (email address, password)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Business information (company name, logo)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Client information you enter for estimates').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Estimate data and history').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2. How We Use Your Information').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Provide, maintain, and improve our services').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Process transactions and send related information').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Send technical notices and support messages').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Respond to your comments and questions').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3. Data Security').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is 100% secure.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=4. Data Retention').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5. Your Rights').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=You have the right to:').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Access your personal information').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Correct inaccurate data').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Request deletion of your data').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Export your data').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=6. Contact Us').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=If you have questions about this Privacy Policy, please contact us at: support@plumbproestimate.dev').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PlumbProEstimate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Professional estimates in under a minute. Built for plumbers who mean business.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=LEGAL').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Privacy Policy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Terms of Service').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=SUPPORT').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=support@plumbproestimate.dev').first).to_be_visible(timeout=30000)
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
    