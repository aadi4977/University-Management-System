# University Management System (UMS) — Front End

A web-based platform to manage student, faculty, and administrator operations, built with HTML5, CSS3, and JavaScript as a 3rd-year B.Tech mini project for **GLA University, Mathura** (Department of Computer Engineering & Applications).

---

## 👥 Project Team

| Name | Roll No. | Assigned Feature Branch |
| --- | --- | --- |
| **Aadi Gupta** | 2415000001 | `feature/admin-portal` |
| **Abhimanyu Sharma** | 2415000028 | `feature/faculty-portal` |
| **Abhishek Vishwakarma** | 2415000064 | `feature/auth` |
| **Aditya Gupta** | 2415000089 | `feature/student-portal` |

**Faculty Supervisor:** Mr. Yash Singh

---

## 🏛️ Project Directory Structure

```
project-root/
│
├── index.html                  <- landing, redirect to auth/login.html
│
├── auth/
│   ├── login.html
│   ├── login.css
│   ├── logo.png
│   └── login-illustration.png
│
├── admin/
│   ├── dashboard.html
│   ├── students.html
│   ├── faculty.html
│   ├── courses.html
│   ├── fees.html
│   ├── admin.css
│   └── logo.png
│
├── faculty/
│   ├── dashboard.html
│   ├── attendance.html
│   ├── results.html
│   ├── faculty.css
│   ├── illustration.png
│   ├── logo.png
│   └── README.md
│
└── student/
    ├── dashboard.html
    ├── attendance.html
    ├── results.html
    ├── fees.html
    ├── student.css
    └── logo.png
```

---

## 🎓 Faculty Portal (`faculty/`)

Developed by **Abhimanyu Sharma** on branch `feature/faculty-portal`.

- **`dashboard.html`**: Overview of assigned courses, today's chronological lecture schedule, enrollment metrics, attendance donut chart, and academic circulars.
- **`attendance.html`**: Student attendance register supporting lecture-slot filtering, live statistic recalculation, bulk mark actions, defaulter isolation (&lt; 75%), and CSV export.
- **`results.html`**: Examination gradebook supporting Mid-Term, CIA, Practical Labs, and End-Term scoring with live grade calculation (O to F), class analytics, and result publication modal.
- **`faculty.css`**: Dedicated stylesheet complying with GLA UMS theme and font references (Navy `#0d3b66`, Royal Blue `#2563eb`, Gold `#f0a202`).
- **`logo.png` & `illustration.png`**: Official GLA UMS emblem and banner assets.
