/**
 * EduPulse 360 - Module 1: Student Performance Analysis System 📊
 */

let performanceState = {
    students: [],
    charts: {
        distribution: null,
        subjectAverages: null,
        comparison: null
    },
    filter: 'all',
    searchQuery: '',
    selectedStudentForAdvisor: null
};

// Initialize performance module
function initPerformanceModule() {
    loadPerformanceData();
    setupPerformanceEventListeners();
    renderPerformanceTable();
    updatePerformanceMetricCards();
    renderPerformanceCharts();
    populateComparisonDropdowns();
}

// Load data from localStorage or fallback to default
function loadPerformanceData() {
    const saved = localStorage.getItem('edupulse_students');
    if (saved) {
        try {
            performanceState.students = JSON.parse(saved);
        } catch (e) {
            performanceState.students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
        }
    } else {
        performanceState.students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
        savePerformanceData();
    }
}

function savePerformanceData() {
    localStorage.setItem('edupulse_students', JSON.stringify(performanceState.students));
}

// Calculations
function calculateStudentMetrics(student) {
    const subjects = Object.keys(student.marks);
    let total = 0;
    let highestSubject = { name: '', mark: -1 };
    let lowestSubject = { name: '', mark: 999 };
    const weakSubjects = [];

    subjects.forEach(sub => {
        const val = Number(student.marks[sub]) || 0;
        total += val;
        if (val > highestSubject.mark) highestSubject = { name: sub, mark: val };
        if (val < lowestSubject.mark) lowestSubject = { name: sub, mark: val };
        if (val < 50) {
            weakSubjects.push({ name: sub, mark: val });
        }
    });

    const maxMarks = subjects.length * 100;
    const percentage = Number(((total / maxMarks) * 100).toFixed(1));

    let grade = 'F';
    let statusClass = 'text-rose-600 bg-rose-50 border-rose-200';
    if (percentage >= 90) { grade = 'A+'; statusClass = 'text-emerald-600 bg-emerald-50 border-emerald-200'; }
    else if (percentage >= 80) { grade = 'A'; statusClass = 'text-teal-600 bg-teal-50 border-teal-200'; }
    else if (percentage >= 70) { grade = 'B'; statusClass = 'text-indigo-600 bg-indigo-50 border-indigo-200'; }
    else if (percentage >= 60) { grade = 'C'; statusClass = 'text-blue-600 bg-blue-50 border-blue-200'; }
    else if (percentage >= 50) { grade = 'D'; statusClass = 'text-amber-600 bg-amber-50 border-amber-200'; }

    return {
        total,
        maxMarks,
        percentage,
        grade,
        statusClass,
        highestSubject,
        lowestSubject,
        weakSubjects,
        hasWeakness: weakSubjects.length > 0
    };
}

function calculateClassMetrics() {
    if (!performanceState.students.length) return null;

    let totalPercentageSum = 0;
    let highestStudent = null;
    let lowestStudent = null;
    let highestPct = -1;
    let lowestPct = 999;
    let passCount = 0;

    performanceState.students.forEach(s => {
        const m = calculateStudentMetrics(s);
        totalPercentageSum += m.percentage;

        if (m.percentage > highestPct) {
            highestPct = m.percentage;
            highestStudent = { ...s, metrics: m };
        }
        if (m.percentage < lowestPct) {
            lowestPct = m.percentage;
            lowestStudent = { ...s, metrics: m };
        }
        if (m.percentage >= 50) {
            passCount++;
        }
    });

    const classAverage = Number((totalPercentageSum / performanceState.students.length).toFixed(1));
    const passRate = Number(((passCount / performanceState.students.length) * 100).toFixed(1));

    // Calculate subject averages
    const subjectNames = ['Mathematics', 'Physics', 'Chemistry', 'ComputerScience', 'English'];
    const subjectSums = { Mathematics: 0, Physics: 0, Chemistry: 0, ComputerScience: 0, English: 0 };
    
    performanceState.students.forEach(s => {
        subjectNames.forEach(sub => {
            subjectSums[sub] += Number(s.marks[sub]) || 0;
        });
    });

    const subjectAverages = {};
    subjectNames.forEach(sub => {
        subjectAverages[sub] = Number((subjectSums[sub] / performanceState.students.length).toFixed(1));
    });

    return {
        classAverage,
        passRate,
        highestStudent,
        lowestStudent,
        totalStudents: performanceState.students.length,
        subjectAverages
    };
}

// Update Top Metric Cards
function updatePerformanceMetricCards() {
    const metrics = calculateClassMetrics();
    if (!metrics) return;

    const avgEl = document.getElementById('perf-class-avg');
    const highestEl = document.getElementById('perf-highest-score');
    const lowestEl = document.getElementById('perf-lowest-score');
    const passEl = document.getElementById('perf-pass-rate');

    if (avgEl) avgEl.innerText = `${metrics.classAverage}%`;
    if (highestEl && metrics.highestStudent) {
        highestEl.innerHTML = `
            <div class="font-bold text-gray-900">${metrics.highestStudent.name}</div>
            <div class="text-xs text-emerald-600 font-semibold">${metrics.highestStudent.metrics.percentage}% (${metrics.highestStudent.metrics.total}/500)</div>
        `;
    }
    if (lowestEl && metrics.lowestStudent) {
        lowestEl.innerHTML = `
            <div class="font-bold text-gray-900">${metrics.lowestStudent.name}</div>
            <div class="text-xs text-rose-600 font-semibold">${metrics.lowestStudent.metrics.percentage}% (${metrics.lowestStudent.metrics.total}/500)</div>
        `;
    }
    if (passEl) passEl.innerText = `${metrics.passRate}%`;
}

// Render student table with weak subject badges
function renderPerformanceTable() {
    const tbody = document.getElementById('perf-students-tbody');
    if (!tbody) return;

    let students = [...performanceState.students];

    // Search filter
    if (performanceState.searchQuery) {
        const q = performanceState.searchQuery.toLowerCase();
        students = students.filter(s => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q));
    }

    // Category filter
    if (performanceState.filter === 'struggling') {
        students = students.filter(s => calculateStudentMetrics(s).hasWeakness);
    } else if (performanceState.filter === 'toppers') {
        students = students.filter(s => calculateStudentMetrics(s).percentage >= 80);
    }

    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-8 text-gray-500">
                    <i class="fa-solid fa-user-slash text-3xl mb-2 text-gray-400"></i>
                    <p>No student records match your filter criteria.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = students.map((s, index) => {
        const m = calculateStudentMetrics(s);
        
        // Subject badges with weak subject indicators
        const renderMarkPill = (subName) => {
            const mark = s.marks[subName];
            const isWeak = mark < 50;
            return `
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    isWeak 
                    ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse' 
                    : mark >= 80 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-slate-100 text-slate-700'
                }" title="${subName}: ${mark} ${isWeak ? '(Weak Subject - Needs Action!)' : ''}">
                    ${mark}
                </span>
            `;
        };

        const weakNotice = m.hasWeakness 
            ? `<button onclick="openSubjectAdvisor('${s.id}')" class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition shadow-sm cursor-pointer">
                <i class="fa-solid fa-lightbulb text-amber-500"></i> ${m.weakSubjects.length} Weak (${m.weakSubjects.map(w => w.name).join(', ')})
               </button>`
            : `<span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <i class="fa-solid fa-circle-check text-emerald-500"></i> All Strong
               </span>`;

        return `
            <tr class="hover:bg-slate-50/80 transition-colors border-b border-gray-100">
                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                        <img class="h-9 w-9 rounded-full object-cover border border-indigo-100 shadow-xs" src="${s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" alt="">
                        <div>
                            <div class="font-semibold text-gray-900">${s.name}</div>
                            <div class="text-xs text-gray-500 font-mono">${s.rollNo}</div>
                        </div>
                    </div>
                </td>
                <td class="px-3 py-3 text-center">${renderMarkPill('Mathematics')}</td>
                <td class="px-3 py-3 text-center">${renderMarkPill('Physics')}</td>
                <td class="px-3 py-3 text-center">${renderMarkPill('Chemistry')}</td>
                <td class="px-3 py-3 text-center">${renderMarkPill('ComputerScience')}</td>
                <td class="px-3 py-3 text-center">${renderMarkPill('English')}</td>
                <td class="px-4 py-3 text-center">
                    <span class="font-bold text-gray-900">${m.percentage}%</span>
                    <span class="text-xs text-gray-500 block">(${m.total}/500)</span>
                </td>
                <td class="px-4 py-3 text-center">
                    <span class="px-2.5 py-1 rounded-md text-xs font-bold border ${m.statusClass}">${m.grade}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-2">
                        ${weakNotice}
                        <button onclick="openSubjectAdvisor('${s.id}')" title="View AI Study Advisor" class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition">
                            <i class="fa-solid fa-wand-magic-sparkles text-sm"></i>
                        </button>
                        <button onclick="deleteStudent('${s.id}')" title="Delete Student" class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition">
                            <i class="fa-solid fa-trash-can text-sm"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Render Chart.js Visualizations
function renderPerformanceCharts() {
    renderClassDistributionChart();
    renderSubjectAverageChart();
}

function renderClassDistributionChart() {
    const canvas = document.getElementById('chart-class-distribution');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const labels = performanceState.students.map(s => s.name);
    const data = performanceState.students.map(s => calculateStudentMetrics(s).percentage);
    const backgroundColors = data.map(pct => {
        if (pct >= 85) return 'rgba(16, 185, 129, 0.8)'; // Emerald
        if (pct >= 70) return 'rgba(79, 70, 229, 0.8)';  // Indigo
        if (pct >= 50) return 'rgba(245, 158, 11, 0.8)'; // Amber
        return 'rgba(239, 68, 68, 0.8)';                // Rose
    });

    if (performanceState.charts.distribution) {
        performanceState.charts.distribution.destroy();
    }

    performanceState.charts.distribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Percentage (%)',
                data: data,
                backgroundColor: backgroundColors,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` Percentage: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: { callback: v => v + '%' },
                    grid: { color: 'rgba(226, 232, 240, 0.6)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function renderSubjectAverageChart() {
    const canvas = document.getElementById('chart-subject-averages');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const metrics = calculateClassMetrics();
    if (!metrics) return;

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'ComputerScience', 'English'];
    const averages = subjects.map(s => metrics.subjectAverages[s]);

    if (performanceState.charts.subjectAverages) {
        performanceState.charts.subjectAverages.destroy();
    }

    performanceState.charts.subjectAverages = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: subjects,
            datasets: [{
                label: 'Class Average',
                data: averages,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: { stepSize: 20, backdropColor: 'transparent' },
                    grid: { color: 'rgba(226, 232, 240, 0.8)' }
                }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// 💡 Innovation Challenge: AI Subject Improvement Advisor
function openSubjectAdvisor(studentId) {
    const student = performanceState.students.find(s => s.id === studentId);
    if (!student) return;

    performanceState.selectedStudentForAdvisor = student;
    const metrics = calculateStudentMetrics(student);

    const modal = document.getElementById('modal-advisor');
    const contentEl = document.getElementById('modal-advisor-content');
    if (!modal || !contentEl) return;

    let html = '';

    if (metrics.hasWeakness) {
        html = `
            <div class="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                    <i class="fa-solid fa-triangle-exclamation text-lg"></i>
                </div>
                <div>
                    <h4 class="font-bold text-amber-900">Academic Intervention Required for ${student.name}</h4>
                    <p class="text-sm text-amber-700 mt-1">
                        Our diagnostic engine identified <strong>${metrics.weakSubjects.length} subject(s)</strong> scoring under 50%. 
                        Below is a personalized recovery roadmap formulated based on performance gaps.
                    </p>
                </div>
            </div>

            <div class="space-y-6">
                ${metrics.weakSubjects.map(sub => {
                    const rule = SUBJECT_IMPROVEMENT_SUGGESTIONS[sub.name] || {
                        diagnostics: "Needs systematic revision of fundamental curriculum concepts and regular practice.",
                        actionPlan: ["Spend 30 minutes every evening revising class notes.", "Seek faculty clarification on doubt topics."],
                        curatedResources: []
                    };

                    return `
                        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition hover:border-indigo-200">
                            <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <i class="fa-solid ${rule.icon || 'fa-book'}"></i>
                                    </div>
                                    <div>
                                        <h5 class="font-bold text-gray-900 text-base">${sub.name}</h5>
                                        <span class="text-xs text-rose-600 font-semibold">Current Score: ${sub.mark}/100 (Needs +${50 - sub.mark} marks to pass threshold)</span>
                                    </div>
                                </div>
                                <span class="px-2.5 py-1 text-xs rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-200">
                                    Priority: High
                                </span>
                            </div>

                            <!-- Diagnostic Insight -->
                            <div class="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                    <i class="fa-solid fa-microscope text-indigo-500 mr-1"></i> Root Cause Diagnosis
                                </span>
                                <p class="text-sm text-slate-700">${rule.diagnostics}</p>
                            </div>

                            <!-- Action Steps -->
                            <div class="mb-4">
                                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                    <i class="fa-solid fa-list-check text-emerald-500 mr-1"></i> 4-Step Improvement Blueprint
                                </span>
                                <ul class="space-y-2">
                                    ${rule.actionPlan.map((step, idx) => `
                                        <li class="flex items-start gap-2.5 text-sm text-gray-700">
                                            <span class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">${idx + 1}</span>
                                            <span>${step}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>

                            <!-- Curated Resources -->
                            <div>
                                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                    <i class="fa-solid fa-link text-blue-500 mr-1"></i> Curated Learning Modules & Drills
                                </span>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    ${rule.curatedResources.map(res => `
                                        <a href="${res.link}" target="_blank" class="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition flex flex-col justify-between group">
                                            <div>
                                                <div class="text-xs font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-1">${res.title}</div>
                                                <div class="text-[11px] text-gray-500 mt-0.5">${res.type}</div>
                                            </div>
                                            <div class="text-[11px] text-indigo-600 font-medium mt-2 flex items-center gap-1">
                                                Open Resource <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                                            </div>
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        html = `
            <div class="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                    <i class="fa-solid fa-trophy"></i>
                </div>
                <h4 class="text-xl font-bold text-emerald-900">Exemplary Academic Standing!</h4>
                <p class="text-emerald-700 text-sm mt-2 max-w-md mx-auto">
                    ${student.name} currently has no weak subjects! All subject scores are $\ge 50\%$, with an overall percentage of <strong>${metrics.percentage}%</strong>.
                </p>
                <div class="mt-6 inline-flex flex-col sm:flex-row gap-3">
                    <div class="bg-white p-4 rounded-xl border border-emerald-200 text-left shadow-xs">
                        <div class="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-hands-holding-child text-indigo-600"></i> Peer Mentorship Role
                        </div>
                        <p class="text-xs text-gray-600 mt-1">Recommended to mentor junior or struggling students in <strong>${metrics.highestSubject.name}</strong> (${metrics.highestSubject.mark}%).</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-emerald-200 text-left shadow-xs">
                        <div class="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-rocket text-purple-600"></i> Advanced Honors Track
                        </div>
                        <p class="text-xs text-gray-600 mt-1">Eligible for National Collegiate Hackathon sponsorship & Research Paper grants.</p>
                    </div>
                </div>
            </div>
        `;
    }

    contentEl.innerHTML = html;
    modal.classList.remove('hidden');
}

function closeAdvisorModal() {
    const modal = document.getElementById('modal-advisor');
    if (modal) modal.classList.add('hidden');
}

// Side-by-Side Student Comparison Tool
function populateComparisonDropdowns() {
    const selectA = document.getElementById('perf-compare-student-a');
    const selectB = document.getElementById('perf-compare-student-b');
    if (!selectA || !selectB) return;

    const options = performanceState.students.map(s => `<option value="${s.id}">${s.name} (${s.rollNo})</option>`).join('');
    selectA.innerHTML = options;
    selectB.innerHTML = options;

    if (performanceState.students.length >= 2) {
        selectA.value = performanceState.students[0].id;
        selectB.value = performanceState.students[performanceState.students.length - 1].id;
    }

    updateStudentComparison();
}

function updateStudentComparison() {
    const selectA = document.getElementById('perf-compare-student-a');
    const selectB = document.getElementById('perf-compare-student-b');
    const container = document.getElementById('perf-comparison-results');
    const canvas = document.getElementById('chart-student-comparison');

    if (!selectA || !selectB || !container || !canvas) return;

    const studentA = performanceState.students.find(s => s.id === selectA.value);
    const studentB = performanceState.students.find(s => s.id === selectB.value);

    if (!studentA || !studentB) return;

    const metricsA = calculateStudentMetrics(studentA);
    const metricsB = calculateStudentMetrics(studentB);

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'ComputerScience', 'English'];

    // Update Comparison Radar
    const ctx = canvas.getContext('2d');
    if (performanceState.charts.comparison) {
        performanceState.charts.comparison.destroy();
    }

    performanceState.charts.comparison = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: subjects,
            datasets: [
                {
                    label: studentA.name,
                    data: subjects.map(s => studentA.marks[s]),
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(79, 70, 229, 1)'
                },
                {
                    label: studentB.name,
                    data: subjects.map(s => studentB.marks[s]),
                    backgroundColor: 'rgba(244, 63, 94, 0.2)',
                    borderColor: 'rgba(244, 63, 94, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(244, 63, 94, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: { stepSize: 20, backdropColor: 'transparent' }
                }
            }
        }
    });

    // Render Side-by-Side Delta Table
    container.innerHTML = `
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
                <div class="font-bold text-indigo-950">${studentA.name}</div>
                <div class="text-2xl font-extrabold text-indigo-600 mt-1">${metricsA.percentage}%</div>
                <div class="text-xs text-indigo-700 font-semibold">Grade: ${metricsA.grade} (${metricsA.total}/500)</div>
            </div>
            <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                <div class="font-bold text-rose-950">${studentB.name}</div>
                <div class="text-2xl font-extrabold text-rose-600 mt-1">${metricsB.percentage}%</div>
                <div class="text-xs text-rose-700 font-semibold">Grade: ${metricsB.grade} (${metricsB.total}/500)</div>
            </div>
        </div>

        <div class="space-y-2">
            ${subjects.map(sub => {
                const valA = studentA.marks[sub];
                const valB = studentB.marks[sub];
                const delta = valA - valB;
                const deltaStr = delta > 0 ? `+${delta}` : `${delta}`;
                const deltaBadge = delta > 0 
                    ? `<span class="text-xs font-bold text-indigo-600">${studentA.name.split(' ')[0]} leads by ${delta}</span>`
                    : delta < 0 
                    ? `<span class="text-xs font-bold text-rose-600">${studentB.name.split(' ')[0]} leads by ${Math.abs(delta)}</span>`
                    : `<span class="text-xs font-bold text-slate-500">Tied (${valA})</span>`;

                return `
                    <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-sm">
                        <span class="font-medium text-slate-700">${sub}</span>
                        <div class="flex items-center gap-4">
                            <span class="font-bold text-indigo-600 w-8 text-right">${valA}</span>
                            <span class="text-slate-300">vs</span>
                            <span class="font-bold text-rose-600 w-8">${valB}</span>
                            <div class="w-36 text-right">${deltaBadge}</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Add student mark entry
function handleAddStudentForm(e) {
    e.preventDefault();
    const form = e.target;
    
    const newStudent = {
        id: `STU-${Date.now().toString().slice(-4)}`,
        rollNo: form.rollNo.value.trim(),
        name: form.name.value.trim(),
        department: form.department.value || "Computer Science",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(form.name.value.trim())}`,
        marks: {
            Mathematics: Math.min(100, Math.max(0, Number(form.math.value) || 0)),
            Physics: Math.min(100, Math.max(0, Number(form.physics.value) || 0)),
            Chemistry: Math.min(100, Math.max(0, Number(form.chem.value) || 0)),
            ComputerScience: Math.min(100, Math.max(0, Number(form.cs.value) || 0)),
            English: Math.min(100, Math.max(0, Number(form.english.value) || 0))
        }
    };

    performanceState.students.unshift(newStudent);
    savePerformanceData();
    renderPerformanceTable();
    updatePerformanceMetricCards();
    renderPerformanceCharts();
    populateComparisonDropdowns();
    
    form.reset();
    closeAddStudentModal();
    showToast(`Student ${newStudent.name} successfully recorded!`, 'success');
}

function deleteStudent(id) {
    if (!confirm('Are you sure you want to remove this student record?')) return;
    performanceState.students = performanceState.students.filter(s => s.id !== id);
    savePerformanceData();
    renderPerformanceTable();
    updatePerformanceMetricCards();
    renderPerformanceCharts();
    populateComparisonDropdowns();
    showToast('Student record deleted.', 'info');
}

function resetPerformanceData() {
    performanceState.students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    savePerformanceData();
    renderPerformanceTable();
    updatePerformanceMetricCards();
    renderPerformanceCharts();
    populateComparisonDropdowns();
    showToast('Student performance demo data restored!', 'success');
}

function exportPerformanceCSV() {
    const headers = ['ID,RollNo,Name,Department,Mathematics,Physics,Chemistry,ComputerScience,English,TotalMarks,Percentage,Grade,WeakSubjects'];
    const rows = performanceState.students.map(s => {
        const m = calculateStudentMetrics(s);
        const weak = m.weakSubjects.map(w => w.name).join('; ');
        return `"${s.id}","${s.rollNo}","${s.name}","${s.department}",${s.marks.Mathematics},${s.marks.Physics},${s.marks.Chemistry},${s.marks.ComputerScience},${s.marks.English},${m.total},${m.percentage},"${m.grade}","${weak}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Performance_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Performance CSV report downloaded!', 'success');
}

function setupPerformanceEventListeners() {
    const searchInput = document.getElementById('perf-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performanceState.searchQuery = e.target.value;
            renderPerformanceTable();
        });
    }

    const filterButtons = document.querySelectorAll('[data-perf-filter]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active-tab', 'bg-indigo-600', 'text-white'));
            btn.classList.add('active-tab', 'bg-indigo-600', 'text-white');
            performanceState.filter = btn.getAttribute('data-perf-filter');
            renderPerformanceTable();
        });
    });

    const compareSelectA = document.getElementById('perf-compare-student-a');
    const compareSelectB = document.getElementById('perf-compare-student-b');
    if (compareSelectA) compareSelectA.addEventListener('change', updateStudentComparison);
    if (compareSelectB) compareSelectB.addEventListener('change', updateStudentComparison);

    const form = document.getElementById('form-add-student');
    if (form) form.addEventListener('submit', handleAddStudentForm);
}

function openAddStudentModal() {
    const m = document.getElementById('modal-add-student');
    if (m) m.classList.remove('hidden');
}

function closeAddStudentModal() {
    const m = document.getElementById('modal-add-student');
    if (m) m.classList.add('hidden');
}
