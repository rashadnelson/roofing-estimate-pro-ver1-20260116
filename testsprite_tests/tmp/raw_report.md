
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** plumbpro-estimate-ver1-20260104
- **Date:** 2026-01-13
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Landing page loads correctly
- **Test Code:** [TC001_Landing_page_loads_correctly.py](./TC001_Landing_page_loads_correctly.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/e518f0f9-22ff-4982-ab29-794769ec8bef
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Signup with Free plan flow
- **Test Code:** [TC002_Signup_with_Free_plan_flow.py](./TC002_Signup_with_Free_plan_flow.py)
- **Test Error:** Signup form submission fails repeatedly with no option to select Free plan or any subscription plan. Unable to verify that a new user can signup with the Free plan or that the Free tier subscription is assigned. Stopping further testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-up/email:0:0)
[ERROR] Signup error: {code: INVALID_ORIGIN, message: Invalid origin, status: 403, statusText: Forbidden} (at http://localhost:8086/src/pages/Signup.tsx:99:28)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/1e5b2112-f4e4-4f27-971d-68774a6a3447
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Signup with Paid plan flow (Monthly)
- **Test Code:** [TC003_Signup_with_Paid_plan_flow_Monthly.py](./TC003_Signup_with_Paid_plan_flow_Monthly.py)
- **Test Error:** Signup form submission failed, preventing further progress in signup and payment process. Reported the issue and stopped the task.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-up/email:0:0)
[ERROR] Signup error: {code: INVALID_ORIGIN, message: Invalid origin, status: 403, statusText: Forbidden} (at http://localhost:8086/src/pages/Signup.tsx:99:28)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/65950f1e-f229-4424-b769-b428601a82c7
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Login with correct credentials
- **Test Code:** [TC004_Login_with_correct_credentials.py](./TC004_Login_with_correct_credentials.py)
- **Test Error:** Login test with valid credentials failed. The login page resets without error or navigation to dashboard. Reporting this issue and stopping further testing as login is not successful.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/cd7bce35-f7e3-4b1f-b8ba-e25644f1200d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Login with incorrect credentials
- **Test Code:** [TC005_Login_with_incorrect_credentials.py](./TC005_Login_with_incorrect_credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/dc53d141-09bc-4a15-9a00-684c6aca4b87
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Forgot password flow
- **Test Code:** [TC006_Forgot_password_flow.py](./TC006_Forgot_password_flow.py)
- **Test Error:** Password reset functionality is broken. After submitting new password and confirmation, the page does not proceed or show confirmation. Unable to verify password reset success or login with new password. Stopping test.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/request-password-reset:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3001/api/test/emails?email=rashadnelson+ppetest1@gmail.com:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:8086/api/auth/reset-password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/b97ad278-25ee-4800-a8f6-4e365cbc6711
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Dashboard Quick Estimate Builder calculates estimates accurately
- **Test Code:** [TC007_Dashboard_Quick_Estimate_Builder_calculates_estimates_accurately.py](./TC007_Dashboard_Quick_Estimate_Builder_calculates_estimates_accurately.py)
- **Test Error:** The test to verify the estimate builder inputs for equipment, materials, labor, discount, and total estimates could not be completed due to repeated login failures with the provided test credentials. The login attempts resulted in 'Invalid email or password' and 'Invalid origin' errors, blocking access to the dashboard and estimate builder inputs. The issue has been reported. Please resolve the login issue to enable further testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] WebSocket connection to 'ws://localhost:8086/?token=FpS3Q93L5z46' failed: Error in connection establishment: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/@vite/client:535:0)
[ERROR] WebSocket connection to 'ws://localhost:8085/?token=FpS3Q93L5z46' failed: Error during WebSocket handshake: Unexpected response code: 400 (at http://localhost:8086/@vite/client:535:0)
[ERROR] [vite] failed to connect to websocket.
your current setup:
  (browser) localhost:8086/ <--[HTTP]--> localhost:8085/ (server)
  (browser) localhost:8086/ <--[WebSocket (failing)]--> localhost:8085/ (server)
Check out your Vite / network configuration and https://vite.dev/config/server-options.html#server-hmr . (at http://localhost:8086/@vite/client:511:16)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/6a5fab74-d34f-4772-8ea6-cf70054a63df
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Copy to clipboard functionality
- **Test Code:** [null](./null)
- **Test Error:** Test execution timed out after 15 minutes
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/c719cb7a-7038-4009-a0d2-b1536a032c12
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 PDF export for Free tier user includes watermark
- **Test Code:** [TC009_PDF_export_for_Free_tier_user_includes_watermark.py](./TC009_PDF_export_for_Free_tier_user_includes_watermark.py)
- **Test Error:** Stopped testing due to inability to login as Free tier user and malfunctioning password reset feature. Cannot proceed with verifying PDF export with watermark branding without successful login.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/request-password-reset:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/5326d83b-4f9b-4500-a680-f3fcc7746ad5
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 PDF export for Paid tier user includes professional branding
- **Test Code:** [TC010_PDF_export_for_Paid_tier_user_includes_professional_branding.py](./TC010_PDF_export_for_Paid_tier_user_includes_professional_branding.py)
- **Test Error:** Login attempts for both Monthly and Annual subscribers failed due to invalid credentials or origin errors. Unable to proceed with PDF export tests. Please verify test credentials and origin settings to enable login and continue testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/435724f9-2d74-430e-a020-ab7a142b963a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Free tier estimate usage limits enforced
- **Test Code:** [TC011_Free_tier_estimate_usage_limits_enforced.py](./TC011_Free_tier_estimate_usage_limits_enforced.py)
- **Test Error:** The test to verify Free users are limited to creating 3 estimates per month could not be completed because the provided login credentials for the Free tier user are invalid. Multiple login attempts failed with 'Invalid email or password' errors. The issue has been reported. Please provide valid credentials to continue testing.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/src/App.tsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/src/index.css:0:0)
[ERROR] WebSocket connection to 'ws://localhost:8086/?token=FpS3Q93L5z46' failed: Error in connection establishment: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/@vite/client:535:0)
[ERROR] WebSocket connection to 'ws://localhost:8085/?token=FpS3Q93L5z46' failed: Error during WebSocket handshake: Unexpected response code: 400 (at http://localhost:8086/@vite/client:535:0)
[ERROR] [vite] failed to connect to websocket.
your current setup:
  (browser) localhost:8086/ <--[HTTP]--> localhost:8085/ (server)
  (browser) localhost:8086/ <--[WebSocket (failing)]--> localhost:8085/ (server)
Check out your Vite / network configuration and https://vite.dev/config/server-options.html#server-hmr . (at http://localhost:8086/@vite/client:511:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/581d7b83-3e14-4a74-a5fe-5803fe9d7cc5
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Saved estimate templates accessible to Monthly and Annual subscribers only
- **Test Code:** [TC012_Saved_estimate_templates_accessible_to_Monthly_and_Annual_subscribers_only.py](./TC012_Saved_estimate_templates_accessible_to_Monthly_and_Annual_subscribers_only.py)
- **Test Error:** Reported login failure issue for Free tier user preventing further testing of subscription feature restrictions. Stopping all actions as task cannot proceed without successful login.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/src/index.css:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/f579790a-2db3-424a-a922-07326f60b544
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 User settings update company name and upload logo
- **Test Code:** [TC013_User_settings_update_company_name_and_upload_logo.py](./TC013_User_settings_update_company_name_and_upload_logo.py)
- **Test Error:** Unable to complete the task as login attempts failed due to 'Invalid email or password' and 'Invalid origin' errors despite using the provided test credentials. Therefore, I could not access the user settings page to verify updating company name, uploading logo file, and persistence of changes for branding on PDFs. The login issue has been reported.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/2a03b857-ebff-4d03-bb05-f12735eedba8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Stripe webhook updates subscription status and triggers email
- **Test Code:** [TC014_Stripe_webhook_updates_subscription_status_and_triggers_email.py](./TC014_Stripe_webhook_updates_subscription_status_and_triggers_email.py)
- **Test Error:** Unable to simulate Stripe webhook event via backend API or frontend login due to missing endpoint and login failures. Recommend using Stripe CLI or Stripe dashboard to manually send a test webhook event for subscription payment succeeded to the backend webhook URL. Then verify the user's subscription status is updated to active in the system and confirm that a subscription confirmation email is sent via Resend. Task cannot be completed automatically due to environment limitations.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/@react-refresh:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3001/api/test/stripe-webhook-simulate:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3001/api/test/stripe-webhook-simulate:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/cd250607-3059-457f-8e15-a153c5262242
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Password reset email triggers appropriately and reset succeeds
- **Test Code:** [TC015_Password_reset_email_triggers_appropriately_and_reset_succeeds.py](./TC015_Password_reset_email_triggers_appropriately_and_reset_succeeds.py)
- **Test Error:** Password reset form submission failed to process. Password reset email request succeeded but reset link usage and password update could not be verified due to form submission issue. Testing stopped.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/src/index.css:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/node_modules/.vite/deps/react-helmet-async.js?v=f48c0aa5:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/src/App.tsx:0:0)
[ERROR] WebSocket connection to 'ws://localhost:8086/?token=FpS3Q93L5z46' failed: Error in connection establishment: net::ERR_EMPTY_RESPONSE (at http://localhost:8086/@vite/client:535:0)
[ERROR] WebSocket connection to 'ws://localhost:8085/?token=FpS3Q93L5z46' failed: Error during WebSocket handshake: Unexpected response code: 400 (at http://localhost:8086/@vite/client:535:0)
[ERROR] [vite] failed to connect to websocket.
your current setup:
  (browser) localhost:8086/ <--[HTTP]--> localhost:8085/ (server)
  (browser) localhost:8086/ <--[WebSocket (failing)]--> localhost:8085/ (server)
Check out your Vite / network configuration and https://vite.dev/config/server-options.html#server-hmr . (at http://localhost:8086/@vite/client:511:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/request-password-reset:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3001/api/test/emails?email=rashadnelson+ppetest1@gmail.com:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:8086/api/auth/reset-password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/091e9429-bc4d-4379-8512-b93cabfdcf66
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Dashboard responsiveness and accessibility
- **Test Code:** [TC016_Dashboard_responsiveness_and_accessibility.py](./TC016_Dashboard_responsiveness_and_accessibility.py)
- **Test Error:** Login failure prevents access to dashboard components for responsiveness and accessibility testing. Reported the issue and stopped further actions.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/eb73dbea-7d15-4b1c-b150-7679b3d2a9ac
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Estimate data is not stored server-side
- **Test Code:** [TC017_Estimate_data_is_not_stored_server_side.py](./TC017_Estimate_data_is_not_stored_server_side.py)
- **Test Error:** Sign-up form is unresponsive and does not allow account creation, preventing further testing of estimate data handling. Reporting this issue and stopping the task.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-in/email:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 403 (Forbidden) (at http://localhost:8086/api/auth/sign-up/email:0:0)
[ERROR] Signup error: {code: INVALID_ORIGIN, message: Invalid origin, status: 403, statusText: Forbidden} (at http://localhost:8086/src/pages/Signup.tsx:99:28)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:8086/node_modules/.vite/deps/react-router-dom.js?v=f48c0aa5:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/d5a997e9-2b79-4418-8c48-2a405c5ce640
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Pricing page displays correct tier comparison and Stripe payment links
- **Test Code:** [TC018_Pricing_page_displays_correct_tier_comparison_and_Stripe_payment_links.py](./TC018_Pricing_page_displays_correct_tier_comparison_and_Stripe_payment_links.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/7b711119-48f9-43f4-97c5-39a1905b4a26/704b3088-a319-44b8-9814-93b5e2cad96e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **16.67** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---