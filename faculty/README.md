# Feature: Faculty Portal (GLA University Management System)

A web-based academic and attendance management module for faculty members at GLA University, Mathura. Built with responsive HTML5, modern CSS3, and interactive client-side JavaScript as part of the B.Tech CSE 3rd-year University Management System mini-project.

---

## 📁 Files Included

- **`dashboard.html`** — Central faculty dashboard featuring assigned course statistics, real-time timetable/lecture schedule, student enrollment breakdown, quick action shortcuts, and official academic circulars.
- **`attendance.html`** — Interactive student attendance register. Supports daily and lecture-slot marking, cumulative attendance tracking, live percentage updates, bulk status toggles (All Present / All Absent / Defaulter filters), remarks recording, and CSV export.
- **`results.html`** — Comprehensive examination & gradebook management system. Enables faculty to enter theory/internal marks, dynamically computes total scores, percentages, letter grades (O, A+, A, B+, B, C, F), and status (Pass/Fail) in real-time, displays class distribution analytics, and supports publishing to student portals and CSV export.
- **`faculty.css`** — Dedicated, modular stylesheet adhering to the GLA University design system (Navy `#0d3b66`, Royal Blue `#2563eb`, Gold `#f0a202`, and semantic status palettes) with responsive mobile drawer support and print-ready styles.
- **`logo.png`** — GLA University official emblem asset.

---

## 🚀 Key Capabilities & Features

### 1. Faculty Dashboard (`dashboard.html`)
- **Faculty Profile Card**: Displays faculty details (Mr. Yash Singh, Assistant Professor, Department of Computer Engineering & Applications, Cabin AB2-304).
- **Core Academic Metrics**: Assigned course count (4 courses / 14 credit hours), total enrolled students (248 students), today's scheduled lectures, and class average attendance rate (84.2%).
- **Interactive Daily Schedule**: Chronological listing of today's lectures and labs with room numbers, timings, current status badges (`Completed`, `Next Lecture`, `Upcoming`), and instant "Mark Attendance" triggers.
- **Course Syllabus & Attendance Trackers**: Visual progress bars showing syllabus completion and section attendance health.
- **Department Notices**: Official examination and circular notifications from the Dean of Academics and Examination Cell.

### 2. Attendance Tracking (`attendance.html`)
- **Multi-parameter Filtering**: Filter class rosters by Course (BCS-501, BCS-502, BCS-503, BCS-504), Section (3A, 3B, 3C), Date, and Lecture slot.
- **Student Roster**: Preloaded with B.Tech CSE 3rd-year student data, including university roll numbers (`2415000001`, `2415000028`, `2415000064`, `2415000089`, etc.).
- **Live Counter Recalculation**: Instant recalculation of Total, Present, Absent, Late/Excused counts, and class percentage whenever status radio buttons change.
- **Bulk Productivity Actions**:
  - *All Present*: Marks all displayed students present with one click.
  - *All Absent*: Marks all displayed students absent with one click.
  - *Defaulter Filter*: Instantly filters students with cumulative attendance below the mandatory 75% threshold.
- **Live Search**: Instant real-time filtering by student name or roll number.
- **Client-Side CSV Export**: Direct one-click export of the attendance sheet formatted with student details, status, and remarks.

### 3. Examination & Gradebook Management (`results.html`)
- **Assessment Types**: Mid-Term Examination (out of 50), Internal Continuous Assessments (out of 25), Practical Lab & Viva (out of 50), and End-Term Theory (out of 100).
- **Dynamic Grade Engine**:
  - Automatically computes Total Score and Percentage upon typing written or internal marks.
  - Automatically assigns letter grade (`O` for &ge;90%, `A+` for &ge;80%, `A` for &ge;70%, `B+` for &ge;60%, `B` for &ge;50%, `C` for &ge;40%, `F` for &lt;40%).
  - Automatically updates Pass / Fail status badge.
- **Class Analytics**: Instant recalculation of Class Average, Highest Score, Lowest Score, Passing Rate, and Grade Distribution Breakdown pills.
- **Publish Workflow**: Modal confirmation workflow simulating official submission and release to student portals.
- **Gradebook Export**: Clean CSV download of grades, percentages, marks breakdown, and faculty remarks.

---

## 🔗 Integration & Navigation Links
- Direct link from `../auth/login.html` when selecting the **Faculty** role.
- Consistent sidebar navigation connecting `dashboard.html`, `attendance.html`, and `results.html`.
- Logout action seamlessly redirects back to `../auth/login.html`.
