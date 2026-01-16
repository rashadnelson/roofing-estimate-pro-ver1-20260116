# Test Automation UI Interaction Reliability Improvements

## Current Issues Identified

Based on the test execution results, the following issues were observed:
1. **Fragile XPath selectors** - Tests use XPath based on DOM structure which breaks easily
2. **Missing wait conditions** - Not waiting for dialog/form to be fully loaded
3. **No test IDs** - Form fields lack stable identifiers for testing
4. **Dialog handling** - Estimate form is in a Dialog component requiring special handling
5. **Dynamic content** - Line items are dynamically rendered, need proper waiting
6. **Select component** - Radix UI Select needs special interaction handling

## Recommended Solutions

### 1. Add Test IDs to Form Components

Add `data-testid` attributes to all form fields for stable selectors:

```tsx
// Example for EstimateForm.tsx
<Input
  id="title"
  data-testid="estimate-title-input"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="e.g., Kitchen Plumbing Repair"
/>

<Input
  id="clientName"
  data-testid="estimate-client-name-input"
  value={clientName}
  onChange={(e) => setClientName(e.target.value)}
  placeholder="John Doe"
/>

// For line items (indexed)
<Input
  data-testid={`line-item-${index}-description`}
  value={item.description}
  onChange={(e) => updateItem(index, "description", e.target.value)}
/>

<Input
  type="number"
  data-testid={`line-item-${index}-quantity`}
  value={item.quantity}
  onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
/>

<Input
  type="number"
  data-testid={`line-item-${index}-unit-price`}
  value={item.unitPrice}
  onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
/>

<Select
  value={item.type}
  onValueChange={(value) => updateItem(index, "type", value as EstimateItem["type"])}
>
  <SelectTrigger data-testid={`line-item-${index}-type-select`}>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="labor">Labor</SelectItem>
    <SelectItem value="material">Material</SelectItem>
    <SelectItem value="equipment">Equipment</SelectItem>
  </SelectContent>
</Select>

<Button
  type="button"
  onClick={addItem}
  data-testid="add-line-item-button"
  variant="outline"
  size="sm"
>
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>

<Button
  type="submit"
  data-testid="submit-estimate-button"
  disabled={isSubmitting}
>
  {isSubmitting ? "Saving..." : mode === "create" ? "Create Estimate" : "Update Estimate"}
</Button>
```

### 2. Improve Test Selectors

**Instead of XPath:**
```python
# Fragile XPath selector
elem = frame.locator('xpath=html/body/div[3]/form/div[2]/div[2]/div/table/tbody/tr/td[3]/input').nth(0)
```

**Use test IDs:**
```python
# Stable test ID selector
elem = page.get_by_test_id('line-item-0-quantity')
```

**Or use text/role-based selectors:**
```python
# More reliable text-based selector
elem = page.get_by_label('Quantity').first  # If labels are present
elem = page.get_by_placeholder('Item description').first
```

### 3. Add Proper Wait Conditions

**Wait for dialog to be visible:**
```python
# Wait for dialog to appear
await page.wait_for_selector('[role="dialog"]', state='visible', timeout=10000)
await page.wait_for_selector('[data-testid="estimate-title-input"]', state='visible', timeout=5000)
```

**Wait for form to be ready:**
```python
# Wait for form fields to be enabled
await page.wait_for_selector('[data-testid="estimate-title-input"]', state='visible')
await expect(page.get_by_test_id('estimate-title-input')).to_be_enabled()
```

**Wait for dynamic content:**
```python
# Wait for line items table to be rendered
await page.wait_for_selector('[data-testid="line-item-0-description"]', state='visible')
```

### 4. Handle Dialog Components Properly

```python
# Wait for dialog to open
await page.wait_for_selector('[role="dialog"]', state='visible')
await page.wait_for_load_state('networkidle')  # Wait for any async operations

# Interact with form inside dialog
await page.get_by_test_id('estimate-title-input').fill('Kitchen Plumbing Repair')
```

### 5. Handle Select Components (Radix UI)

Radix UI Select requires clicking the trigger, then selecting an option:

```python
# Click the select trigger
select_trigger = page.get_by_test_id('line-item-0-type-select')
await select_trigger.click()

# Wait for dropdown to appear
await page.wait_for_selector('[role="listbox"]', state='visible')

# Click the option
await page.get_by_role('option', name='Labor').click()

# Or use text-based selector
await page.get_by_text('Labor').click()
```

### 6. Handle Number Inputs

Number inputs may need special handling:

```python
# Clear first, then fill
quantity_input = page.get_by_test_id('line-item-0-quantity')
await quantity_input.clear()
await quantity_input.fill('2')

# Or use type with delay for number inputs
await quantity_input.type('2', delay=100)
```

### 7. Wait for Auto-calculation

After filling form fields, wait for total to update:

```python
# Fill form fields
await page.get_by_test_id('line-item-0-quantity').fill('2')
await page.get_by_test_id('line-item-0-unit-price').fill('150')

# Wait for total to update (check for expected value)
await expect(page.get_by_text('$300.00')).to_be_visible(timeout=5000)
# Or wait for total element to contain expected text
total_element = page.locator('[data-testid="estimate-total"]')  # If added
await expect(total_element).to_contain_text('300.00')
```

### 8. Better Test Flow Structure

```python
async def test_estimate_creation():
    # 1. Navigate and authenticate
    await page.goto('http://localhost:8085')
    # ... authentication steps ...
    
    # 2. Activate subscription
    await page.goto('http://localhost:8085/api/test/activate-subscription')
    await page.wait_for_load_state('networkidle')
    
    # 3. Navigate to dashboard
    await page.goto('http://localhost:8085/dashboard')
    await page.wait_for_load_state('networkidle')
    
    # 4. Click "New Estimate" button
    await page.get_by_role('button', name='New Estimate').click()
    
    # 5. Wait for dialog to be fully loaded
    await page.wait_for_selector('[role="dialog"]', state='visible')
    await page.wait_for_selector('[data-testid="estimate-title-input"]', state='visible')
    
    # 6. Fill form fields with proper waits
    await page.get_by_test_id('estimate-title-input').fill('Kitchen Plumbing Repair')
    await page.get_by_test_id('estimate-client-name-input').fill('John Doe')
    
    # 7. Fill first line item
    await page.get_by_test_id('line-item-0-description').fill('Pipe Installation')
    
    # Select type
    await page.get_by_test_id('line-item-0-type-select').click()
    await page.wait_for_selector('[role="listbox"]', state='visible')
    await page.get_by_role('option', name='Labor').click()
    
    # Fill quantity and price
    await page.get_by_test_id('line-item-0-quantity').clear()
    await page.get_by_test_id('line-item-0-quantity').fill('2')
    await page.get_by_test_id('line-item-0-unit-price').clear()
    await page.get_by_test_id('line-item-0-unit-price').fill('150')
    
    # 8. Add second line item
    await page.get_by_test_id('add-line-item-button').click()
    await page.wait_for_selector('[data-testid="line-item-1-description"]', state='visible')
    
    # Fill second line item
    await page.get_by_test_id('line-item-1-description').fill('PVC Pipe')
    await page.get_by_test_id('line-item-1-type-select').click()
    await page.wait_for_selector('[role="listbox"]', state='visible')
    await page.get_by_role('option', name='Material').click()
    await page.get_by_test_id('line-item-1-quantity').fill('10')
    await page.get_by_test_id('line-item-1-unit-price').fill('5')
    
    # 9. Verify total calculation
    await expect(page.get_by_text('$350.00')).to_be_visible(timeout=5000)
    
    # 10. Submit form
    await page.get_by_test_id('submit-estimate-button').click()
    
    # 11. Wait for success and verify
    await page.wait_for_selector('[role="dialog"]', state='hidden')  # Dialog closes
    await expect(page.get_by_text('Estimate created successfully')).to_be_visible()
```

## Implementation Priority

### High Priority (Immediate)
1. ✅ Add `data-testid` attributes to all form fields
2. ✅ Update test selectors to use test IDs instead of XPath
3. ✅ Add wait conditions for dialog visibility
4. ✅ Add wait conditions for form fields to be enabled

### Medium Priority (Next Sprint)
5. Add wait conditions for dynamic content (line items)
6. Improve Select component handling
7. Add wait conditions for auto-calculation updates
8. Add better error handling and retries

### Low Priority (Future)
9. Add visual regression testing
10. Add accessibility testing
11. Add performance testing
12. Add cross-browser testing

## Best Practices Summary

1. **Use test IDs** - Most stable selector strategy
2. **Wait explicitly** - Don't rely on fixed timeouts
3. **Wait for visibility** - Not just presence in DOM
4. **Wait for enabled state** - Ensure elements are interactive
5. **Use role-based selectors** - More semantic and stable
6. **Handle async operations** - Wait for network/idle states
7. **Test user flows** - Not just individual interactions
8. **Add retries** - For flaky operations
9. **Use page object model** - Better test organization
10. **Log interactions** - For debugging failures

## Example: Improved Test Selectors

```python
# BAD: Fragile XPath
elem = frame.locator('xpath=html/body/div[3]/form/div[2]/div[2]/div/table/tbody/tr/td[3]/input').nth(0)

# GOOD: Test ID
elem = page.get_by_test_id('line-item-0-quantity')

# ALSO GOOD: Role + text
elem = page.get_by_role('textbox', name='Quantity').first

# ALSO GOOD: Label-based
elem = page.get_by_label('Quantity').first
```

## Next Steps

1. Update `EstimateForm.tsx` to add test IDs
2. Update test plan with improved selectors
3. Add wait conditions to test steps
4. Re-run tests to verify improvements
5. Document any remaining issues
