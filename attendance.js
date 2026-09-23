/**
 * EduPulse 360 - Module 2: Smart Attendance Management System 🏫
 */

let attendanceState = {
    records: [],
    selectedDate: new Date().toISOString().slice(0, 10),
    selectedSubject: "CS301 - Operating Systems",
    filter: 'all', // 'all' | 'absent' | 'defaulters'
    searchQuery: ''
};

function initAttendanceModule() {
    loadAttendanceData();
    setupAttendanceEventListeners();
    renderAttendanceRoster();
    updateAttendanceMetricCards();
}

function loadAttendanceData() {
    const saved = localStorage.getItem('edupulse_attendance');
    if (saved) {
        try {
            attendanceState.records = JSON.parse(saved);
        } catch (e) {
            attendanceState.records = JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE));
        }
    } else {
        attendanceState.records = JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE));
        saveAttendanceData();
    }
}

function saveAttendanceData() {
    localStorage.setItem('edupulse_attendance', JSON.stringify(attendanceState.records));
}

// Attendance Calculations
function calculateAttendanceStats(record) {
    const total = record.total || 1;
    const attended = record.attended || 0;
    const percentage = Number(((attended / total) * 100).toFixed(1));
    const isDefaulter = percentage < 75.0;

    // Consecutive classes needed to reach 75% threshold
    // (attended + x) / (total + x) >= 0.75  =>  x >= (0.75 * total - attended) / 0.25
    let classesNeededFor75 = 0;
    if (isDefaulter) {
        classesNeededFor75 = Math.max(1, Math.ceil((0.75 * total - attended) / 0.25));
    }

    return {
        attended,
        total,
        percentage,
        isDefaulter,
        classesNeededFor75
    };
}

function calculateClassAttendanceOverview() {
    if (!attendanceState.records.length) return null;

    let totalPercentage = 0;
    let presentToday = 0;
    let absentToday = 0;
    let defaultersCount = 0;

    attendanceState.records.forEach(r => {
        const stats = calculateAttendanceStats(r);
        totalPercentage += stats.percentage;
        if (r.statusToday === 'Present') presentToday++;
        else absentToday++;

        if (stats.isDefaulter) defaultersCount++;
    });

    const averageAttendance = Number((totalPercentage / attendanceState.records.length).toFixed(1));

    return {
        totalStudents: attendanceState.records.length,
        averageAttendance,
        presentToday,
        absentToday,
        defaultersCount
    };
}

function updateAttendanceMetricCards() {
    const overview = calculateClassAttendanceOverview();
    if (!overview) return;

    const avgEl = document.getElementById('att-avg-percentage');
    const presentEl = document.getElementById('att-present-today');
    const absentEl = document.getElementById('att-absent-today');
    const defaulterEl = document.getElementById('att-defaulter-count');

    if (avgEl) avgEl.innerText = `${overview.averageAttendance}%`;
    if (presentEl) presentEl.innerText = `${overview.presentToday} / ${overview.totalStudents}`;
    if (absentEl) absentEl.innerText = `${overview.absentToday}`;
    if (defaulterEl) {
        defaulterEl.innerHTML = `
            <span class="${overview.defaultersCount > 0 ? 'text-rose-600 animate-pulse font-extrabold' : 'text-emerald-600'}">
                ${overview.defaultersCount} Students
            </span>
        `;
    }
}

// Render Attendance Roster
function renderAttendanceRoster() {
    const tbody = document.getElementById('attendance-roster-tbody');
    if (!tbody) return;

    let records = [...attendanceState.records];

    // Search filter
    if (attendanceState.searchQuery) {
        const q = attendanceState.searchQuery.toLowerCase();
        records = records.filter(r => r.name.toLowerCase().includes(q) || r.rollNo.toLowerCase().includes(q));
    }

    // Tab filter
    if (attendanceState.filter === 'absent') {
        records = records.filter(r => r.statusToday === 'Absent');
    } else if (attendanceState.filter === 'defaulters') {
        records = records.filter(r => calculateAttendanceStats(r).isDefaulter);
    }

    if (records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-10 text-gray-400">
                    <i class="fa-solid fa-clipboard-check text-4xl mb-2 text-emerald-300"></i>
                    <p class="text-sm font-medium">No students match this view criteria.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = records.map(r => {
        const stats = calculateAttendanceStats(r);
        const isPresent = r.statusToday === 'Present';

        // Defaulter warning alert badge
        const alertBadge = stats.isDefaulter ? `
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold animate-pulse">
                <i class="fa-solid fa-triangle-exclamation text-rose-500"></i>
                <span>⚠️ Your attendance is below 75% (${stats.percentage}%)</span>
            </div>
            <div class="text-[11px] text-rose-600 font-medium mt-1">
                Must attend <strong>${stats.classesNeededFor75}</strong> consecutive classes to reach 75%
            </div>
        ` : `
            <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <i class="fa-solid fa-circle-check text-emerald-500"></i> Good Standing (${stats.percentage}%)
            </div>
        `;

        return `
            <tr class="hover:bg-slate-50/80 transition-colors border-b border-gray-100 ${stats.isDefaulter ? 'bg-rose-50/20' : ''}">
                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full ${isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} flex items-center justify-center font-bold text-xs">
                            ${r.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                            <div class="font-semibold text-gray-900">${r.name}</div>
                            <div class="text-xs text-gray-500 font-mono">${r.rollNo}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-3 text-center">
                    <span class="text-sm font-semibold text-slate-800">${stats.attended}</span>
                    <span class="text-xs text-slate-400"> / ${stats.total}</span>
                </td>
                <td class="px-4 py-3 text-center">
                    <div class="w-full bg-slate-100 rounded-full h-2 max-w-[100px] mx-auto overflow-hidden">
                        <div class="h-2 rounded-full ${stats.isDefaulter ? 'bg-rose-500' : 'bg-emerald-500'}" style="width: ${Math.min(100, stats.percentage)}%"></div>
                    </div>
                    <span class="text-xs font-bold mt-1 block ${stats.isDefaulter ? 'text-rose-600' : 'text-slate-700'}">${stats.percentage}%</span>
                </td>
                <td class="px-4 py-3 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }">
                        ${isPresent ? '● Present' : '○ Absent'}
                    </span>
                </td>
                <td class="px-4 py-3">
                    ${alertBadge}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-1.5">
                        <button onclick="toggleAttendanceStatus('${r.studentId}')" class="px-3 py-1 text-xs font-semibold rounded-lg border transition shadow-xs ${
                            isPresent 
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }">
                            ${isPresent ? 'Mark Absent' : 'Mark Present'}
                        </button>
                        ${stats.isDefaulter ? `
                            <button onclick="openDefaulterNoticeModal('${r.studentId}')" title="Print Official Warning Notice" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md border border-amber-200">
                                <i class="fa-solid fa-print text-sm"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Toggle attendance for student
function toggleAttendanceStatus(studentId) {
    const rec = attendanceState.records.find(r => r.studentId === studentId);
    if (!rec) return;

    if (rec.statusToday === 'Present') {
        rec.statusToday = 'Absent';
        rec.attended = Math.max(0, rec.attended - 1);
    } else {
        rec.statusToday = 'Present';
        rec.attended = Math.min(rec.total, rec.attended + 1);
    }

    saveAttendanceData();
    renderAttendanceRoster();
    updateAttendanceMetricCards();

    const stats = calculateAttendanceStats(rec);
    if (stats.isDefaulter) {
        showToast(`⚠️ Alert: ${rec.name}'s attendance is below 75% (${stats.percentage}%)`, 'warning');
    } else {
        showToast(`Attendance updated for ${rec.name}: ${rec.statusToday}`, 'success');
    }
}

// Bulk Actions
function markAllPresent() {
    attendanceState.records.forEach(r => {
        if (r.statusToday !== 'Present') {
            r.statusToday = 'Present';
            r.attended = Math.min(r.total, r.attended + 1);
        }
    });
    saveAttendanceData();
    renderAttendanceRoster();
    updateAttendanceMetricCards();
    showToast('All students marked Present for today\'s session!', 'success');
}

function clearAllAttendance() {
    attendanceState.records.forEach(r => {
        if (r.statusToday === 'Present') {
            r.statusToday = 'Absent';
            r.attended = Math.max(0, r.attended - 1);
        }
    });
    saveAttendanceData();
    renderAttendanceRoster();
    updateAttendanceMetricCards();
    showToast('Attendance status reset for today.', 'info');
}

// ⚠️ Innovation Challenge: Official Warning Notice Slip Generator
function openDefaulterNoticeModal(studentId) {
    const student = attendanceState.records.find(r => r.studentId === studentId);
    if (!student) return;

    const stats = calculateAttendanceStats(student);
    const modal = document.getElementById('modal-defaulter-notice');
    const container = document.getElementById('defaulter-notice-container');
    if (!modal || !container) return;

    container.innerHTML = `
        <div class="border-2 border-red-500 rounded-xl p-6 bg-white relative overflow-hidden shadow-lg print:border-black">
            <!-- Watermark -->
            <div class="absolute -right-8 -top-8 text-red-100 font-extrabold text-7xl select-none pointer-events-none opacity-50 rotate-12">
                DEFAULTER
            </div>

            <div class="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
                <div>
                    <h3 class="font-extrabold text-xl text-slate-900 tracking-tight">DEPARTMENT OF ACADEMIC COMPLIANCE</h3>
                    <div class="text-xs text-slate-500 font-medium">Smart University Academic Regulations • Regulation Sec 4.2</div>
                </div>
                <div class="text-right">
                    <span class="px-2.5 py-1 bg-red-100 text-red-700 font-black text-xs rounded uppercase tracking-wider">
                        CRITICAL NOTICE
                    </span>
                    <div class="text-xs text-slate-400 mt-1">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>

            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
                <div class="font-bold text-red-800 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation text-lg"></i>
                    FORMAL ATTENDANCE DEFICIENCY WARNING
                </div>
                <p class="text-xs text-red-700 mt-1">
                    To the Parent / Guardian of <strong>${student.name}</strong> (${student.rollNo}):
                </p>
            </div>

            <p class="text-sm text-slate-700 leading-relaxed mb-4">
                This is an automated formal notification that student <strong>${student.name}</strong> has failed to satisfy the mandatory 75% attendance criteria. Continued deficiency will result in exam debarment.
            </p>

            <div class="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
                <div class="text-center">
                    <div class="text-xs text-slate-500 font-medium">Total Classes Held</div>
                    <div class="text-xl font-extrabold text-slate-800 mt-1">${stats.total}</div>
                </div>
                <div class="text-center border-x border-slate-200">
                    <div class="text-xs text-slate-500 font-medium">Classes Attended</div>
                    <div class="text-xl font-extrabold text-slate-800 mt-1">${stats.attended}</div>
                </div>
                <div class="text-center">
                    <div class="text-xs text-slate-500 font-medium">Current Attendance %</div>
                    <div class="text-xl font-extrabold text-red-600 mt-1">${stats.percentage}%</div>
                </div>
            </div>

            <div class="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 mb-5 flex items-center gap-3">
                <i class="fa-solid fa-calculator text-amber-600 text-xl shrink-0"></i>
                <div>
                    <strong>Action Required:</strong> To restore examination eligibility to 75%, this student must attend a minimum of 
                    <span class="font-extrabold underline text-rose-700">${stats.classesNeededFor75} consecutive lectures</span> without any unauthorized absences.
                </div>
            </div>

            <div class="border-t border-slate-200 pt-4 flex justify-between items-end text-xs text-slate-500">
                <div>
                    <div>System ID: REF-ATT-${student.studentId}-${Date.now().toString().slice(-4)}</div>
                    <div>Dean of Academics & Student Welfare</div>
                </div>
                <div class="text-right border-t border-slate-400 pt-1 w-40">
                    Authorized Signatory
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeDefaulterNoticeModal() {
    const modal = document.getElementById('modal-defaulter-notice');
    if (modal) modal.classList.add('hidden');
}

function printDefaulterNotice() {
    window.print();
}

function resetAttendanceData() {
    attendanceState.records = JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE));
    saveAttendanceData();
    renderAttendanceRoster();
    updateAttendanceMetricCards();
    showToast('Attendance demo data restored!', 'success');
}

function exportAttendanceReport() {
    const headers = ['StudentID,RollNo,Name,Department,Attended,TotalHeld,Percentage,StatusToday,IsDefaulter,ClassesNeededFor75'];
    const rows = attendanceState.records.map(r => {
        const s = calculateAttendanceStats(r);
        return `"${r.studentId}","${r.rollNo}","${r.name}","${r.department}",${s.attended},${s.total},${s.percentage},"${r.statusToday}",${s.isDefaulter},${s.classesNeededFor75}`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Compliance_Report_${attendanceState.selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance report exported!', 'success');
}

function setupAttendanceEventListeners() {
    const searchInput = document.getElementById('att-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            attendanceState.searchQuery = e.target.value;
            renderAttendanceRoster();
        });
    }

    const filterBtns = document.querySelectorAll('[data-att-filter]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active-tab', 'bg-emerald-600', 'text-white'));
            btn.classList.add('active-tab', 'bg-emerald-600', 'text-white');
            attendanceState.filter = btn.getAttribute('data-att-filter');
            renderAttendanceRoster();
        });
    });

    const dateInput = document.getElementById('att-date-picker');
    if (dateInput) {
        dateInput.value = attendanceState.selectedDate;
        dateInput.addEventListener('change', (e) => {
            attendanceState.selectedDate = e.target.value;
            showToast(`Loaded attendance log for ${attendanceState.selectedDate}`, 'info');
        });
    }

    const addStudentForm = document.getElementById('form-add-attendance-student');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const f = e.target;
            const newAtt = {
                studentId: `STU-${Date.now().toString().slice(-4)}`,
                rollNo: f.rollNo.value.trim(),
                name: f.name.value.trim(),
                department: f.department.value || "Computer Science",
                attended: Number(f.attended.value) || 0,
                total: Number(f.total.value) || 40,
                statusToday: f.statusToday.value
            };
            attendanceState.records.unshift(newAtt);
            saveAttendanceData();
            renderAttendanceRoster();
            updateAttendanceMetricCards();
            f.reset();
            closeAddAttendanceStudentModal();
            showToast(`Added ${newAtt.name} to attendance roster!`, 'success');
        });
    }
}

function openAddAttendanceStudentModal() {
    const m = document.getElementById('modal-add-att-student');
    if (m) m.classList.remove('hidden');
}

function closeAddAttendanceStudentModal() {
    const m = document.getElementById('modal-add-att-student');
    if (m) m.classList.add('hidden');
}
