/* ==========================================================
   University Management System (GLA University Mathura)
   student/hierarchy/index.js  ->  FACULTY & HIERARCHY PAGE

   Shows who is who for this student, top to bottom:
   Vice Chancellor -> HOD -> Program Coordinator -> Year Coordinator
   -> Class Advisor -> the faculty who teach the student's subjects
   -> other faculty of the department (who do not teach this student).
   Each card has name, role, a photo and an (i) button with details.

   Real photos: put a picture named after the ID in this folder's
   "photos" folder, for example photos/VC.jpg, photos/HOD.jpg,
   photos/PC.jpg, photos/CA.jpg or photos/F001.jpg.
   Until then a simple avatar is shown.
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in student can see this page)

  const session = UMS.requireRole('student');
  if (!session) return;
  UMS.fillProfile(session);

  const me = UMS.store.findRecord('students', session.ref) || { semester: '1st', course: '' };
  const sem = UMS.semInfo(me.semester).number;
  const faculty = UMS.store.getRecords('faculty');
  const findFaculty = id => faculty.find(f => f.id === id);

  // every person shown on the page is kept here, the (i) button finds him/her by number
  const people = [];


  //////// Photo: a simple avatar (colour depends on the ID); a real photo replaces it if the file exists

  const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#7c3aed', '#0891b2', '#dc2626', '#0d3b66'];

  function avatar(id) {
    const color = COLORS[id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % COLORS.length];
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="' + color + '"/>' +
                '<circle cx="50" cy="38" r="18" fill="#fff" opacity="0.92"/><path d="M14 100c0-22 16-36 36-36s36 14 36 36z" fill="#fff" opacity="0.92"/></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }


  //////// One card (name bar, role row, (i) button, photo, phone / email when known)

  function card(person, isLead) {
    people.push(person);
    return '<div class="org-card' + (isLead ? ' lead' : '') + '">' +
      '<div class="org-name"><i class="bi bi-people-fill"></i><span>' + UMS.esc(person.name) + '</span></div>' +
      '<div class="org-role">' + UMS.esc(person.role) + '</div>' +
      '<button type="button" class="org-info" data-person="' + (people.length - 1) + '" aria-label="Details of ' + UMS.esc(person.name) + '"><i class="bi bi-info-circle-fill"></i></button>' +
      '<div><img class="org-photo" src="' + avatar(person.id) + '" data-photo="photos/' + UMS.esc(person.id) + '.jpg" alt="Photo of ' + UMS.esc(person.name) + '"></div>' +
      (person.extra ? '<div class="org-extra">' + UMS.esc(person.extra) + '</div>' : '') +
      (person.onLeave ? '<div class="org-leave">Currently on leave</div>' : '') +
      (person.contact || person.email ? '<div class="org-contact">' +
        (person.contact ? '<a href="tel:' + UMS.esc(person.contact) + '"><i class="bi bi-telephone-fill"></i>' + UMS.esc(person.contact) + '</a>' : '') +
        (person.email ? '<a href="mailto:' + UMS.esc(person.email) + '"><i class="bi bi-envelope-fill"></i>' + UMS.esc(person.email) + '</a>' : '') +
      '</div>' : '') +
      '</div>';
  }

  // a faculty record -> person
  function fromFaculty(f, role, extra) {
    return { id: f.id, name: f.name, role: role, extra: extra, dept: f.dept, contact: f.contact, email: f.email, onLeave: f.status === 'On Leave' };
  }

  function level(title, html, isGrid) {
    return '<div class="tree-level"><div class="tree-title">' + title + '</div>' + (isGrid ? '<div class="org-grid">' + html + '</div>' : html) + '</div>';
  }


  //////// Build the tree

  let parts = [];

  // 1) the chain: VC -> HOD -> PC -> Year Coordinator -> Class Advisor
  UMS.store.getRecords('hierarchy').forEach(h => {
    const f = h.facultyId && findFaculty(h.facultyId);
    if (h.facultyId && !f) return;   // faculty was deleted
    const person = f ? fromFaculty(f, h.role, f.dept) : { id: h.id, name: h.name, role: h.role };
    parts.push(card(person, true));
  });
  parts = parts.map(html => '<div class="tree-level">' + html + '</div>');

  // 2) faculty who teach this student this semester
  const subjects = UMS.store.getRecords('curriculum').filter(c => c.sem === sem);
  const teaching = UMS.store.getRecords('teaching');
  const teacherIds = [];
  const teacherCards = subjects.map(c => {
    const t = teaching.find(x => x.code === c.code);
    const f = t && findFaculty(t.facultyId);
    if (!f) return '';
    teacherIds.push(f.id);
    return card(fromFaculty(f, 'Faculty', c.name), false);
  }).join('');
  if (teacherCards) parts.push(level('My Faculty - Semester ' + UMS.semInfo(sem + 'th').roman, teacherCards, true));

  // 3) other faculty of the student's department who do NOT teach this student this semester
  const DEPT = [[/CSE|Computer Science/i, 'Computer Science & Engineering'], [/ECE|Electronics/i, 'Electronics & Communication'], [/\bME\b|Mechanical/i, 'Mechanical Engineering'],
                [/\bCE\b|Civil/i, 'Civil Engineering'], [/BBA|MBA|Management/i, 'Management'], [/BCA|MCA|Applications/i, 'Computer Applications']];
  const match = DEPT.find(d => d[0].test(me.course || ''));
  const others = faculty.filter(f => match && f.dept === match[1] && teacherIds.indexOf(f.id) === -1);
  if (others.length) {
    parts.push(level('Other Faculty in the Department (not teaching you this semester)',
      others.map(f => card(fromFaculty(f, 'Faculty', f.subjects), false)).join(''), true));
  }

  const connector = '<div class="tree-connector"></div>';
  $('#tree').html(parts.length ? parts.join(connector) : '<div class="table-card"><p>No faculty information available yet.</p></div>');


  //////// (i) button - details popup

  $('#tree').on('click', '.org-info', function () {
    const p = people[$(this).attr('data-person')];
    const line = (label, value) => '<p><b>' + label + ':</b> ' + (value ? UMS.esc(value) : '<span class="muted">Not added yet</span>') + '</p>';
    UMS.openInfo({
      title: p.name,
      html: line('Role', p.role) + (p.dept ? line('Department', p.dept) : '') + line('Phone', p.contact) + line('Email', p.email)
    });
  });


  //////// Swap in a real photo when the file exists

  $('.org-photo').each(function () {
    const $img = $(this);
    const test = new Image();
    test.onload = function () { $img.attr('src', $img.attr('data-photo')); };
    test.src = $img.attr('data-photo');
  });

});
