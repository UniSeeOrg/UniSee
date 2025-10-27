# Sprint 2 Outline - UniSee

**Duration:** October 20th - November 2nd, 2025 (2 weeks)  
**Theme:** "Core Review System & User Experience Enhancement"

## Current State Assessment

### ✅ Sprint 1 Successfully Completed:
- Deployed Next.js app on Vercel (https://unisee.vercel.app)
- Basic Supabase authentication (sign up/in/out)
- School browsing with external College Scorecard API
- Clean UI with responsive design
- Database schema foundation

### ⚠️ Gaps from Sprint 1:
- Review system schema exists but no UI implementation
- No .edu email verification yet
- Missing loading states and error handling
- API key hardcoded (security issue)
- No review display functionality

---

## Sprint 2 Objectives

### PRIMARY GOAL
Transform UniSee from a school browser into a functional review platform where students can write, read, and filter structured reviews.

### SUCCESS CRITERIA
1. **Students can write structured reviews** for schools they've attended
2. **Reviews display on school pages** with proper formatting and filtering
3. **Basic .edu email verification** for review authenticity
4. **Improved user experience** with loading states and error handling
5. **Security improvements** (environment variables, input validation)

---

## Task Breakdown

### ESSENTIAL TASKS (Must Complete)

#### 1) Review System Implementation 🔥 **HIGH PRIORITY**
**Difficulty:** Hard | **Priority:** Essential

**Tasks:**
- ✅ Create comprehensive review database schema (extend existing)
- ✅ Build review submission form with structured fields:
  - Overall rating (1-5 stars)
  - Academic quality, social life, food, housing, career support
  - Written review text
  - Context tags (in-state, out-of-state, transfer, etc.)
  - Major/program (optional)
- ✅ Implement review display on school detail pages
- ✅ Add review filtering and sorting options
- ✅ Create user review management (view/edit own reviews)

**Deliverable:** Functional review system with CRUD operations

---

#### 2) .edu Email Verification System 🔥 **HIGH PRIORITY**
**Difficulty:** Medium | **Priority:** Essential

**Tasks:**
- ✅ Implement .edu email domain validation
- ✅ Add verification badge system for users
- ✅ Restrict review writing to verified users only
- ✅ Create verification status display in user profiles
- ✅ Add email verification flow for new signups

**Deliverable:** Verified user system with .edu enforcement

---

#### 3) Database Schema Enhancement 🔥 **HIGH PRIORITY**
**Difficulty:** Medium | **Priority:** Essential

**Tasks:**
- ✅ Extend Prisma schema with proper review tables
- ✅ Add user profile fields (verification status, school attended)
- ✅ Create proper foreign key relationships
- ✅ Implement database migrations
- ✅ Seed sample review data for testing

**Deliverable:** Complete database schema supporting full review system

---

#### 4) Security & Environment Improvements 🔥 **HIGH PRIORITY**
**Difficulty:** Easy | **Priority:** Essential

**Tasks:**
- ✅ Move API keys to environment variables
- ✅ Add input validation and sanitization
- ✅ Implement proper error handling
- ✅ Add rate limiting for review submissions
- ✅ Secure API endpoints with authentication

**Deliverable:** Production-ready security implementation

---

### IMPORTANT TASKS (If Time Permits)

#### 5) Enhanced User Experience
**Difficulty:** Medium | **Priority:** Important

**Tasks:**
- ✅ Add loading states for all async operations
- ✅ Implement proper error pages (404, 500)
- ✅ Add success/error toast notifications
- ✅ Improve mobile responsiveness
- ✅ Add search result pagination

**Deliverable:** Polished, professional user experience

---

#### 6) Advanced Review Features
**Difficulty:** Medium | **Priority:** Important

**Tasks:**
- ✅ Review helpfulness voting system
- ✅ Review reporting and moderation
- ✅ Review statistics and analytics
- ✅ School comparison feature
- ✅ Favorite schools functionality

**Deliverable:** Advanced review platform features

---

### NICE-TO-HAVE TASKS

#### 7) UI/UX Polish
**Difficulty:** Easy | **Priority:** Nice-to-have

**Tasks:**
- ✅ Add animations and micro-interactions
- ✅ Implement dark mode toggle
- ✅ Add keyboard shortcuts
- ✅ Improve accessibility (ARIA labels, screen reader support)
- ✅ Add social sharing features

**Deliverable:** Premium user experience

---

## Technical Implementation Plan

### Week 1 Focus: Core Review System
- **Days 1-2:** Database schema design and migration
- **Days 3-4:** Review submission form and API endpoints
- **Days 5-7:** Review display and basic filtering

### Week 2 Focus: Verification & Polish
- **Days 8-9:** .edu verification system
- **Days 10-11:** Security improvements and error handling
- **Days 12-14:** UI polish and testing

---

## Risk Mitigation

### High-Risk Items:
1. **Review system complexity** - Start with MVP, iterate
2. **.edu verification** - May need fallback for testing
3. **Database performance** - Plan for indexing and optimization

### Contingency Plans:
- If review system takes longer, focus on core CRUD operations
- If .edu verification is complex, implement basic email validation first
- If advanced features are delayed, ensure basic functionality works perfectly

---

## Success Metrics

### Technical Metrics:
- ✅ All essential tasks completed
- ✅ Zero critical security vulnerabilities
- ✅ App performance < 3s load time
- ✅ Mobile responsiveness score > 90%

### User Experience Metrics:
- ✅ Users can successfully write and view reviews
- ✅ Review filtering works intuitively
- ✅ .edu verification process is clear
- ✅ Error states are handled gracefully

---

## Next Steps

1. **Immediate:** Set up Sprint 2 GitHub project board
2. **Day 1:** Begin database schema design
3. **Daily:** Standup meetings to track progress
4. **Week 1 End:** Mid-sprint review and adjustment
5. **Sprint End:** Demo and Sprint 3 planning

---

## Discussion Points

- **Priority order:** Do we agree on the essential task prioritization?
- **Scope adjustment:** Are there any tasks that should be moved between categories?
- **Technical decisions:** Any concerns about the implementation approach?
- **Timeline:** Does the 2-week timeline seem realistic for the scope?

This Sprint 2 plan builds directly on our successful Sprint 1 foundation and focuses on making UniSee a functional review platform. The emphasis is on core functionality first, with polish and advanced features as stretch goals.

