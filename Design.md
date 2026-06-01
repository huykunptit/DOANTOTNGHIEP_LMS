# LMS Frontend Design Prompt for Google Stitch

Use this prompt to generate the initial UI design for the LMS frontend. The goal is to create a cohesive, modern, and implementation-ready design system before building the app in Next.js.

---

## Google Stitch Prompt

```text
Design a modern LMS web application UI for a university education platform.

The product supports 4 main roles:
1. Public visitor
2. Student
3. Instructor
4. Admin

Design style:
- Clean, modern, professional, premium education platform
- Responsive desktop-first layout with mobile support
- Strong visual hierarchy
- Light theme with optional dark mode
- Use cards, tabs, tables, sidebar navigation, top bar, and clear CTA buttons
- Avoid clutter
- Use consistent spacing, typography, and iconography

Core screens to design:

Public screens:
- Home / Landing page
- Course catalog
- Course detail page
- Instructor profile page
- FAQ / Help center

Auth screens:
- Login
- Register
- Forgot password
- Reset password
- Verify email

Student screens:
- Student dashboard
- My courses
- Course learning page
- Lesson page
- Course progress
- Certificates
- Orders / purchase history
- Profile / settings
- Notifications
- Transcript
- Exam list
- Exam taking page
- Exam result page

Instructor screens:
- Instructor dashboard
- Course management
- Create / edit course
- Curriculum builder
- Lesson editor
- Quiz / exam builder
- Student list
- Gradebook
- Reviews and Q&A management

Admin screens:
- Admin dashboard
- User management
- Role / permission management
- Course approval management
- Academic management
- Curriculum management
- Enrollment management
- Grade management
- Certificate management
- Exam monitoring
- Payment management
- Reports / analytics

System screens:
- 403 Forbidden
- 404 Not Found
- 500 Error
- Empty state
- Loading state
- Access denied

Layout requirements:
- Public pages use a top navigation bar and footer
- Student/Instructor/Admin pages use a left sidebar + top bar layout
- Admin pages should feel data-rich and enterprise-grade
- Student pages should feel friendly and easy to use
- Instructor pages should emphasize content management
- Include tables, filters, search, stat cards, charts, tabs, modals, and form screens where appropriate

Important UI components:
- Sidebar navigation
- Top header with search and notifications
- Course card
- Lesson list
- Progress bar
- Stats cards
- Data table
- Filter panel
- Form sections
- Tabs
- Breadcrumbs
- Empty states
- Toast notifications

Please generate a cohesive design system and full screen set that can be used as the basis for implementation in Next.js and Tailwind CSS.
```

---

## Screen inventory

### 1) Public / Marketing screens
- Home / Landing page
- Course catalog
- Course category listing
- Course detail page
- Instructor profile page
- About us
- Contact us
- FAQ / Help center
- Pricing / Plan page if needed
- Terms of service
- Privacy policy

### 2) Auth screens
- Login
- Register
- Forgot password
- Reset password
- Verify email
- Logout confirmation or session expired screen

### 3) Student screens
- Student dashboard
- My courses
- Course learning page
- Lesson view
- Course progress page
- Certificates page
- Orders / purchase history
- Profile page
- Settings page
- Notifications center
- Transcript / academic record
- Exam list
- Exam taking page
- Exam result page
- Career / recommendation page

### 4) Instructor screens
- Instructor dashboard
- My courses management
- Create/edit course
- Course curriculum builder
- Lesson editor
- Quiz/exam builder
- Assignment management
- Student list in course
- Gradebook
- Reviews and Q&A management
- Notifications
- Profile/settings

### 5) Admin screens
- Admin dashboard
- User management
- Role & permission management
- Course approval management
- Academic overview dashboard
- Academic years management
- Terms management
- Programs management
- Specializations management
- Majors management
- Cohorts management
- Administrative classes management
- Class sections management
- Curriculum management
- Enrollment management
- Grade management
- Certificate management
- Exam monitoring
- Payment management
- Notifications management
- Reports / analytics

### 6) System / Utility screens
- 403 Forbidden
- 404 Not Found
- 500 Error
- Loading / skeleton states
- Empty states
- Access denied
- Maintenance page
- Success / confirmation modal states

---

## Recommended screen priority

### Phase 1 — must design first
- Home / Landing
- Login
- Register
- Forgot password
- Student dashboard
- Course catalog
- Course detail
- Course learning page
- Admin dashboard
- Instructor dashboard

### Phase 2 — next
- My courses
- Curriculum builder
- Lesson editor
- Quiz / exam pages
- Profile / settings
- Notifications
- User management
- Course management
- Academic management

### Phase 3 — later
- Transcript
- Certificates
- Reports
- Payment screens
- Career recommendation
- Exam monitoring
- System error pages

---

## Suggested app structure for design

Organize the design into these UI groups:
- Public
- Auth
- Student
- Instructor
- Admin
- System

Not use gradient color to design, use color mix on white, Dark Blue (Text): ~ #2B3990 (Deep Indigo/Navy)

Light Blue (Star Icon): ~ #00AEEF (Bright Cyan/Sky Blue)

