# Task #10 Testing Action Plan

## Current Status

**Test Status:** FAILED ❌  
**Last Run:** 2026-01-05 16:21:41  
**Main Issue:** Form closes unexpectedly during test execution

## Root Cause Analysis

### Issue 1: TestSprite Not Using Test IDs ⚠️ CRITICAL
**Problem:** Despite adding test IDs to components and providing instructions, TestSprite's AI code generator is still creating XPath-based selectors:
- Using: `xpath=html/body/div[3]/form/div/div/div/input`
- Should use: `page.get_by_test_id('estimate-title-input')`

**Why:** TestSprite's AI code generation doesn't reliably follow instructions about selector strategies. The test plan steps are too high-level.

**Impact:** HIGH - Tests are fragile and break with any DOM changes

### Issue 2: Form Closing Unexpectedly ⚠️ CRITICAL  
**Problem:** Test error states: "attempts to fully fill the form and add multiple line items caused the form to close unexpectedly"

**Possible Causes:**
1. Dialog component auto-closing on outside click
2. Form validation errors causing dialog to close
3. Missing wait conditions - interacting before form is ready
4. React state updates causing re-renders that close dialog

**Impact:** HIGH - Cannot complete test flow

### Issue 3: Missing Wait Conditions ⚠️ HIGH
**Problem:** Tests don't wait for:
- Dialog to be fully visible
- Form fields to be enabled
- Select dropdowns to appear
- Total calculation to update

**Impact:** MEDIUM - Causes timing-related failures

## Solutions

### Solution 1: Update Test Plan with Explicit Test ID Instructions ✅ RECOMMENDED

**Action:** Modify test plan steps to explicitly reference test IDs in the descriptions

**File:** `testsprite_tests/testsprite_frontend_test_plan.json`

**Changes Needed:**
- Update step descriptions to include exact test IDs to use
- Add explicit wait instructions
- Break down complex steps into smaller, more specific actions

### Solution 2: Create Manual Test Script ✅ ALTERNATIVE

**Action:** Create a manual Playwright test script that uses test IDs correctly

**File:** `testsprite_tests/TC004_manual_test.py`

**Benefits:**
- Full control over selectors and wait conditions
- Can debug and iterate quickly
- Can be used as reference for TestSprite

### Solution 3: Fix Dialog Closing Issue ✅ REQUIRED

**Action:** Investigate and fix why dialog closes unexpectedly

**Check:**
1. Dialog `onOpenChange` handler - might be triggered incorrectly
2. Form validation - might be closing dialog on errors
3. Click outside handler - might be too sensitive
4. React state updates - might be resetting dialog state

**File:** `src/components/dashboard/EstimateForm.tsx`

### Solution 4: Add More Robust Wait Conditions ✅ REQUIRED

**Action:** Ensure dialog and form are fully ready before interactions

**Add:**
- Wait for dialog role="dialog" to be visible
- Wait for form fields to be enabled
- Wait for line items table to render
- Wait for total calculation after each change

## Immediate Actions (Priority Order)

### 1. Fix Dialog Closing Issue 🔴 CRITICAL
**Time:** 30 minutes  
**Owner:** Developer  
**Steps:**
1. Review `EstimateForm.tsx` dialog handling
2. Check if `onOpenChange` is being called unexpectedly
3. Add logging to track when/why dialog closes
4. Test manually to reproduce issue
5. Fix root cause

### 2. Update Test Plan with Explicit Test IDs 🟡 HIGH
**Time:** 15 minutes  
**Owner:** QA/Developer  
**Steps:**
1. Update TC004 test steps to explicitly mention test IDs
2. Add wait condition instructions
3. Break down complex steps
4. Re-run TestSprite

### 3. Create Manual Test Script 🟡 HIGH  
**Time:** 30 minutes  
**Owner:** Developer  
**Steps:**
1. Create `TC004_manual_test.py` using test IDs
2. Add proper wait conditions
3. Test manually to verify it works
4. Use as reference for TestSprite

### 4. Add Debug Logging 🟢 MEDIUM
**Time:** 15 minutes  
**Owner:** Developer  
**Steps:**
1. Add console.log to dialog open/close
2. Add logging to form field interactions
3. Add logging to form submission
4. Helps debug test failures

## Detailed Test Plan Update

### Current Step (Too Vague):
```json
{
  "type": "action",
  "description": "Fill estimate form: title 'Kitchen Plumbing Repair', client name 'John Doe', client phone '555-1234', client address '123 Main St'. Add line items: Labor item 'Pipe Installation' quantity 2, unit price 150, type 'labor'; Material item 'PVC Pipe' quantity 10, unit price 5, type 'material'"
}
```

### Updated Step (Explicit):
```json
{
  "type": "action",
  "description": "Wait for dialog with role='dialog' to be visible. Wait for element with data-testid='estimate-title-input' to be enabled. Fill estimate-title-input with 'Kitchen Plumbing Repair'. Fill estimate-client-name-input with 'John Doe'. Fill estimate-client-phone-input with '555-1234'. Fill estimate-client-address-input with '123 Main St'. Wait for line-item-0-description to be visible. Fill line-item-0-description with 'Pipe Installation'. Click line-item-0-type-select, wait for role='listbox' to appear, click option 'Labor'. Clear and fill line-item-0-quantity with '2'. Clear and fill line-item-0-unit-price with '150'. Click add-line-item-button. Wait for line-item-1-description to be visible. Fill line-item-1-description with 'PVC Pipe'. Click line-item-1-type-select, wait for role='listbox' to appear, click option 'Material'. Clear and fill line-item-1-quantity with '10'. Clear and fill line-item-1-unit-price with '5'. Wait for estimate-total to contain text '350.00'."
}
```

## Expected Outcomes

After implementing these solutions:

1. ✅ Dialog stays open during form filling
2. ✅ Tests use stable test ID selectors
3. ✅ Proper wait conditions prevent timing issues
4. ✅ Test completes full CRUD cycle
5. ✅ Auto-calculation verified correctly

## Success Criteria

- [ ] Dialog remains open throughout form filling
- [ ] All form fields can be filled successfully
- [ ] Multiple line items can be added
- [ ] Total calculation updates correctly
- [ ] Estimate can be created, edited, and deleted
- [ ] Test passes consistently (3+ runs)

## Timeline

- **Immediate (Today):** Fix dialog closing issue
- **Today:** Update test plan with explicit instructions
- **Today:** Create manual test script
- **Tomorrow:** Re-run tests and verify fixes

## Notes

- TestSprite AI generation is not reliable for selector strategies
- Manual test script can serve as reference implementation
- Dialog closing issue is blocking all progress
- Test IDs are in place and ready to use
