/**
 * EduPulse 360 - Module 3: College Event Management System 🎉
 */

let eventState = {
    events: [],
    notifications: [],
    selectedCategory: 'all',
    selectedEventForDetails: null,
    selectedEventForPass: null
};

function initEventsModule() {
    loadEventsData();
    setupEventsEventListeners();
    renderEventCatalog();
    renderAllParticipantsTable();
    renderNotificationsCenter();
    renderUpcomingScheduleTimeline();
}

function loadEventsData() {
    const savedEvents = localStorage.getItem('edupulse_events');
    const savedNotifs = localStorage.getItem('edupulse_notifs');

    if (savedEvents) {
        try {
            eventState.events = JSON.parse(savedEvents);
        } catch (e) {
            eventState.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
        }
    } else {
        eventState.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
        saveEventsData();
    }

    if (savedNotifs) {
        try {
            eventState.notifications = JSON.parse(savedNotifs);
        } catch (e) {
            eventState.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
        }
    } else {
        eventState.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
        saveEventsData();
    }
}

function saveEventsData() {
    localStorage.setItem('edupulse_events', JSON.stringify(eventState.events));
    localStorage.setItem('edupulse_notifs', JSON.stringify(eventState.notifications));
}

// Render Event Catalog
function renderEventCatalog() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    let events = [...eventState.events];
    if (eventState.selectedCategory !== 'all') {
        events = events.filter(e => e.category.toLowerCase() === eventState.selectedCategory.toLowerCase());
    }

    if (events.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                <i class="fa-regular fa-calendar-xmark text-4xl mb-3 text-gray-400"></i>
                <p class="font-medium">No events found in this category.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = events.map(evt => {
        const isFull = evt.registeredCount >= evt.capacity;
        const fillPercentage = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));

        const categoryColors = {
            Hackathon: 'bg-purple-50 text-purple-700 border-purple-200',
            Workshop: 'bg-blue-50 text-blue-700 border-blue-200',
            Cultural: 'bg-rose-50 text-rose-700 border-rose-200',
            Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };

        const badgeClass = categoryColors[evt.category] || 'bg-slate-50 text-slate-700 border-slate-200';

        return `
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-300 overflow-hidden flex flex-col justify-between group">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <span class="px-3 py-1 text-xs font-bold rounded-full border ${badgeClass}">
                            ${evt.category}
                        </span>
                        <span class="text-xs font-semibold ${isFull ? 'text-rose-600 font-bold' : 'text-slate-500'}">
                            <i class="fa-solid fa-ticket mr-1"></i> ${evt.registeredCount} / ${evt.capacity} Booked
                        </span>
                    </div>

                    <h3 class="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition">
                        ${evt.title}
                    </h3>
                    
                    <p class="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        ${evt.description}
                    </p>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-1.5 mt-3">
                        ${evt.tags.map(t => `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">#${t}</span>`).join('')}
                    </div>

                    <!-- Event Metadata -->
                    <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-gray-600">
                        <div class="flex items-center gap-2">
                            <i class="fa-regular fa-calendar text-indigo-500 w-4"></i>
                            <span>${new Date(evt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fa-regular fa-clock text-indigo-500 w-4"></i>
                            <span>${evt.time}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-location-dot text-indigo-500 w-4"></i>
                            <span class="truncate">${evt.venue}</span>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="mt-4">
                        <div class="flex justify-between text-[11px] text-gray-500 mb-1">
                            <span>Capacity Status</span>
                            <span>${fillPercentage}%</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div class="h-1.5 rounded-full ${fillPercentage > 85 ? 'bg-amber-500' : 'bg-indigo-600'}" style="width: ${fillPercentage}%"></div>
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button onclick="openEventDetailsModal('${evt.id}')" class="text-xs font-semibold text-gray-700 hover:text-indigo-600 transition flex items-center gap-1">
                        <i class="fa-regular fa-eye"></i> View Schedule
                    </button>

                    <button onclick="openEventRegistrationModal('${evt.id}')" ${isFull ? 'disabled' : ''} class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
                        isFull 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                    }">
                        <i class="fa-solid fa-bolt text-amber-300"></i> ${isFull ? 'Sold Out' : 'Register Now'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Render Global Participant Table
function renderAllParticipantsTable() {
    const tbody = document.getElementById('events-participants-tbody');
    if (!tbody) return;

    let allParticipants = [];
    eventState.events.forEach(evt => {
        if (evt.participants && evt.participants.length > 0) {
            evt.participants.forEach(p => {
                allParticipants.push({
                    ...p,
                    eventTitle: evt.title,
                    eventId: evt.id,
                    eventCategory: evt.category,
                    eventDate: evt.date
                });
            });
        }
    });

    if (allParticipants.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-8 text-gray-400">
                    <i class="fa-solid fa-users-slash text-3xl mb-2"></i>
                    <p class="text-sm">No registrations recorded yet.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = allParticipants.map(p => `
        <tr class="hover:bg-slate-50/80 transition-colors border-b border-gray-100">
            <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-semibold text-gray-900">${p.name}</div>
                <div class="text-xs text-gray-500 font-mono">${p.rollNo}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                ${p.email}
            </td>
            <td class="px-4 py-3">
                <span class="font-medium text-gray-800 text-xs">${p.eventTitle}</span>
            </td>
            <td class="px-4 py-3 text-center">
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                    ${p.team || 'Solo'}
                </span>
            </td>
            <td class="px-4 py-3 text-center text-xs text-gray-500">
                ${p.registeredAt || '2026-09-06'}
            </td>
            <td class="px-4 py-3 text-right">
                <button onclick="generateDigitalPass('${p.eventId}', '${encodeURIComponent(p.name)}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition border border-indigo-200">
                    <i class="fa-solid fa-id-badge"></i> E-Pass
                </button>
            </td>
        </tr>
    `).join('');
}

// Render Schedule Timeline
function renderUpcomingScheduleTimeline() {
    const container = document.getElementById('events-timeline-container');
    if (!container) return;

    // Pick top events with schedules
    const scheduledEvents = eventState.events.filter(e => e.schedule && e.schedule.length > 0);

    container.innerHTML = scheduledEvents.map(evt => `
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                    <h4 class="font-bold text-gray-900">${evt.title}</h4>
                    <div class="text-xs text-indigo-600 font-medium">${evt.venue} • ${evt.date}</div>
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    ${evt.schedule.length} Agenda Items
                </span>
            </div>

            <div class="relative border-l-2 border-indigo-200 ml-3 space-y-4 py-1">
                ${evt.schedule.map(item => `
                    <div class="relative pl-6">
                        <div class="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50"></div>
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <span class="font-bold text-xs text-gray-900">${item.title}</span>
                            <span class="text-[11px] font-mono font-semibold text-indigo-600 mt-0.5 sm:mt-0">${item.time}</span>
                        </div>
                        <div class="text-xs text-gray-500 mt-0.5">
                            <i class="fa-solid fa-map-pin text-[10px] text-slate-400 mr-1"></i>${item.location}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Render Notifications
function renderNotificationsCenter() {
    const list = document.getElementById('notifications-list');
    const badge = document.getElementById('notifications-count-badge');
    if (!list) return;

    if (badge) badge.innerText = eventState.notifications.length;

    list.innerHTML = eventState.notifications.map(n => {
        const typeIcons = {
            warning: 'fa-triangle-exclamation text-amber-500 bg-amber-50',
            urgent: 'fa-fire-flame-curved text-rose-500 bg-rose-50',
            info: 'fa-circle-info text-blue-500 bg-blue-50',
            success: 'fa-circle-check text-emerald-500 bg-emerald-50'
        };

        return `
            <div class="p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 transition shadow-xs flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeIcons[n.type] || 'fa-bell text-slate-400 bg-slate-50'}">
                    <i class="fa-solid ${typeIcons[n.type].split(' ')[0]}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                        <h5 class="text-xs font-bold text-gray-900 truncate">${n.title}</h5>
                        <span class="text-[10px] text-gray-400">${n.time}</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1 leading-normal">${n.message}</p>
                </div>
            </div>
        `;
    }).join('');
}

// 🎫 Innovation: Digital Event Pass Generator
function generateDigitalPass(eventId, encodedStudentName) {
    const studentName = decodeURIComponent(encodedStudentName);
    const evt = eventState.events.find(e => e.id === eventId);
    if (!evt) return;

    const modal = document.getElementById('modal-event-pass');
    const container = document.getElementById('event-pass-container');
    if (!modal || !container) return;

    const ticketNo = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    container.innerHTML = `
        <div class="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-indigo-700/50">
            <!-- Decorative ticket notch circles -->
            <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-r border-indigo-700"></div>
            <div class="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-l border-indigo-700"></div>

            <div class="flex items-center justify-between border-b border-indigo-700/60 pb-4 mb-4">
                <div>
                    <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                        OFFICIAL DIGITAL ADMIT PASS
                    </span>
                    <h3 class="text-xl font-black mt-1 text-white tracking-tight">${evt.title}</h3>
                </div>
                <div class="text-right">
                    <div class="text-[10px] text-indigo-300 uppercase tracking-widest">TICKET ID</div>
                    <div class="font-mono font-bold text-sm text-amber-300">${ticketNo}</div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs mb-5">
                <div>
                    <div class="text-slate-400 text-[11px]">STUDENT ATTENDEE</div>
                    <div class="font-bold text-sm text-white mt-0.5">${studentName}</div>
                </div>
                <div>
                    <div class="text-slate-400 text-[11px]">EVENT CATEGORY</div>
                    <div class="font-bold text-sm text-indigo-300 mt-0.5">${evt.category}</div>
                </div>
                <div>
                    <div class="text-slate-400 text-[11px]">DATE & TIME</div>
                    <div class="font-medium text-white mt-0.5">${evt.date} • ${evt.time}</div>
                </div>
                <div>
                    <div class="text-slate-400 text-[11px]">VENUE</div>
                    <div class="font-medium text-white mt-0.5 truncate">${evt.venue}</div>
                </div>
            </div>

            <!-- QR Code Simulation -->
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-14 h-14 bg-white rounded-xl p-1 shadow-sm flex items-center justify-center">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticketNo + '-' + studentName)}" alt="Ticket QR" class="w-full h-full">
                    </div>
                    <div>
                        <div class="text-xs font-bold text-white">Scan for Fast-Track Entry</div>
                        <div class="text-[10px] text-indigo-200">Admit One • Non-Transferable</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold">
                        <i class="fa-solid fa-circle-check"></i> VERIFIED
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeEventPassModal() {
    const modal = document.getElementById('modal-event-pass');
    if (modal) modal.classList.add('hidden');
}

function openEventDetailsModal(eventId) {
    const evt = eventState.events.find(e => e.id === eventId);
    if (!evt) return;

    const modal = document.getElementById('modal-event-details');
    const container = document.getElementById('event-details-content');
    if (!modal || !container) return;

    container.innerHTML = `
        <div>
            <div class="flex items-center justify-between mb-3">
                <span class="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    ${evt.category}
                </span>
                <span class="text-xs text-gray-500 font-medium">Capacity: ${evt.registeredCount} / ${evt.capacity}</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900">${evt.title}</h3>
            <p class="text-sm text-gray-600 mt-2">${evt.description}</p>

            <div class="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div><strong>Date:</strong> ${evt.date}</div>
                <div><strong>Time:</strong> ${evt.time}</div>
                <div class="col-span-2"><strong>Venue:</strong> ${evt.venue}</div>
            </div>

            <h4 class="font-bold text-sm text-gray-900 mb-3">Event Schedule Agenda:</h4>
            <div class="space-y-2">
                ${(evt.schedule || []).map(s => `
                    <div class="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-center justify-between text-xs">
                        <div>
                            <span class="font-bold text-indigo-950">${s.title}</span>
                            <div class="text-slate-500 text-[11px]">${s.location}</div>
                        </div>
                        <span class="font-mono font-semibold text-indigo-600">${s.time}</span>
                    </div>
                `).join('')}
            </div>

            <div class="mt-6 flex justify-end">
                <button onclick="closeEventDetailsModal(); openEventRegistrationModal('${evt.id}');" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition">
                    Proceed to Registration
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeEventDetailsModal() {
    const modal = document.getElementById('modal-event-details');
    if (modal) modal.classList.add('hidden');
}

function openEventRegistrationModal(eventId) {
    const evt = eventState.events.find(e => e.id === eventId);
    if (!evt) return;

    const modal = document.getElementById('modal-event-register');
    const eventIdInput = document.getElementById('reg-event-id');
    const eventTitleEl = document.getElementById('reg-event-title');
    if (!modal || !eventIdInput) return;

    eventIdInput.value = evt.id;
    if (eventTitleEl) eventTitleEl.innerText = `Registering for: ${evt.title}`;

    modal.classList.remove('hidden');
}

function closeEventRegistrationModal() {
    const modal = document.getElementById('modal-event-register');
    if (modal) modal.classList.add('hidden');
}

function handleEventRegistrationForm(e) {
    e.preventDefault();
    const form = e.target;
    const eventId = form.eventId.value;
    const evt = eventState.events.find(e => e.id === eventId);
    if (!evt) return;

    if (evt.registeredCount >= evt.capacity) {
        alert('Sorry, this event is already at full capacity!');
        return;
    }

    const participant = {
        name: form.studentName.value.trim(),
        rollNo: form.rollNo.value.trim(),
        email: form.email.value.trim(),
        team: form.team.value.trim() || 'Solo',
        registeredAt: new Date().toISOString().slice(0, 10)
    };

    if (!evt.participants) evt.participants = [];
    evt.participants.push(participant);
    evt.registeredCount++;

    saveEventsData();
    renderEventCatalog();
    renderAllParticipantsTable();

    // Trigger celebration confetti
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    form.reset();
    closeEventRegistrationModal();
    showToast(`Registration confirmed for ${participant.name}!`, 'success');

    // Auto open digital pass
    generateDigitalPass(evt.id, encodeURIComponent(participant.name));
}

function setupEventsEventListeners() {
    const categoryBtns = document.querySelectorAll('[data-event-category]');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active-tab', 'bg-indigo-600', 'text-white'));
            btn.classList.add('active-tab', 'bg-indigo-600', 'text-white');
            eventState.selectedCategory = btn.getAttribute('data-event-category');
            renderEventCatalog();
        });
    });

    const regForm = document.getElementById('form-register-event');
    if (regForm) regForm.addEventListener('submit', handleEventRegistrationForm);
}

function resetEventsData() {
    eventState.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
    eventState.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
    saveEventsData();
    renderEventCatalog();
    renderAllParticipantsTable();
    renderNotificationsCenter();
    renderUpcomingScheduleTimeline();
    showToast('Campus event demo data restored!', 'success');
}
