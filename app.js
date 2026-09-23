/**
 * EduPulse 360 - Main Application & Presentation Deck Controller
 */

let appState = {
    currentTab: 'overview',
    currentSlideIndex: 0,
    isPresentationMode: false,
    showPresenterNotes: true
};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupTabNavigation();
    setupPresentationDeck();
    setupGlobalShortcuts();

    // Initialize individual modules
    initPerformanceModule();
    initAttendanceModule();
    initEventsModule();

    // Render initial presentation slide
    renderPresentationSlide(0);

    // Initial banner ticker
    startAnnouncementTicker();
}

// Module / Tab Navigation
function setupTabNavigation() {
    const navButtons = document.querySelectorAll('[data-tab-target]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab-target');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    appState.currentTab = tabId;

    // Update Nav Buttons
    const navButtons = document.querySelectorAll('[data-tab-target]');
    navButtons.forEach(btn => {
        const isTarget = btn.getAttribute('data-tab-target') === tabId;
        if (isTarget) {
            btn.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
            btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
        } else {
            btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
            btn.classList.add('text-slate-600', 'hover:bg-slate-100');
        }
    });

    // Update Tab Content Panels
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
        if (panel.id === `tab-${tabId}`) {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    });

    // Window scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh charts when switching to performance
    if (tabId === 'performance') {
        setTimeout(() => {
            renderPerformanceCharts();
            updateStudentComparison();
        }, 50);
    }
}

// Presentation / Pitch Deck Mode Controller
function setupPresentationDeck() {
    const modal = document.getElementById('modal-presentation-deck');
    const openBtn = document.getElementById('btn-open-presentation');
    const closeBtn = document.getElementById('btn-close-presentation');
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');
    const toggleNotesBtn = document.getElementById('btn-toggle-notes');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            appState.isPresentationMode = true;
            modal.classList.remove('hidden');
            renderPresentationSlide(appState.currentSlideIndex);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            appState.isPresentationMode = false;
            modal.classList.add('hidden');
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (appState.currentSlideIndex > 0) {
                renderPresentationSlide(appState.currentSlideIndex - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (appState.currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
                renderPresentationSlide(appState.currentSlideIndex + 1);
            }
        });
    }

    if (toggleNotesBtn) {
        toggleNotesBtn.addEventListener('click', () => {
            appState.showPresenterNotes = !appState.showPresenterNotes;
            const notesEl = document.getElementById('slide-presenter-notes');
            if (notesEl) {
                notesEl.classList.toggle('hidden', !appState.showPresenterNotes);
            }
        });
    }
}

function renderPresentationSlide(index) {
    appState.currentSlideIndex = index;
    const slide = PRESENTATION_SLIDES[index];
    if (!slide) return;

    const badgeEl = document.getElementById('slide-badge');
    const titleEl = document.getElementById('slide-title');
    const subtitleEl = document.getElementById('slide-subtitle');
    const highlightsEl = document.getElementById('slide-highlights');
    const counterEl = document.getElementById('slide-counter');
    const notesEl = document.getElementById('slide-notes-text');
    const demoActionContainer = document.getElementById('slide-demo-action');
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');

    if (badgeEl) badgeEl.innerText = slide.badge;
    if (titleEl) titleEl.innerText = slide.title;
    if (subtitleEl) subtitleEl.innerText = slide.subtitle;
    if (counterEl) counterEl.innerText = `Slide ${index + 1} of ${PRESENTATION_SLIDES.length}`;
    if (notesEl) notesEl.innerText = slide.presenterNote;

    if (highlightsEl) {
        highlightsEl.innerHTML = slide.highlights.map(h => `
            <li class="flex items-start gap-3 p-3 bg-white/50 backdrop-blur-xs rounded-xl border border-slate-200/60 shadow-2xs">
                <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <i class="fa-solid fa-check text-xs"></i>
                </div>
                <span class="text-sm font-medium text-slate-800 leading-relaxed">${h}</span>
            </li>
        `).join('');
    }

    // Demo Jump Button
    if (demoActionContainer) {
        if (slide.demoTarget) {
            demoActionContainer.innerHTML = `
                <button onclick="jumpToDemoFromSlide('${slide.demoTarget}')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center gap-2">
                    <i class="fa-solid fa-play"></i> Jump to Live Interactive Demo
                </button>
            `;
        } else {
            demoActionContainer.innerHTML = '';
        }
    }

    // Update button states
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === PRESENTATION_SLIDES.length - 1;
}

function jumpToDemoFromSlide(tabId) {
    const modal = document.getElementById('modal-presentation-deck');
    if (modal) modal.classList.add('hidden');
    appState.isPresentationMode = false;
    switchTab(tabId);
    showToast(`Switched to ${tabId.toUpperCase()} module for live demonstration!`, 'info');
}

// Global Keyboard Shortcuts
function setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (appState.isPresentationMode) {
            if (e.key === 'ArrowRight' || e.key === 'Space') {
                if (appState.currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
                    renderPresentationSlide(appState.currentSlideIndex + 1);
                }
            } else if (e.key === 'ArrowLeft') {
                if (appState.currentSlideIndex > 0) {
                    renderPresentationSlide(appState.currentSlideIndex - 1);
                }
            } else if (e.key === 'Escape') {
                const modal = document.getElementById('modal-presentation-deck');
                if (modal) modal.classList.add('hidden');
                appState.isPresentationMode = false;
            }
        }
    });
}

// Global Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('global-toast');
    const toastMsg = document.getElementById('global-toast-message');
    const toastIcon = document.getElementById('global-toast-icon');
    if (!toast || !toastMsg) return;

    const typeConfigs = {
        success: { icon: 'fa-circle-check', bg: 'bg-emerald-900/90 text-emerald-100 border-emerald-500' },
        warning: { icon: 'fa-triangle-exclamation', bg: 'bg-amber-950/90 text-amber-100 border-amber-500' },
        info: { icon: 'fa-circle-info', bg: 'bg-slate-900/90 text-slate-100 border-indigo-500' },
        error: { icon: 'fa-circle-xmark', bg: 'bg-rose-950/90 text-rose-100 border-rose-500' }
    };

    const config = typeConfigs[type] || typeConfigs.info;

    toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300 transform translate-y-0 opacity-100 ${config.bg}`;
    toastMsg.innerText = message;
    if (toastIcon) toastIcon.className = `fa-solid ${config.icon} text-base`;

    setTimeout(() => {
        toast.className = 'hidden';
    }, 3800);
}

// Reset Entire Suite Data
function resetAllDemoData() {
    if (!confirm('Reset all demo data across Performance, Attendance, and Events?')) return;
    localStorage.removeItem('edupulse_students');
    localStorage.removeItem('edupulse_attendance');
    localStorage.removeItem('edupulse_events');
    localStorage.removeItem('edupulse_notifs');

    resetPerformanceData();
    resetAttendanceData();
    resetEventsData();

    showToast('All 3 systems reset to pristine presentation demo state!', 'success');
}

// Announcement Bar Ticker
function startAnnouncementTicker() {
    const ticker = document.getElementById('header-announcement-text');
    if (!ticker) return;

    const announcements = [
        "🚨 Smart Attendance Alert: 2 students currently have attendance below 75% threshold.",
        "📊 Mid-term Performance Review: Sneha Reddy ranks #1 (93.8%) - Weak subject study plans active.",
        "🎉 HackVerse 2026: 48/60 seats registered! Last call for team signups.",
        "💡 Innovation Feature: Try the 'AI Study Advisor' button on any student with marks under 50%!"
    ];

    let currentIdx = 0;
    setInterval(() => {
        currentIdx = (currentIdx + 1) % announcements.length;
        ticker.style.opacity = '0';
        setTimeout(() => {
            ticker.innerText = announcements[currentIdx];
            ticker.style.opacity = '1';
        }, 300);
    }, 6000);
}
