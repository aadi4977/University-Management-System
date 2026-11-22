/* ==========================================================
   University Management System (GLA University Mathura)
   storage.js  ->  DATA LAYER (used by auth, admin and student)

   All pages read / write data only through this file.
   Data is saved in the browser (localStorage) as JSON.
   Load order on every page:  jQuery -> storage.js -> common.js -> page js
   ========================================================== */

window.UMS = window.UMS || {};

UMS.store = (function () {

  const PREFIX = 'ums_';

  // Change this number whenever the demo data changes. The demo data is then
  // re-created once in every browser (this also removes records added by hand).
  const SEED_VERSION = '2';

  // The hierarchy (VC, HOD, PC ...) can change without wiping the rest of the data
  const HIERARCHY_VERSION = '2';

  // The field that makes a record unique (used by update / delete)
  const KEYS = { users: 'username', students: 'roll', faculty: 'id', courses: 'code', fees: 'roll' };

  // Demo passwords (demo project only - a real system would hash these)
  const PASSWORDS = { admin: 'admin123', student: 'student123', faculty: 'faculty123' };
  const DEFAULT_FEE = 120000;


  //////// Basic helpers: get / save / add / find / update / delete

  function getRecords(name) {
    try {
      return JSON.parse(localStorage.getItem(PREFIX + name)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveRecords(name, list) {
    localStorage.setItem(PREFIX + name, JSON.stringify(list));
  }

  function addRecord(name, record) {
    const list = getRecords(name);
    list.push(record);
    saveRecords(name, list);
    return record;
  }

  function findRecord(name, id) {
    return getRecords(name).find(r => r[KEYS[name]] === id) || null;
  }

  function updateRecord(name, id, changes) {
    const list = getRecords(name);
    const rec = list.find(r => r[KEYS[name]] === id);
    if (!rec) return null;
    Object.assign(rec, changes);
    saveRecords(name, list);
    return rec;
  }

  function deleteRecord(name, id) {
    saveRecords(name, getRecords(name).filter(r => r[KEYS[name]] !== id));
  }

  // delete every record that matches a test function (used for attendance / marks)
  function deleteWhere(name, test) {
    saveRecords(name, getRecords(name).filter(r => !test(r)));
  }


  //////// Linked actions: student / faculty also need a login, fee row etc.

  function addStudent(s) {
    addRecord('students', s);
    addRecord('users', { username: s.roll, email: s.email, password: PASSWORDS.student, role: 'student', name: s.name, ref: s.roll });
    addRecord('fees', { roll: s.roll, name: s.name, total: DEFAULT_FEE, paid: 0 });
  }

  function updateStudent(roll, changes) {
    updateRecord('students', roll, changes);
    updateRecord('users', roll, { name: changes.name, email: changes.email });
    updateRecord('fees', roll, { name: changes.name });
  }

  function removeStudent(roll) {
    deleteRecord('students', roll);
    deleteRecord('users', roll);
    deleteRecord('fees', roll);
    deleteWhere('attendance', r => r.roll === roll);
    deleteWhere('marks', r => r.roll === roll);
  }

  function addFaculty(f) {
    addRecord('faculty', f);
    addRecord('users', { username: f.id, email: f.email, password: PASSWORDS.faculty, role: 'faculty', name: f.name, ref: f.id });
  }

  function updateFaculty(id, changes) {
    updateRecord('faculty', id, changes);
    updateRecord('users', id, { name: changes.name, email: changes.email });
  }

  function removeFaculty(id) {
    deleteRecord('faculty', id);
    deleteRecord('users', id);
    deleteWhere('teaching', r => r.facultyId === id);
    deleteWhere('hierarchy', r => r.facultyId === id);
  }


  //////// Demo (seed) data

  function emailOf(name) {
    return name.replace(/^(Dr\.|Prof\.)\s*/, '').toLowerCase().replace(/\s+/g, '.') + '@gla.ac.in';
  }

  // Subjects of every semester: [name, credits]. Code = BCSE0<sem>0<number>
  const CURRICULUM = {
    1: [['Engineering Mathematics I', 4], ['Engineering Physics', 3], ['Programming in C', 4], ['Basic Electrical Engineering', 3], ['Professional Communication', 2], ['Programming in C Lab', 2]],
    2: [['Engineering Mathematics II', 4], ['Engineering Chemistry', 3], ['Data Structures', 4], ['Digital Logic Design', 3], ['Environmental Science', 2], ['Data Structures Lab', 2]],
    3: [['Discrete Mathematics', 4], ['Computer Organization', 3], ['Object Oriented Programming', 4], ['Database Management Systems', 4], ['Operating Systems', 3], ['DBMS Lab', 2]],
    4: [['Design & Analysis of Algorithms', 4], ['Software Engineering', 3], ['Python Programming', 3], ['Probability & Statistics', 4], ['Microprocessors', 3], ['Python Programming Lab', 2]],
    5: [['Computer Networks', 3], ['Theory Of Automata & Formal Languages', 3], ['Application Build & Release Automation', 4], ['Full Stack Using Scripting Technologies', 4], ['Competitive Programming', 3], ['Full Stack Using Scripting Technologies Lab', 2]],
    6: [['Compiler Design', 4], ['Machine Learning', 4], ['Cloud Computing', 3], ['Web Technologies', 3], ['Information Security', 3], ['Machine Learning Lab', 2]],
    7: [['Big Data Analytics', 4], ['Distributed Systems', 3], ['Elective I', 3], ['Elective II', 3], ['Industrial Training', 2], ['Project Phase I', 4]],
    8: [['Elective III', 3], ['Elective IV', 3], ['Professional Ethics', 2], ['Major Project', 8], ['Seminar', 2], ['Comprehensive Viva', 2]]
  };

  function buildSeed() {

    // ---- Students
    const students = [
      ['2401001', 'Aditya Gupta',  'B.Tech CSE (AI & DS)', '5th', '9876543210', 'Active'],
      ['2401002', 'Aarav Sharma',  'B.Tech CSE',           '5th', '9876543211', 'Active'],
      ['2401003', 'Isha Verma',    'B.Tech ECE',           '3rd', '9876543212', 'Active'],
      ['2401004', 'Rohan Gupta',   'B.Tech ME',            '1st', '9876543213', 'On Leave'],
      ['2401005', 'Neha Singh',    'B.Tech CE',            '7th', '9876543214', 'Active'],
      ['2401006', 'Karan Patel',   'BBA',                  '5th', '9876543215', 'Active'],
      ['2401007', 'Ananya Mishra', 'MBA',                  '3rd', '9876543216', 'On Leave'],
      ['2401008', 'Priya Nair',    'BCA',                  '5th', '9876543217', 'Active']
    ].map(r => ({ roll: r[0], name: r[1], course: r[2], semester: r[3], contact: r[4], email: emailOf(r[1]), status: r[5] }));

    // ---- Faculty (subjects match what they teach in the student portal)
    const faculty = [
      ['F001', 'Dr. Ritika Sharma',  'Computer Science & Engineering', 'Computer Networks, Data Structures',                             '9876501001', 'Active'],
      ['F002', 'Prof. Amit Verma',   'Computer Science & Engineering', 'Full Stack Using Scripting Technologies, Operating Systems',       '9876501002', 'Active'],
      ['F003', 'Dr. Neha Gupta',     'Computer Science & Engineering', 'Web Technologies',                                                 '9876501003', 'On Leave'],
      ['F004', 'Prof. Sanjay Rathi', 'Electronics & Communication',    'Digital Electronics',                                              '9876501004', 'Active'],
      ['F005', 'Dr. Priya Malhotra', 'Computer Science & Engineering', 'Machine Learning',                                                 '9876501005', 'On Leave'],
      ['F006', 'Prof. Rakesh Tiwari','Computer Science & Engineering', 'Theory Of Automata & Formal Languages',                            '9876501006', 'Active'],
      ['F007', 'Dr. Meera Joshi',    'Computer Science & Engineering', 'Application Build & Release Automation, Competitive Programming', '9876501007', 'Active']
    ].map(r => ({ id: r[0], name: r[1], dept: r[2], subjects: r[3], contact: r[4], email: emailOf(r[1]), status: r[5] }));

    // ---- Courses (admin Courses page)
    const courses = [
      ['CSE101', 'Computer Programming',        'Computer Science & Engineering', 'B.Tech (CSE)', '1st', 3],
      ['CSE301', 'Data Structures & Algorithms', 'Computer Science & Engineering', 'B.Tech (CSE)', '3rd', 4],
      ['CSE401', 'Database Management Systems', 'Computer Science & Engineering', 'B.Tech (CSE)', '4th', 4],
      ['CSE501', 'Machine Learning',            'Computer Science & Engineering', 'B.Tech (CSE)', '5th', 3],
      ['ECE201', 'Digital Electronics',         'Electronics & Communication',    'B.Tech (ECE)', '2nd', 4],
      ['ME101',  'Engineering Mechanics',       'Mechanical Engineering',         'B.Tech (ME)',  '1st', 4]
    ].map(r => ({ code: r[0], name: r[1], dept: r[2], program: r[3], semester: r[4], credits: r[5] }));

    // ---- Fees (balance and status are calculated, never stored)
    const feeAmounts = {
      '2401001': [120000, 120000], '2401002': [120000, 80000], '2401003': [120000, 120000], '2401004': [120000, 0],
      '2401005': [95000, 95000],   '2401006': [85000, 85000],  '2401007': [110000, 60000],  '2401008': [90000, 90000]
    };
    const fees = students.map(s => ({ roll: s.roll, name: s.name, total: feeAmounts[s.roll][0], paid: feeAmounts[s.roll][1] }));

    // ---- Users (login accounts): 1 admin + every student + every faculty
    const users = [{ username: 'admin', email: 'admin@gla.ac.in', password: PASSWORDS.admin, role: 'admin', name: 'Admin', ref: '' }]
      .concat(students.map(s => ({ username: s.roll, email: s.email, password: PASSWORDS.student, role: 'student', name: s.name, ref: s.roll })))
      .concat(faculty.map(f => ({ username: f.id, email: f.email, password: PASSWORDS.faculty, role: 'faculty', name: f.name, ref: f.id })));

    // ---- Curriculum: every subject of every semester (with number of classes held)
    const curriculum = [];
    Object.keys(CURRICULUM).forEach(sem => CURRICULUM[sem].forEach((sub, j) => {
      const sem5Totals = [21, 24, 17, 26, 24, 21];
      curriculum.push({
        sem: +sem, code: 'BCSE0' + sem + '0' + (j + 1), name: sub[0], credits: sub[1],
        total: +sem === 5 ? sem5Totals[j] : 16 + ((+sem * 5 + j * 3) % 12)
      });
    }));

    // ---- Who teaches which subject (semester 5 is written by hand, others rotate)
    const sem5Teachers = ['F001', 'F006', 'F007', 'F002', 'F007', 'F002'];
    const rotation = ['F001', 'F002', 'F006', 'F007'];
    const teaching = curriculum.map((c, k) => ({
      code: c.code,
      facultyId: c.sem === 5 ? sem5Teachers[+c.code.slice(-1) - 1] : rotation[(c.sem + k) % 4]
    }));

    // ---- Academic hierarchy shown in the student portal (top to bottom).
    // A person is either a faculty member (facultyId) or just a name (id is used for the photo file name).
    const hierarchy = [
      { role: 'Vice Chancellor (VC)',     id: 'VC',  name: 'Anoop Kumar Gupta' },
      { role: 'Head of Department (HOD)', id: 'HOD', name: 'Sandeep Kumar Rathore' },
      { role: 'Program Coordinator (PC)', id: 'PC',  name: 'Subhash Chand Agrawal' },
      { role: 'Year Coordinator',         facultyId: 'F002' },
      { role: 'Class Advisor',            id: 'CA',  name: 'Sushil Kumar' }
    ];

    // ---- Attendance (current semester) and marks (every semester up to the current one)
    const attendance = [], marks = [];
    students.forEach((s, i) => {
      const current = parseInt(s.semester, 10);
      curriculum.filter(c => c.sem <= current).forEach(c => {
        const j = +c.code.slice(-1) - 1;
        const isAditya = i === 0 && c.sem === 5;   // first student: hand-written numbers (one subject below 75% on purpose)
        if (c.sem === current) {
          attendance.push({
            roll: s.roll, code: c.code, subject: c.name, total: c.total,
            attended: isAditya ? [17, 19, 16, 22, 17, 19][j] : c.total - (((i + j * 2) % 5) + 1)
          });
        }
        marks.push({
          roll: s.roll, sem: c.sem, code: c.code, subject: c.name, credits: c.credits,
          marks: isAditya ? [85, 78, 92, 88, 68, 94][j] : 58 + ((i * 7 + c.sem * 13 + j * 11) % 38)
        });
      });
    });

    // ---- Events: "days" = how many days from today (so dates always look current)
    const events = [
      { role: 'admin',   days: 2,  title: 'Mid-Term Examination',        meta: '9:00 AM - 5:00 PM \u00B7 All Departments' },
      { role: 'admin',   days: 5,  title: 'Faculty Meeting',             meta: '11:00 AM - 12:00 PM \u00B7 Conference Hall' },
      { role: 'admin',   days: 8,  title: 'Admission Review',            meta: '10:00 AM - 1:00 PM \u00B7 Admin Block' },
      { role: 'admin',   days: 10, title: 'Monthly Report Submission',   meta: '5:00 PM \u00B7 Online' },
      { role: 'student', days: 3,  title: 'Mid Term Exam \u2013 DBMS',              meta: '10:00 AM \u2013 12:00 PM \u00B7 Examination Hall 1' },
      { role: 'student', days: 6,  title: 'Assignment 4 Submission',                meta: '11:59 PM' },
      { role: 'student', days: 9,  title: 'Club Event \u2013 Tech Talk',            meta: '2:00 PM \u2013 4:00 PM \u00B7 Auditorium' },
      { role: 'student', days: 13, title: 'Last Date for Fee Payment',              meta: 'Till 11:59 PM' },
      { role: 'student', days: 18, title: 'Mid Term Exam \u2013 Computer Networks', meta: '10:00 AM \u2013 12:00 PM \u00B7 Examination Hall 2' },
      { role: 'student', days: 22, title: 'Mini Project Review',                    meta: '11:00 AM \u2013 1:00 PM \u00B7 Seminar Hall' },
      { role: 'student', days: 27, title: 'Library Book Return Deadline',           meta: '5:00 PM \u00B7 Central Library' }
    ];

    return { users, students, faculty, courses, fees, curriculum, teaching, hierarchy, attendance, marks, events };
  }

  // Create demo data. Re-created once when SEED_VERSION changes, otherwise only missing collections are filled.
  function init() {
    const seed = buildSeed();
    if (localStorage.getItem(PREFIX + 'seed_version') !== SEED_VERSION) {
      Object.keys(seed).forEach(name => saveRecords(name, seed[name]));
      ['history', 'timetable'].forEach(old => localStorage.removeItem(PREFIX + old));   // collections of the old version
      localStorage.setItem(PREFIX + 'seed_version', SEED_VERSION);
      localStorage.setItem(PREFIX + 'hierarchy_version', HIERARCHY_VERSION);
      return;
    }
    Object.keys(seed).forEach(name => {
      if (localStorage.getItem(PREFIX + name) === null) saveRecords(name, seed[name]);
    });
    if (localStorage.getItem(PREFIX + 'hierarchy_version') !== HIERARCHY_VERSION) {
      saveRecords('hierarchy', seed.hierarchy);
      localStorage.setItem(PREFIX + 'hierarchy_version', HIERARCHY_VERSION);
    }
  }

  // wipe everything and fill the demo data again
  function resetAll() {
    const seed = buildSeed();
    Object.keys(seed).forEach(name => saveRecords(name, seed[name]));
  }

  init();

  return {
    getRecords, saveRecords, addRecord, findRecord, updateRecord, deleteRecord, deleteWhere,
    addStudent, updateStudent, removeStudent, addFaculty, updateFaculty, removeFaculty,
    init, resetAll
  };
})();
