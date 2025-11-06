# Security Features Testing Guide

## 🎯 Quick Test Checklist

### ✅ Test 1: Authentication - Create Review Without Login
**Expected:** Should fail with authentication error

1. **Make sure you're logged out:**
   - Go to http://localhost:3000/account
   - Click "Sign Out" if you're logged in
   - Or clear your browser cookies/localStorage

2. **Try to create a review:**
   - Go to http://localhost:3000/schools
   - Search for any school (e.g., "Harvard")
   - Click on a school
   - Try to click "Write a Review" or fill out the review form
   - **Expected Result:** Should show "Please log in to write a review" message

3. **Test via Browser Console (Advanced):**
   ```javascript
   // Open DevTools (F12) → Console tab
   fetch('/api/reviews/create', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       title: 'Test Review',
       content: 'This should fail without auth',
       schoolId: '00000000-0000-0000-0000-000000000000'
     })
   })
   .then(r => r.json())
   .then(console.log);
   // Expected: { error: "Authentication required. Please log in to create a review." }
   ```

---

### ✅ Test 2: Authorization - Edit Someone Else's Review
**Expected:** Should fail with 403 Forbidden

1. **Create a review as User A:**
   - Log in with account A
   - Go to a school page
   - Create a review
   - Note the review ID or remember which review you created

2. **Try to edit as User B:**
   - Log out
   - Log in with a different account (or create a new account)
   - Go to the same school page
   - Find the review you created as User A
   - Try to click "Edit" on that review
   - **Expected Result:** Should show error "Unauthorized: You can only edit your own reviews"

3. **Test via Browser Console:**
   ```javascript
   // First, get your auth token (while logged in)
   const { data: { session } } = await supabase.auth.getSession();
   const token = session?.access_token;
   
   // Try to update someone else's review
   fetch('/api/reviews/update', {
     method: 'PUT',
     headers: { 
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     },
     body: JSON.stringify({
       id: '123456789', // Someone else's review ID
       title: 'Hacked Review'
     })
   })
   .then(r => r.json())
   .then(console.log);
   // Expected: { error: "Unauthorized: You can only edit your own reviews" }
   ```

---

### ✅ Test 3: Authorization - Delete Someone Else's Review
**Expected:** Should fail with 403 Forbidden

1. **Same setup as Test 2:**
   - Logged in as User B
   - Find User A's review
   - Try to click "Delete"
   - **Expected Result:** Should show error "Unauthorized: You can only delete your own reviews"

---

### ✅ Test 4: Input Validation - Invalid Data
**Expected:** Should reject invalid input with clear error messages

1. **Test Empty Title:**
   - Log in
   - Go to a school page
   - Try to create a review with:
     - Title: (empty)
     - Content: "This is a test review with enough content"
   - **Expected Result:** Error: "Title is required"

2. **Test Invalid Rating:**
   - Try to create a review with:
     - Title: "Test Review"
     - Content: "This is a test review"
     - Rating: 10 (invalid, should be 1-5)
   - **Expected Result:** Error: "Rating must be at most 5"

3. **Test Short Content:**
   - Try to create a review with:
     - Title: "Test"
     - Content: "Short" (less than 10 characters)
   - **Expected Result:** Error: "Review content must be at least 10 characters"

4. **Test via Browser Console:**
   ```javascript
   // Get your auth token first
   const { data: { session } } = await supabase.auth.getSession();
   const token = session?.access_token;
   
   // Try invalid data
   fetch('/api/reviews/create', {
     method: 'POST',
     headers: { 
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     },
     body: JSON.stringify({
       title: '', // Empty title
       content: 'Short', // Too short
       rating: 10, // Invalid rating
       schoolId: 'invalid-uuid' // Invalid UUID
     })
   })
   .then(r => r.json())
   .then(console.log);
   // Expected: Validation errors
   ```

---

### ✅ Test 5: XSS Protection - HTML/Script Injection
**Expected:** HTML tags should be stripped, only plain text saved

1. **Test HTML in Title:**
   - Log in
   - Create a review with:
     - Title: `<script>alert('XSS')</script>Test Review`
     - Content: "This is a test"
   - **Expected Result:** 
     - The review should be created
     - When displayed, it should show: "Test Review" (script tag removed)
     - No alert popup should appear

2. **Test HTML in Content:**
   - Create a review with:
     - Title: "Test"
     - Content: `<img src="x" onerror="alert('XSS')">Test content`
   - **Expected Result:** HTML tags stripped, only "Test content" displayed

3. **Test via Browser Console:**
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   const token = session?.access_token;
   
   fetch('/api/reviews/create', {
     method: 'POST',
     headers: { 
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     },
     body: JSON.stringify({
       title: '<script>alert("XSS")</script>Safe Title',
       content: '<img src=x onerror=alert(1)>Safe content here',
       schoolId: '00000000-0000-0000-0000-000000000000'
     })
   })
   .then(r => r.json())
   .then(data => {
     console.log('Created review:', data);
     // Check the database or refresh the page
     // The HTML should be stripped
   });
   ```

---

### ✅ Test 6: Rate Limiting - Too Many Reviews
**Expected:** Should limit to 5 reviews per hour

1. **Create 5 Reviews:**
   - Log in
   - Go to a school page (or multiple schools)
   - Create 5 reviews quickly
   - **Expected Result:** All 5 should succeed

2. **Try to Create 6th Review:**
   - Immediately try to create a 6th review
   - **Expected Result:** Error: "Rate limit exceeded. Maximum 5 reviews per hour. Please try again later."
   - Status code: 429

3. **Test via Browser Console:**
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   const token = session?.access_token;
   
   // Create 6 reviews in a loop
   for (let i = 1; i <= 6; i++) {
     const response = await fetch('/api/reviews/create', {
       method: 'POST',
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       },
       body: JSON.stringify({
         title: `Test Review ${i}`,
         content: 'This is test review number ' + i + ' with enough content to pass validation',
         schoolId: '00000000-0000-0000-0000-000000000000'
       })
     });
     const data = await response.json();
     console.log(`Review ${i}:`, response.status, data);
     // Review 6 should return 429 status
   }
   ```

---

### ✅ Test 7: End-to-End - Full Workflow
**Expected:** Everything should work smoothly when used correctly

1. **Register/Login:**
   - Go to http://localhost:3000/register
   - Create a new account with a .edu email
   - Or log in at http://localhost:3000/login

2. **Browse Schools:**
   - Go to http://localhost:3000/schools
   - Search for a school
   - Click on a school

3. **Create a Review:**
   - Click "Write a Review"
   - Fill out the form with valid data:
     - Title: "Great School!"
     - Content: "I really enjoyed my time here. The professors were excellent and the campus was beautiful."
     - Rating: 5
     - Academics: 5
     - Social: 4
     - Food: 3
     - Housing: 4
     - Career: 5
   - Submit
   - **Expected Result:** Review created successfully, appears in the list

4. **Edit Your Review:**
   - Find your review in the list
   - Click "Edit"
   - Change the title or content
   - Submit
   - **Expected Result:** Review updated successfully

5. **Delete Your Review:**
   - Find your review
   - Click "Delete"
   - Confirm
   - **Expected Result:** Review deleted, removed from list

---

## 🔍 How to Check Results

### Browser DevTools
1. **Open DevTools:** Press `F12` or `Cmd+Option+I` (Mac)
2. **Network Tab:** 
   - Watch API requests
   - Check status codes (401, 403, 429, etc.)
   - View response bodies for error messages
3. **Console Tab:**
   - See any JavaScript errors
   - Run the test scripts above

### Expected Status Codes
- **200:** Success
- **400:** Bad Request (validation error)
- **401:** Unauthorized (not logged in)
- **403:** Forbidden (not authorized to perform action)
- **429:** Too Many Requests (rate limited)
- **500:** Server Error (shouldn't happen)

---

## 🐛 Troubleshooting

### If authentication tests fail:
- Make sure you're actually logged out (clear cookies/localStorage)
- Check the Network tab to see the actual API response

### If rate limiting doesn't work:
- The rate limit is per user (by user ID)
- Try logging in with a different account
- Or wait 1 hour for the limit to reset

### If validation errors don't show:
- Check the browser console for errors
- Check the Network tab for the API response
- Make sure you're sending the request correctly

---

## 📝 Test Results Template

```
✅ Test 1: Authentication - PASSED/FAILED
✅ Test 2: Authorization (Edit) - PASSED/FAILED
✅ Test 3: Authorization (Delete) - PASSED/FAILED
✅ Test 4: Input Validation - PASSED/FAILED
✅ Test 5: XSS Protection - PASSED/FAILED
✅ Test 6: Rate Limiting - PASSED/FAILED
✅ Test 7: End-to-End - PASSED/FAILED
```

---

## 🎉 Success Criteria

All tests should pass for the security implementation to be considered complete:
- ✅ Unauthenticated users cannot create/update/delete reviews
- ✅ Users can only modify their own reviews
- ✅ Invalid input is rejected with clear error messages
- ✅ XSS attacks are prevented (HTML stripped)
- ✅ Rate limiting prevents spam (5 reviews/hour)
- ✅ Valid reviews can be created, edited, and deleted successfully

