# Sprint 3 Outline - UniSee

**Duration:** November 5th - November 23rd, 2025  
**Theme:** "Security, Polish & Advanced Features"  
⚠️ **FINAL SPRINT** - This is the last development sprint before the project deadline!

## Current State Assessment

### ✅ Completed (Sprints 1 & 2):
- Full authentication system with .edu email verification
- School browsing and search with College Scorecard API integration
- Complete review CRUD system (create, read, update, delete)
- Review filtering and sorting (by date, rating, tags)
- .edu email verification with badge system
- School caching in database
- User profile pages
- Environment variables for API keys
- Basic error handling

---

## Sprint 3 Objectives

### PRIMARY GOAL
Complete all essential features, enhance security, polish UI/UX, and deliver a production-ready platform for the final demo. **This sprint must prioritize must-have features over nice-to-haves.**

---

## Task Breakdown

### ESSENTIAL TASKS (Must Complete)

#### 1) Enhanced Security & Input Validation
**Difficulty:** Medium | **Priority:** Essential

**Tasks:**
- Add server-side input validation for all review submissions
- Sanitize user input to prevent XSS attacks
- Implement rate limiting for review submissions (prevent spam)
- Secure API endpoints with auth checks (verify user is logged in before allowing create/update/delete)

**Deliverable:** Production-grade security implementation

**Note:** Currently anyone can call our API endpoints - we need to verify the user's session/auth token before allowing modifications.

---

#### 2) Advanced Filtering & School Data Enhancement
**Difficulty:** Hard | **Priority:** Essential

**Tasks:**
- Implement filtering by state
- Add major/program filtering for reviews
- Search reviews by keyword/title
- Add school-wide statistics dashboard (average ratings)
- Display programs organized by degree level (undergrad/grad/phd) from DOE API
- Add tuition/aid breakdown with visualizations (pie charts, bar graphs using Chart.js)
- Implement pagination for review lists

**Deliverable:** Comprehensive search, filter, and data visualization system

**Note:** Leverage College Scorecard API's program breakdown and financial aid data for rich visual displays

---

#### 3) User Experience Enhancements & UI Polish
**Difficulty:** Easy | **Priority:** Essential

**Tasks:**
- Add success/error feedback for all user actions
- Improve mobile responsiveness across all pages
- Add smooth transitions and hover effects
- Fix any layout issues or styling inconsistencies
- Ensure all pages have consistent header/footer
- Add empty states for lists (no reviews, no schools, etc.)

**Deliverable:** Polished, professional UX ready for demo

---

### IMPORTANT TASKS (Should Complete if Time Permits)

#### 4) School Statistics Dashboard
**Difficulty:** Medium | **Priority:** Important

**Tasks:**
- Display school-wide average ratings by category (academics, social, food, housing, career)
- Show total review count
- Calculate and display overall school rating
- Add visual charts/graphs for rating breakdown

**Deliverable:** Data-driven insights at a glance

---

#### 5) "My Reviews" User Dashboard
**Difficulty:** Easy | **Priority:** Important

**Tasks:**
- Create a new page to display all reviews by the logged-in user
- Add quick edit/delete actions
- Show review stats (total reviews written)
- Link from account page

**Deliverable:** User review management hub

---

#### 6) School Comparison Feature
**Difficulty:** Medium | **Priority:** Important

**Tasks:**
- Build side-by-side school comparison view
- Compare key metrics: tuition, aid, admission rates, SAT/ACT scores
- Display comparative ratings (academics, social, food, housing, career)
- Add "Select Schools to Compare" interface

**Deliverable:** Easy-to-use school comparison tool

**Note:** Combines College Scorecard API data with review ratings for comprehensive comparison

---

### NICE-TO-HAVE TASKS (Only if essentials are done)

#### 7) Additional Polish
**Difficulty:** Easy | **Priority:** Nice-to-have

**Tasks:**
- Implement review pagination (load more button)
- Cleanest UI possible

**Deliverable:** Extra polish for final demo

---

**Note:** If running out of time, focus on making the essential features bug-free and polished rather than adding new features.

---

## Success Metrics

### Technical Metrics:
- ✅ All essential tasks completed
- ✅ Zero critical security vulnerabilities
- ✅ < 3s load time for all pages
- ✅ Accurate mobile responsiveness
- ✅ No broken features from previous sprints

### User Experience Metrics:
- ✅ Intuitive filtering and search
- ✅ Error states handled gracefully
- ✅ Professional, polished UI
- ✅ Review submission rate > 90% success
- ✅ All user actions have clear feedback

---

## Notes

⚠️ **CRITICAL:** This Sprint 3 plan builds on Sprints 1 & 2
- **Must complete:** All 3 essential tasks (Security, UI Polish, Enhanced Data Display)
- **Should complete:** School Statistics Dashboard, School Comparison Feature
- **Nice-to-have:** Additional features only if essentials are perfect
- **New additions:** Leverage College Scorecard API for programs, tuition/aid visualizations, and school comparisons
- Focus on polish over new features
- Test thoroughly before final submission
- Individual Report due Nov 23rd (same day as Sprint 3 Results)

