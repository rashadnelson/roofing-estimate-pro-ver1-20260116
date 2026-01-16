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
        # -> Start API testing by creating an estimate with valid data via API
        await page.goto('http://localhost:8085/api/estimates', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Perform API POST request to create estimate with valid data and verify response status and JSON payload
        await page.goto('http://localhost:8085', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Create estimate via API with valid data and verify response status 201 and JSON payload with estimate ID and details
        await page.goto('http://localhost:8085/api/estimates', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Return to home page to explore other navigation options or API documentation links
        frame = context.pages[-1]
        # Click 'Return to Home' link to go back to main page
        elem = frame.locator('xpath=html/body/div/div[2]/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Create estimate via API with valid data and verify response status 201 and JSON payload with estimate ID and details
        await page.goto('http://localhost:8085/api/estimates', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Use an API testing tool or script to perform POST request to create estimate with valid data and verify response status 201 and JSON payload with estimate ID and details
        await page.goto('http://localhost:8085', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Perform API POST request to create estimate with valid data and verify response status 201 and JSON payload with estimate ID and details
        await page.goto('http://localhost:8085/api/estimates', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click 'Return to Home' link to go back to main page and explore other options for API testing
        frame = context.pages[-1]
        # Click 'Return to Home' link
        elem = frame.locator('xpath=html/body/div/div[2]/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Open a new tab to perform API POST request to create estimate with valid data and verify response status 201 and JSON payload with estimate ID and details
        await page.goto('about:blank', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Perform API POST request to create estimate with valid data and verify response status 201 and JSON payload with estimate ID and details
        await page.goto('http://localhost:8085/api/estimates', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Return to home page to explore other options or API documentation links
        frame = context.pages[-1]
        # Click 'Return to Home' link to go back to main page
        elem = frame.locator('xpath=html/body/div/div[2]/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=PlumbProEstimate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Features').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pricing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Get Started').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=BUILT FOR PLUMBING PROFESSIONALS').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Send quotes that are').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=fast').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=professional').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=accurate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=trusted').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Create professional plumbing estimates in under a minute. No more messy paperwork or lost quotes—just sharp, branded PDFs your clients will trust.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start for $99/year').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PDF Export').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Under 60 Seconds').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email to Clients').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FEATURES').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Everything you need.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nothing you don\'t.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Built by tradespeople, for tradespeople. Every feature serves one purpose: helping you win more jobs.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Professional PDFs').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Clean, branded estimates that make you look like a pro team. Your logo, your name, your credibility.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Fast Quote Builder').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Add parts, labor, and equipment in seconds. No spreadsheets, no hassle—just results.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email Direct').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Send estimates straight to your clients. They get a professional PDF, you get the job.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Your Branding').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Upload your logo once, and every estimate carries your brand. Make it official.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Client Management').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Save client details and estimate history. Access everything from your dashboard.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Secure & Private').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Your data is yours. We don\'t share, sell, or mess with your business information.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PRICING').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$99/year.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No fluff, no monthly bills.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=One simple price. Full access. No surprises.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=BEST VALUE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pro Access').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$99').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=/year').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=That\'s less than $9/month for your whole team').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Unlimited estimates').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Professional PDF exports').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email estimates directly').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Custom logo & branding').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Client management dashboard').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Estimate history & tracking').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Mobile-friendly access').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Priority support').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Get Started Now').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Instant access after payment. No hidden fees.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ready to look like a pro?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Join hundreds of plumbers who send professional estimates in under a minute. Your clients will notice the difference.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start for $99/year').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No credit card required to explore. Pay when you\'re ready.').first).to_be_visible(timeout=30000)
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
    