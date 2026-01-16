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
        await page.goto("http://localhost:8086", wait_until="commit", timeout=10000)
        
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
        # -> Confirm that there are two call-to-action buttons and they are clickable
        frame = context.pages[-1]
        # Click the 'Get Started Free' CTA button to verify it is clickable
        elem = frame.locator('xpath=html/body/div/div[2]/main/section/div[2]/div/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click the 'View Pricing' CTA button to verify it is clickable
        elem = frame.locator('xpath=html/body/div/div[2]/main/section/div[2]/div/div[3]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify that the feature highlights section displays the expected features
        await page.mouse.wheel(0, 600)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=PlumbProEstimate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Features').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pricing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Login').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Get Started').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=BUILT FOR PLUMBING PROFESSIONALS').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Send quotes that are').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=accurate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=professional').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=fast').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Get Started Free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=View Pricing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FEATURES').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Everything you need.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nothing you don\'t.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Professional PDFs').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Fast Quote Builder').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email Direct').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Your Branding').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Client Management').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Secure & Private').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PRICING').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Simple, transparent pricing.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No surprises.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$0').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try it out with limited access').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3 estimates/month').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Watermarked PDFs').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Basic calculations').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Unlimited estimates').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No watermark').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Save templates').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Logo upload').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Priority support').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Monthly').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$19').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=/month').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Full access, pay as you go').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Unlimited estimates').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No watermark').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Professional PDFs').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Save templates').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email estimates directly').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Client management').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Logo upload').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Priority support').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=BEST VALUE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Annual').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$149').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=/year').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$12.42/mo').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Best value — save 35%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Unlimited estimates').nth(2)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No watermark').nth(2)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Professional PDFs').nth(2)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Save templates').nth(2)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email estimates directly').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Client management').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Logo upload').nth(2)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Priority support').nth(2)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=TESTIMONIALS').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Trusted by plumbing professionals').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=See what plumbers are saying about PlumbPro Estimate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Mike Rodriguez').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Owner, Rodriguez Plumbing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sarah Chen').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Independent Contractor').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=James Thompson').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Thompson & Sons Plumbing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ready to look like a pro?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Join hundreds of plumbers who send professional estimates in under a minute. Your clients will notice the difference.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start for $149/year').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No credit card required to explore. Pay when you\'re ready.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PlumbProEstimate').nth(1)).to_be_visible(timeout=30000)
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
    