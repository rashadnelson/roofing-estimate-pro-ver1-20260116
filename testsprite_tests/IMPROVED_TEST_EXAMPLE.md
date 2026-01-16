# Improved Test Example for TC004

This document shows how to improve the test automation using the new test IDs and best practices.

## Key Improvements

1. **Test IDs instead of XPath** - More stable and maintainable
2. **Proper wait conditions** - Wait for elements to be visible/enabled
3. **Dialog handling** - Wait for dialog to fully load
4. **Select component handling** - Proper interaction with Radix UI Select
5. **Number input handling** - Clear before filling

## Example: Improved Test Code

```python
import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start Playwright
        pw = await async_api.async_playwright().start()
        browser = await pw.chromium.launch(
            headless=True,
            args=["--window-size=1280,720", "--disable-dev-shm-usage"]
        )
        context = await browser.new_context()
        context.set_default_timeout(10000)  # Increased timeout
        page = await context.new_page()
        
        # Navigate to homepage
        await page.goto("http://localhost:8085", wait_until="networkidle", timeout=15000)
        
        # Step 1: Signup
        await page.get_by_role('link', name='Get Started').click()
        await page.wait_for_load_state('networkidle')
        
        # Fill signup form
        await page.get_by_label('Company Name').fill('Estimate Test Co')
        await page.get_by_label('Email').fill(f'test-estimate-{int(time.time())}@example.com')
        await page.get_by_label('Password').fill('TestPass123')
        await page.get_by_role('button', name='Sign up').click()
        await page.wait_for_load_state('networkidle')
        
        # Step 2: Activate subscription
        await page.goto('http://localhost:8085/api/test/activate-subscription', wait_until="networkidle")
        # Wait for redirect or success message
        await page.wait_for_timeout(2000)
        
        # Step 3: Navigate to dashboard
        await page.goto('http://localhost:8085/dashboard', wait_until="networkidle")
        await page.wait_for_load_state('networkidle')
        
        # Step 4: Open estimate form
        # Try "New Estimate" button first, fallback to "Create Your First Estimate"
        try:
            await page.get_by_test_id('new-estimate-button').click(timeout=5000)
        except:
            await page.get_by_test_id('create-first-estimate-button').click(timeout=5000)
        
        # Step 5: Wait for dialog to be fully loaded
        await page.wait_for_selector('[role="dialog"]', state='visible', timeout=10000)
        await page.wait_for_selector('[data-testid="estimate-title-input"]', state='visible', timeout=5000)
        await expect(page.get_by_test_id('estimate-title-input')).to_be_enabled()
        
        # Step 6: Fill client information
        await page.get_by_test_id('estimate-title-input').fill('Kitchen Plumbing Repair')
        await page.get_by_test_id('estimate-client-name-input').fill('John Doe')
        await page.get_by_test_id('estimate-client-phone-input').fill('555-1234')
        await page.get_by_test_id('estimate-client-address-input').fill('123 Main St')
        
        # Step 7: Fill first line item
        # Wait for line item to be visible
        await page.wait_for_selector('[data-testid="line-item-0-description"]', state='visible')
        
        # Fill description
        await page.get_by_test_id('line-item-0-description').fill('Pipe Installation')
        
        # Select type (Labor)
        await page.get_by_test_id('line-item-0-type-select').click()
        await page.wait_for_selector('[role="listbox"]', state='visible', timeout=5000)
        await page.get_by_role('option', name='Labor').click()
        
        # Fill quantity and unit price
        quantity_input = page.get_by_test_id('line-item-0-quantity')
        await quantity_input.clear()
        await quantity_input.fill('2')
        
        unit_price_input = page.get_by_test_id('line-item-0-unit-price')
        await unit_price_input.clear()
        await unit_price_input.fill('150')
        
        # Step 8: Verify auto-calculation for first item
        await expect(page.get_by_test_id('estimate-total')).to_contain_text('300.00', timeout=3000)
        
        # Step 9: Add second line item
        await page.get_by_test_id('add-line-item-button').click()
        
        # Wait for second line item to appear
        await page.wait_for_selector('[data-testid="line-item-1-description"]', state='visible', timeout=5000)
        
        # Fill second line item
        await page.get_by_test_id('line-item-1-description').fill('PVC Pipe')
        
        # Select type (Material)
        await page.get_by_test_id('line-item-1-type-select').click()
        await page.wait_for_selector('[role="listbox"]', state='visible', timeout=5000)
        await page.get_by_role('option', name='Material').click()
        
        # Fill quantity and unit price
        await page.get_by_test_id('line-item-1-quantity').clear()
        await page.get_by_test_id('line-item-1-quantity').fill('10')
        await page.get_by_test_id('line-item-1-unit-price').clear()
        await page.get_by_test_id('line-item-1-unit-price').fill('5')
        
        # Step 10: Verify total calculation (2*150 + 10*5 = 350)
        await expect(page.get_by_test_id('estimate-total')).to_contain_text('350.00', timeout=3000)
        
        # Step 11: Submit form
        await page.get_by_test_id('submit-estimate-button').click()
        
        # Step 12: Wait for dialog to close and success message
        await page.wait_for_selector('[role="dialog"]', state='hidden', timeout=10000)
        await expect(page.get_by_text('Estimate created successfully')).to_be_visible(timeout=5000)
        
        # Step 13: Verify estimate appears in list
        await expect(page.get_by_text('Kitchen Plumbing Repair')).to_be_visible(timeout=5000)
        await expect(page.get_by_text('$350.00')).to_be_visible(timeout=5000)
        
        # Step 14: Edit estimate
        # Find the estimate row and click edit button
        estimate_row = page.locator('tr').filter(has_text='Kitchen Plumbing Repair')
        await estimate_row.get_by_role('button', name='Edit estimate').click()
        
        # Wait for edit dialog
        await page.wait_for_selector('[role="dialog"]', state='visible', timeout=5000)
        await page.wait_for_selector('[data-testid="estimate-title-input"]', state='visible')
        
        # Verify form is populated
        await expect(page.get_by_test_id('estimate-title-input')).to_have_value('Kitchen Plumbing Repair')
        
        # Add third line item
        await page.get_by_test_id('add-line-item-button').click()
        await page.wait_for_selector('[data-testid="line-item-2-description"]', state='visible')
        
        await page.get_by_test_id('line-item-2-description').fill('Equipment Rental')
        await page.get_by_test_id('line-item-2-type-select').click()
        await page.wait_for_selector('[role="listbox"]', state='visible')
        await page.get_by_role('option', name='Equipment').click()
        await page.get_by_test_id('line-item-2-quantity').fill('1')
        await page.get_by_test_id('line-item-2-unit-price').fill('75')
        
        # Verify updated total (350 + 75 = 425)
        await expect(page.get_by_test_id('estimate-total')).to_contain_text('425.00', timeout=3000)
        
        # Save changes
        await page.get_by_test_id('submit-estimate-button').click()
        await page.wait_for_selector('[role="dialog"]', state='hidden', timeout=10000)
        await expect(page.get_by_text('Estimate updated successfully')).to_be_visible(timeout=5000)
        
        # Verify updated total in list
        await expect(page.get_by_text('$425.00')).to_be_visible(timeout=5000)
        
        # Step 15: Delete estimate
        estimate_row = page.locator('tr').filter(has_text='Kitchen Plumbing Repair')
        await estimate_row.get_by_role('button', name='Delete estimate').click()
        
        # Confirm deletion
        await page.wait_for_selector('[role="alertdialog"]', state='visible', timeout=5000)
        await page.get_by_role('button', name='Delete').click()
        
        # Verify deletion
        await expect(page.get_by_text('Estimate deleted successfully')).to_be_visible(timeout=5000)
        await expect(page.get_by_text('Kitchen Plumbing Repair')).not_to_be_visible(timeout=5000)
        
        await asyncio.sleep(2)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
```

## Key Differences from Original Test

1. **Test IDs**: Uses `get_by_test_id()` instead of XPath selectors
2. **Wait conditions**: Explicit waits for visibility and enabled state
3. **Dialog handling**: Waits for dialog to open/close properly
4. **Select handling**: Properly clicks trigger and waits for dropdown
5. **Number inputs**: Clears before filling
6. **Total verification**: Waits for total to update after each change
7. **Error handling**: Try/except for fallback scenarios
8. **Increased timeouts**: More realistic timeouts for async operations

## Benefits

- **More reliable**: Less flaky due to proper waits
- **More maintainable**: Test IDs don't break with DOM changes
- **Better debugging**: Clear selectors make failures easier to diagnose
- **Faster**: Proper waits prevent unnecessary delays
- **More readable**: Test IDs are self-documenting
