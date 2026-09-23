/**
 * EduPulse 360 - Initial Preloaded Data & Improvement Rules
 */

const DEFAULT_STUDENTS = [
    {
        id: "STU-101",
        rollNo: "CS2026-01",
        name: "Sneha Reddy",
        department: "Computer Science",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        marks: {
            Mathematics: 94,
            Physics: 88,
            Chemistry: 91,
            ComputerScience: 98,
            English: 92
        }
    },
    {
        id: "STU-102",
        rollNo: "CS2026-02",
        name: "Aarav Sharma",
        department: "Computer Science",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        marks: {
            Mathematics: 85,
            Physics: 79,
            Chemistry: 82,
            ComputerScience: 90,
            English: 86
        }
    },
    {
        id: "STU-103",
        rollNo: "CS2026-03",
        name: "Priya Nair",
        department: "Computer Science",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        marks: {
            Mathematics: 76,
            Physics: 84,
            Chemistry: 78,
            ComputerScience: 88,
            English: 80
        }
    },
    {
        id: "STU-104",
        rollNo: "CS2026-04",
        name: "Rahul Verma",
        department: "Computer Science",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        marks: {
            Mathematics: 52,
            Physics: 44, // Weak (<50)
            Chemistry: 58,
            ComputerScience: 72,
            English: 65
        }
    },
    {
        id: "STU-105",
        rollNo: "CS2026-05",
        name: "Arjun Patel",
        department: "Computer Science",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        marks: {
            Mathematics: 38, // Weak (<50)
            Physics: 48, // Weak (<50)
            Chemistry: 42, // Weak (<50)
            ComputerScience: 65,
            English: 55
        }
    },
    {
        id: "STU-106",
        rollNo: "CS2026-06",
        name: "Ananya Iyer",
        department: "Computer Science",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        marks: {
            Mathematics: 89,
            Physics: 92,
            Chemistry: 87,
            ComputerScience: 95,
            English: 90
        }
    },
    {
        id: "STU-107",
        rollNo: "CS2026-07",
        name: "Vikram Malhotra",
        department: "Computer Science",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        marks: {
            Mathematics: 68,
            Physics: 60,
            Chemistry: 48, // Weak (<50)
            ComputerScience: 78,
            English: 70
        }
    }
];

const SUBJECT_IMPROVEMENT_SUGGESTIONS = {
    Mathematics: {
        icon: "fa-square-root-variable",
        color: "indigo",
        diagnostics: "Struggling with problem abstraction, formula recall, and step-by-step calculus/linear algebra derivations.",
        actionPlan: [
            "Dedicate 30 minutes daily to solving 5 foundational derivation drills without consulting formula sheets.",
            "Utilize graphical visualizers (Desmos/GeoGebra) to build intuitive understanding of functions and limits.",
            "Attend Professor's weekly Math Clinic on Thursdays (3:30 PM, Hall B).",
            "Pair up with peer study partner (Sneha Reddy) for weekly calculus problem-solving sprints."
        ],
        curatedResources: [
            { title: "3Blue1Brown - Essence of Calculus", type: "Video Series", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" },
            { title: "Paul's Online Math Notes", type: "Cheat Sheet & Drills", link: "https://tutorial.math.lamar.edu/" },
            { title: "Khan Academy Advanced Algebra", type: "Interactive Practice", link: "https://www.khanacademy.org/math" }
        ]
    },
    Physics: {
        icon: "fa-atom",
        color: "sky",
        diagnostics: "Conceptual gaps between theoretical equations and physical free-body/electromagnetic circuit diagrams.",
        actionPlan: [
            "Draw clear Free-Body Diagrams (FBD) before writing numerical formulas for any mechanics question.",
            "Review SI unit conversions and dimensional analysis to self-check derivation accuracy.",
            "Conduct virtual simulation experiments using PhET Interactive Simulations for wave optics and electromagnetism.",
            "Review solved university mid-term papers from the last 3 semesters."
        ],
        curatedResources: [
            { title: "PhET Interactive Physics Labs", type: "Interactive Lab", link: "https://phet.colorado.edu/" },
            { title: "Feynman Lectures on Physics (Free Online)", type: "Reading", link: "https://www.feynmanlectures.caltech.edu/" },
            { title: "CrashCourse Physics Series", type: "Video Summary", link: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtN0ge7qc3tVwQjyTQb4f56t" }
        ]
    },
    Chemistry: {
        icon: "fa-flask",
        color: "emerald",
        diagnostics: "Difficulty with organic reaction mechanisms, stoichiometry equations, and electrochemistry balance.",
        actionPlan: [
            "Create a visual mind-map for Organic Conversion Mechanisms and functional group reagents.",
            "Practice stoichiometry and mole calculation balancing for 20 minutes every alternate day.",
            "Focus on high-yield chapters: Chemical Kinetics and Coordination Compounds.",
            "Form a 3-member revision group to quiz each other on periodic trends and catalyst properties."
        ],
        curatedResources: [
            { title: "Master Organic Chemistry Guide", type: "Study Guide", link: "https://www.masterorganicchemistry.com/" },
            { title: "Tyler DeWitt Chemistry Lessons", type: "Video Tutorials", link: "https://www.youtube.com/c/TylerDeWitt" },
            { title: "PubChem Interactive Molecule Explorer", type: "3D Visualizer", link: "https://pubchem.ncbi.nlm.nih.gov/" }
        ]
    },
    ComputerScience: {
        icon: "fa-laptop-code",
        color: "purple",
        diagnostics: "Weak grasp of algorithmic time complexity, recursive call stacks, and pointer/reference manipulation.",
        actionPlan: [
            "Trace code execution manually on paper before running in the IDE (dry-run debugging).",
            "Solve 1 LeetCode/HackerRank Easy problem every weekday focusing on Array and String patterns.",
            "Review visualizer tools like VisuAlgo for Sorting and Binary Search Trees.",
            "Join the campus CodeClub bi-weekly coding jams on Saturday mornings."
        ],
        curatedResources: [
            { title: "VisuAlgo - Visualising Data Structures", type: "Interactive Tool", link: "https://visualgo.net/en" },
            { title: "NeetCode Roadmap & Problem Explanations", type: "Roadmap", link: "https://neetcode.io/" },
            { title: "CS50 Introduction to Computer Science", type: "Comprehensive Course", link: "https://cs50.harvard.edu/" }
        ]
    },
    English: {
        icon: "fa-book-open",
        color: "amber",
        diagnostics: "Struggles with technical report structuring, vocabulary precision, and formal academic syntax.",
        actionPlan: [
            "Write a 150-word daily technical summary of an IEEE or TechCrunch article to build sentence fluency.",
            "Practice peer-reviewing technical lab reports using grammar checkers and rubric sheets.",
            "Engage actively in verbal presentation rounds during class seminars.",
            "Read 15 minutes of non-fiction technical writing before bedtime."
        ],
        curatedResources: [
            { title: "Purdue Online Writing Lab (OWL)", type: "Reference Guide", link: "https://owl.purdue.edu/" },
            { title: "BBC Learning English - Advanced Grammar", type: "Exercises", link: "https://www.bbc.co.uk/learningenglish/" },
            { title: "TED Talks Technical Communication Playlist", type: "Speech Videos", link: "https://www.ted.com/topics/communication" }
        ]
    }
};

const DEFAULT_ATTENDANCE = [
    {
        studentId: "STU-101",
        rollNo: "CS2026-01",
        name: "Sneha Reddy",
        department: "Computer Science",
        attended: 38,
        total: 40,
        statusToday: "Present"
    },
    {
        studentId: "STU-102",
        rollNo: "CS2026-02",
        name: "Aarav Sharma",
        department: "Computer Science",
        attended: 35,
        total: 40,
        statusToday: "Present"
    },
    {
        studentId: "STU-103",
        rollNo: "CS2026-03",
        name: "Priya Nair",
        department: "Computer Science",
        attended: 33,
        total: 40,
        statusToday: "Present"
    },
    {
        studentId: "STU-104",
        rollNo: "CS2026-04",
        name: "Rahul Verma",
        department: "Computer Science",
        attended: 27, // 27/40 = 67.5% (<75% DEFAULTER)
        total: 40,
        statusToday: "Absent"
    },
    {
        studentId: "STU-105",
        rollNo: "CS2026-05",
        name: "Arjun Patel",
        department: "Computer Science",
        attended: 24, // 24/40 = 60.0% (<75% CRITICAL DEFAULTER)
        total: 40,
        statusToday: "Absent"
    },
    {
        studentId: "STU-106",
        rollNo: "CS2026-06",
        name: "Ananya Iyer",
        department: "Computer Science",
        attended: 39,
        total: 40,
        statusToday: "Present"
    },
    {
        studentId: "STU-107",
        rollNo: "CS2026-07",
        name: "Vikram Malhotra",
        department: "Computer Science",
        attended: 29, // 29/40 = 72.5% (<75% WARNING DEFAULTER)
        total: 40,
        statusToday: "Present"
    }
];

const DEFAULT_EVENTS = [
    {
        id: "EVT-201",
        title: "HackVerse 2026 - 24hr Campus Hackathon",
        category: "Hackathon",
        badgeColor: "purple",
        date: "2026-09-18",
        time: "09:00 AM - 09:00 AM (Next Day)",
        venue: "Innovation Hub, Block C",
        capacity: 60,
        registeredCount: 48,
        description: "An intensive 24-hour hackathon challenging students to build AI, Web3, and Sustainability tech prototypes with ₹50,000 in cash prizes.",
        tags: ["AI/ML", "Web Dev", "Prizes", "Free Food"],
        schedule: [
            { time: "09:00 AM", title: "Check-in & Breakfast", location: "Hub Lounge" },
            { time: "10:30 AM", title: "Problem Statements Reveal & Keynote", location: "Auditorium A" },
            { time: "11:00 AM", title: "Hacking Commences", location: "Hacker Arena" },
            { time: "08:00 PM", title: "Mentorship Round 1", location: "Online / In-Person" },
            { time: "09:00 AM (Day 2)", title: "Final Pitch & Demo to Judges", location: "Auditorium A" }
        ],
        participants: [
            { name: "Sneha Reddy", rollNo: "CS2026-01", email: "sneha@campus.edu", team: "ByteBusters", registeredAt: "2026-09-02" },
            { name: "Aarav Sharma", rollNo: "CS2026-02", email: "aarav@campus.edu", team: "ByteBusters", registeredAt: "2026-09-02" },
            { name: "Priya Nair", rollNo: "CS2026-03", email: "priya@campus.edu", team: "CodeNova", registeredAt: "2026-09-03" },
            { name: "Vikram Malhotra", rollNo: "CS2026-07", email: "vikram@campus.edu", team: "DevCrafters", registeredAt: "2026-09-04" }
        ]
    },
    {
        id: "EVT-202",
        title: "TechPulse: GenAI & LLM Architecture Workshop",
        category: "Workshop",
        badgeColor: "blue",
        date: "2026-09-22",
        time: "02:00 PM - 05:00 PM",
        venue: "Seminar Hall 2, Dept of CS",
        capacity: 40,
        registeredCount: 38,
        description: "Hands-on masterclass on building Retrieval-Augmented Generation (RAG) agents using open-source models, vector databases, and Python.",
        tags: ["GenAI", "Hands-on", "Certificate"],
        schedule: [
            { time: "02:00 PM", title: "Foundations of Transformers & Embeddings", location: "Seminar Hall 2" },
            { time: "03:15 PM", title: "Hands-on: Building your first RAG Pipeline", location: "Lab 4" },
            { time: "04:30 PM", title: "Q&A, Project Review & Certifications", location: "Seminar Hall 2" }
        ],
        participants: [
            { name: "Ananya Iyer", rollNo: "CS2026-06", email: "ananya@campus.edu", team: "Solo", registeredAt: "2026-09-05" },
            { name: "Rahul Verma", rollNo: "CS2026-04", email: "rahul@campus.edu", team: "Solo", registeredAt: "2026-09-06" }
        ]
    },
    {
        id: "EVT-203",
        title: "Tarangini 2026 - Annual Cultural Fest",
        category: "Cultural",
        badgeColor: "rose",
        date: "2026-09-28",
        time: "04:00 PM - 10:00 PM",
        venue: "Open Air Amphitheatre",
        capacity: 500,
        registeredCount: 342,
        description: "The biggest music, dance, theatrical drama, and battle of the bands showcase of the academic year featuring celebrity guest performers.",
        tags: ["Music", "Dance", "Food Stalls", "Celebrity Night"],
        schedule: [
            { time: "04:00 PM", title: "Classical & Fusion Dance Showcase", location: "Amphitheatre Stage" },
            { time: "06:00 PM", title: "Inter-College Battle of the Bands", location: "Main Stage" },
            { time: "08:30 PM", title: "Headline Concert & DJ Night", location: "Main Ground" }
        ],
        participants: [
            { name: "Sneha Reddy", rollNo: "CS2026-01", email: "sneha@campus.edu", team: "Solo", registeredAt: "2026-09-01" },
            { name: "Arjun Patel", rollNo: "CS2026-05", email: "arjun@campus.edu", team: "Solo", registeredAt: "2026-09-03" }
        ]
    },
    {
        id: "EVT-204",
        title: "Inter-Department Cricket & Futsal Trophy",
        category: "Sports",
        badgeColor: "emerald",
        date: "2026-10-02",
        time: "08:00 AM - 06:00 PM",
        venue: "University Sports Arena",
        capacity: 100,
        registeredCount: 82,
        description: "Annual sports tournament pitting Engineering, Science, Management, and Humanities departments for the prestigious Chancellor's Cup.",
        tags: ["Cricket", "Futsal", "Trophy", "Athletics"],
        schedule: [
            { time: "08:00 AM", title: "Opening March Past & Torch Ceremony", location: "Central Track" },
            { time: "09:30 AM", title: "Quarter-Finals: Futsal & Cricket", location: "Grounds 1 & 2" },
            { time: "03:30 PM", title: "Grand Finals & Trophy Presentation", location: "Main Pavilion" }
        ],
        participants: [
            { name: "Rahul Verma", rollNo: "CS2026-04", email: "rahul@campus.edu", team: "CS Warriors", registeredAt: "2026-09-05" },
            { name: "Vikram Malhotra", rollNo: "CS2026-07", email: "vikram@campus.edu", team: "CS Warriors", registeredAt: "2026-09-06" }
        ]
    }
];

const DEFAULT_NOTIFICATIONS = [
    {
        id: "NOTIF-1",
        title: "⚠️ Attendance Defaulter Warning Notice",
        message: "Students with attendance below 75% must meet their academic counselors before mid-semester exams to restore eligibility.",
        type: "warning",
        time: "10 mins ago",
        category: "Attendance"
    },
    {
        id: "NOTIF-2",
        title: "🚀 HackVerse 2026 Registrations Closing Soon",
        message: "Only 12 seats remaining for the 24-hour campus hackathon. Register your teams before midnight!",
        type: "urgent",
        time: "1 hour ago",
        category: "Events"
    },
    {
        id: "NOTIF-3",
        title: "📊 Mid-Term Marks Published & Diagnostic Open",
        message: "Computer Science Dept mid-term results are published. Personalized subject recovery plans are now active.",
        type: "info",
        time: "3 hours ago",
        category: "Performance"
    },
    {
        id: "NOTIF-4",
        title: "💡 Special Math Mentorship Clinic Announced",
        message: "Prof. Raghavan is conducting special remedial sessions every Thursday 3:30 PM in Hall B for Calculus & Linear Algebra.",
        type: "success",
        time: "Yesterday",
        category: "Academics"
    }
];

const PRESENTATION_SLIDES = [
    {
        slideNo: 1,
        badge: "PROJECT OVERVIEW & EXECUTIVE SUMMARY",
        title: "Smart Campus Suite: EduPulse 360",
        subtitle: "A Unified Academic Intelligence, Real-time Attendance & Campus Engagement Platform",
        presenterNote: "Welcome judges and faculty! Today we present EduPulse 360, a unified solution solving three of the most critical daily challenges faced in higher education: academic performance diagnosis, attendance compliance, and event engagement.",
        highlights: [
            "1️⃣ Student Performance Analysis System with automated weak-subject diagnosis & recovery roadmaps",
            "2️⃣ Smart Attendance Tracker with live <75% debarment alerts & Safe Harbor class calculators",
            "3️⃣ College Event Hub with instant ticket pass generator, live schedules & broadcast alerts",
            "Built purely with HTML5, CSS3, Modern JavaScript & Chart.js — zero setup, 100% offline capable"
        ],
        icon: "fa-graduation-cap",
        color: "indigo"
    },
    {
        slideNo: 2,
        badge: "PROBLEM 1: PERFORMANCE DIAGNOSTICS",
        title: "1️⃣ Student Performance Analysis System",
        subtitle: "Moving beyond static scorecards to actionable academic intervention",
        presenterNote: "Problem: Teachers spend hours manually spotting struggling students across multiple subjects. Our solution computes percentages, instant rankings, highest/lowest scores, and visualizes individual vs class benchmarks via interactive Chart.js charts.",
        highlights: [
            "Automatic calculations: Total marks (out of 500), exact percentage, grade tiers (A+, A, B, C, F)",
            "Dynamic highest/lowest score spotlights across the entire student batch",
            "Interactive Visualizations: Class distribution bar chart & multi-subject radar benchmark",
            "💡 Innovation Challenge: AI-style Weak Subject Diagnostic with targeted recovery drills, curated resources, and peer-mentorship matching"
        ],
        icon: "fa-chart-pie",
        color: "blue",
        demoTarget: "performance"
    },
    {
        slideNo: 3,
        badge: "PROBLEM 2: ATTENDANCE & DEFAULTER MANAGEMENT",
        title: "2️⃣ Smart Attendance Management System",
        subtitle: "Combating classroom time waste & eliminating attendance debarment surprises",
        presenterNote: "Problem: Manual roll-calls consume 10-15 minutes per lecture, and students are often surprised at the end of the semester when debarred from exams due to low attendance.",
        highlights: [
            "Rapid 1-click attendance marking with real-time percentage computation",
            "Instant categorization of Present, Absent, and critical Defaulter records",
            "⚠️ Innovation Challenge: Prominent alert warning 'Your attendance is below 75%'",
            "Safe Harbor Calculator: Mathematically computes exact consecutive lectures needed to cross 75%",
            "Printable/Exportable Official Defaulter Warning Notice for parents and administration"
        ],
        icon: "fa-clipboard-user",
        color: "emerald",
        demoTarget: "attendance"
    },
    {
        slideNo: 4,
        badge: "PROBLEM 3: CAMPUS EVENT LIFECYCLE",
        title: "3️⃣ College Event Management System",
        subtitle: "Centralizing event discovery, registrations, ticketing & broadcast updates",
        presenterNote: "Problem: Fragmented Google Forms and WhatsApp groups cause confusion, missed registration deadlines, and chaotic venue check-ins during college fests.",
        highlights: [
            "Category-based event catalog (Hackathons, Workshops, Cultural, Sports) with live seat counters",
            "Frictionless student registration modal with instant pass generation",
            "🎫 Digital QR Event Pass: Ready-to-print/save passes with unique booking IDs and verification QR",
            "Hour-by-hour interactive schedule timeline & live campus notification broadcaster"
        ],
        icon: "fa-calendar-check",
        color: "purple",
        demoTarget: "events"
    },
    {
        slideNo: 5,
        badge: "SUMMARY & INNOVATION MATRIX",
        title: "Innovation Matrix & Technical Architecture",
        subtitle: "Engineered for speed, zero-friction adoption, and measurable academic impact",
        presenterNote: "In summary, EduPulse 360 demonstrates complete end-to-end functionality across all three requirements, solving the requested innovation challenges with practical, high-value tools.",
        highlights: [
            "Client-Side Performance: Sub-second load times, pure vanilla ES6+ with zero framework bloat",
            "Data Resilience: LocalStorage persistence with instant 'Reset Sample Data' for flawless live demos",
            "Export Capabilities: CSV export for performance records, PDF/Print view for attendance notices & event passes",
            "Fully Responsive Design: Seamlessly functions on mobile phones, tablets, smartboards, and projector screens"
        ],
        icon: "fa-award",
        color: "amber"
    }
];
