# TestSprite Test Plan Updates

## Summary
Updated TestSprite frontend test plans to use unique email generation and proper test user management to prevent authentication failures.

## Changes Made

### 1. Updated Test Plan File: `testsprite_frontend_test_plan.json`

#### TC001 - User Signup and Subscription Flow
- ✅ Added unique email generation instruction: `test-{timestamp}@example.com`
- ✅ Added fallback logic: If signup fails with 422 (user exists), proceed to login
- ✅ Added step to call `/api/test/activate-subscription` after authentication
- ✅ Updated description with IMPORTANT note about unique emails

#### TC002 - Authentication with Valid/Invalid Credentials
- ✅ Added unique email generation: `test-auth-{timestamp}@example.com`
- ✅ Added signup attempt before login test
- ✅ Added subscription activation step after successful login
- ✅ Improved test flow to handle existing users

#### TC003 - Protected API Routes Access Control
- ✅ Added unique email generation: `test-protected-{timestamp}@example.com`
- ✅ Added explicit steps for user creation and subscription activation
- ✅ Updated to test `/api/estimates` endpoint specifically
- ✅ Added verification of 403 Forbidden for unsubscribed users

#### TC004 - Estimate Builder CRUD Operations (Task #10)
- ✅ Added unique email generation: `test-estimate-{timestamp}@example.com`
- ✅ Added subscription activation step
- ✅ Added detailed steps for dashboard navigation
- ✅ Added specific test data: estimate title, client info, line items with exact values
- ✅ Added verification of auto-calculation: (2 * 150) + (10 * 5) = 350.00
- ✅ Added steps for update operation with new line item
- ✅ Added verification of updated total: 425.00

#### TC005 - PDF Export with Branding
- ✅ Added unique email generation: `test-pdf-{timestamp}@example.com`
- ✅ Added subscription activation step
- ✅ Added specific test data for estimate creation
- ✅ Added verification of PDF download and content

#### TC007 - Session Middleware Integration
- ✅ Added unique email generation: `test-session-{timestamp}@example.com`
- ✅ Added subscription activation step
- ✅ Updated to test `/api/protected` endpoint
- ✅ Added verification of user data in response

#### TC009 - Error Handling
- ✅ Added unique email generation: `test-error-{timestamp}@example.com`
- ✅ Added test for invalid login credentials
- ✅ Added test for expired session handling
- ✅ Added test for form validation errors
- ✅ Improved error message verification

### 2. Updated Config File: `testsprite_tests/tmp/config.json`

#### Changes:
- ✅ Removed hardcoded credentials (`loginUser` and `loginPassword` set to empty strings)
- ✅ Added comprehensive instructions in `additionalInstruction`:
  - Unique email generation pattern: `test-{testId}-{timestamp}@example.com`
  - Fallback logic for existing users (signup → login)
  - Mandatory subscription activation step
  - Standard test password: `TestPass123`
  - Focus on Task #10 features

## Key Improvements

### 1. Unique Email Generation
**Pattern**: `test-{testId}-{timestamp}@example.com`
- Example: `test-TC001-1736089200000@example.com`
- Ensures no duplicate user conflicts
- Each test gets unique credentials

### 2. User Management Strategy
**Approach**: Try signup first, fallback to login
- Attempt signup with unique email
- If 422 error (user exists), proceed to login
- This handles both new and existing test users gracefully

### 3. Subscription Activation
**Required Step**: Call `/api/test/activate-subscription` after authentication
- Bypasses Stripe payment requirement for testing
- Allows access to protected routes
- Must be called before testing dashboard/estimate features

### 4. Standardized Test Data
- **Password**: `TestPass123` (meets all requirements)
- **Company Names**: Test-specific (e.g., "Test Plumbing Co", "Estimate Test Co")
- **Test Estimates**: Specific data with exact values for verification

## Test Execution Flow

### Standard Flow for Protected Route Tests:
1. Generate unique email: `test-{testId}-{timestamp}@example.com`
2. Attempt signup with email, company name, password `TestPass123`
3. If signup fails with 422, proceed to login with same credentials
4. After successful authentication, call `POST /api/test/activate-subscription`
5. Verify subscription is active
6. Proceed with test-specific steps

### Example Test Sequence (TC004):
```
1. Generate email: test-estimate-1736089200000@example.com
2. Signup: email, "Estimate Test Co", "TestPass123"
3. If 422 → Login instead
4. POST /api/test/activate-subscription
5. Navigate to /dashboard
6. Click "New Estimate"
7. Fill form with test data
8. Verify auto-calculation: 350.00
9. Save estimate
10. Verify in list
11. Edit estimate
12. Add line item
13. Verify updated total: 425.00
14. Delete estimate
15. Verify removed
```

## Benefits

1. **No More Duplicate User Errors**: Unique emails prevent 422 errors
2. **Graceful Handling**: Tests work with both new and existing users
3. **Proper Subscription**: All protected route tests activate subscription
4. **Reproducible**: Standard test data ensures consistent results
5. **Task #10 Focus**: Detailed steps for dashboard and estimate management

## Latest Update: API Route Accessibility (2026-01-05)

### Issue Fixed
Previously, tests were failing because `/api/test/activate-subscription` endpoint was not accessible via browser navigation (`page.goto()`). React Router's catch-all route was intercepting API routes before the Vite proxy could forward them to the backend.

### Solution Implemented
- ✅ Added React Router route handler for `/api/*` paths
- ✅ Created `ApiRouteHandler` component that makes fetch requests (goes through Vite proxy)
- ✅ Endpoint now accessible via browser navigation (`page.goto()`)
- ✅ Automatic redirect to dashboard after successful subscription activation
- ✅ User-friendly success/error messages displayed

### Updated Test Instructions
All test steps that previously called `POST /api/test/activate-subscription` have been updated to:
- Navigate to `/api/test/activate-subscription` endpoint (accessible via `page.goto()`)
- The endpoint will automatically redirect to dashboard after successful activation
- Success message is displayed before redirect

### Technical Details
- React Router now has explicit route: `<Route path="/api/*" element={<ApiRouteHandler />} />`
- `ApiRouteHandler` component makes fetch request which goes through Vite proxy correctly
- Vite proxy forwards `/api/*` requests to backend server at `http://localhost:3001`
- Backend endpoint supports both GET and POST methods
- Endpoint requires authentication (`requireAuth` middleware)

## Next Steps

1. ✅ Test plans updated
2. ✅ API route accessibility fixed
3. ⏭️ Re-run TestSprite tests with updated plans
4. ⏭️ Verify all tests pass with new API route handling
5. ⏭️ Review test results and address any remaining issues

## Notes

- All test users use password: `TestPass123`
- Test helper endpoint `/api/test/activate-subscription` is only available in non-production environments
- Endpoint is now accessible via browser navigation (`page.goto()`) in addition to API calls
- Email format ensures uniqueness: `test-{testId}-{timestamp}@example.com`
- Tests handle both signup and login scenarios automatically
- API routes are handled by React Router and forwarded to backend via Vite proxy
