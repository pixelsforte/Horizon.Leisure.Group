import {
  ChallengeItem,
  ServiceItem,
  PartnershipModel,
  DifferencePillar,
  DirectorProfile,
  TeamMember,
  EventTab,
  ClientLogo,
  Testimonial,
  FAQItem
} from "./types";
export const CHALLENGE_ITEMS: ChallengeItem[] = [
  {
    number: "01",
    text: "✨ Nikkah Ceremony"
  },
  {
    number: "02",
    text: "💍 Engagement"
  },
  {
    number: "03",
    text: "🎉 Birthday Party"
  },
  {
    number: "04",
    text: "🌸 Mehndi Event"
  },
  {
    number: "05",
    text: "🎂 Anniversary"
  },
  {
    number: "06",
    text: "👨‍👩‍👧 Family Gathering"
  },
  {
    number: "07",
    text: "🏢 Corporate Event"
  },
  {
    number: "08",
    text: "🤝 Matrimonial Event"
  },
  {
    number: "09",
    text: "🎓 Graduation Celebration"
  },
  {
    number: "10",
    text: "📸 Photoshoot or Private Event"
  }
];

export const SERVICE_ITEMS: ServiceItem[] = [
  {
    id: "01",
    title: "Complete Sales Strategy & Execution",
    description: "We build your entire sales engine from the ground up — strategy, team structure, scripts, targets, and daily execution.",
    imageUrl: "/images/service1.jpg"
  },
  {
    id: "02",
    title: "Marketing & Lead Generation",
    description: "From digital campaigns to local outreach, we create a consistent pipeline of qualified prospects who are ready to become members.",
    imageUrl: "/images/service2.jpg"
  },
  {
    id: "03",
    title: "Staff Training & KPI Implementation",
    description: "Transform your team into high-performers with structured training programs and measurable performance metrics.",
    darkTheme: true
  },
  {
    id: "04",
    title: "Financial Planning & Cost Control",
    description: "Clear budgeting, expense optimization, and transparent financial reporting that gives you complete visibility.",
    darkTheme: true
  },
  {
    id: "05",
    title: "Full Operational Management",
    description: "We handle the day-to-day operations so you can focus on growth — or simply enjoy the returns.",
    darkTheme: true
  }
];

export const PARTNERSHIP_MODELS: PartnershipModel[] = [
  {
    id: "model-1",
    modelNumber: "MODEL ONE",
    title: "Sales Sharing",
    percentage: "25%",
    subtitle: "SHARE ON SALES",
    bullets: [
      "Horizon manages all sales & marketing",
      "Revenue shared at 25% on total sales",
      "Full transparent financial reporting",
      "Performance-based growth strategy"
    ]
  },
  {
    id: "model-2",
    modelNumber: "MODEL TWO",
    title: "Lease Model",
    percentage: "FIXED",
    badge: "MOST POPULAR",
    subtitle: "MONTHLY LEASE",
    bullets: [
      "Horizon pays a fixed monthly lease amount",
      "Complete operational responsibility on Horizon",
      "Guaranteed fixed income for the property owner",
      "All growth risks fully managed by Horizon"
    ]
  },
  {
    id: "model-3",
    modelNumber: "MODEL THREE",
    title: "Profit Sharing",
    percentage: "35%",
    subtitle: "SHARE ON PROFIT",
    bullets: [
      "No fixed lease commitment required",
      "Profit sharing on mutually agreed percentage",
      "Significantly lower financial risk for owner",
      "High Horizon incentive to maximize sales growth"
    ]
  }
];

export const DIFFERENCE_PILLARS: DifferencePillar[] = [
  {
    number: "01 / 04",
    title: "Proven Sales Expansion Strategy",
    description: "Frameworks refined over 25 years across Pakistan's most competitive leisure markets."
  },
  {
    number: "02 / 04",
    title: "Professional Management Systems",
    description: "Structured processes, daily KPI tracking, and operational systems that deliver consistent, measurable results."
  },
  {
    number: "03 / 04",
    title: "Transparent Financial Structure",
    description: "Clear, auditable monthly reporting. No hidden fees. No ambiguity. You always know exactly where you stand."
  },
  {
    number: "04 / 04",
    title: "Growth-Oriented Partnership",
    description: "We succeed only when you succeed. Every model we offer is built to perfectly align our incentives with yours."
  }
];

export const DIRECTORS: DirectorProfile[] = [
  {
    name: "Muhammad Amin ud Din",
    title: "CHIEF EXECUTIVE OFFICER",
    imageUrl: "/images/director1.jpg",
    experience: [
      { role: "CEO", company: "Ultimate Marketing Solutions (Pvt) Ltd", years: "2021-Present" },
      { role: "CEO", company: "Pakistan Tracker & Services (Pvt) Ltd", years: "2018-Present" },
      { role: "CEO", company: "Turk Station", years: "2020-Present" },
      { role: "GM", company: "Joyland & AA Joyland", years: "2013-Present" }
    ]
  },
  {
    name: "Col. Amir Shakeel",
    title: "GROUP DIRECTOR",
    imageUrl: "/images/director2.jpg",
    experience: [
      { role: "MILITARY", company: "Pakistan Army - Served", years: "1983-2013" },
      { role: "DIRECTOR", company: "Admin & Security, City School System", years: "2012-2013" },
      { role: "DIRECTOR", company: "DHA Services, Golf Club, Creek Club", years: "2014-2017" },
      { role: "DIRECTOR", company: "AA Joyland", years: "2017-2021" },
      { role: "DIRECTOR", company: "Ramada Hotel", years: "2023-2024" }
    ]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Sana Malik",
    role: "HEAD OF OPERATIONS",
    imageUrl: "/images/team1.jpg",
    description: "Over 12 years directing leisure facility operations across Pakistan's most prestigious establishments.",
    tags: ["CLUB MANAGEMENT", "PROCESS OPTIMISATION", "STAFF DEVELOPMENT"]
  },
  {
    name: "Usman Tariq",
    role: "DIRECTOR OF FINANCE",
    imageUrl: "/images/team2.jpg",
    description: "A CFA charterholder with deep expertise in hospitality-sector financial structuring and P&L management.",
    tags: ["REVENUE STRATEGY", "BUDGET ARCHITECTURE", "FINANCIAL MODELLING"]
  },
  {
    name: "Ayesha Rauf",
    role: "HEAD OF MEMBER EXPERIENCE",
    imageUrl: "/images/team3.jpg",
    description: "Crafting world-class member journeys that transform clubs into communities of distinction.",
    tags: ["GUEST RELATIONS", "LOYALTY PROGRAMMES", "BRAND ELEVATION"]
  },
  {
    name: "Bilal Hussain",
    role: "TECHNICAL & INFRASTRUCTURE LEAD",
    imageUrl: "/images/team4.jpg",
    description: "Ensuring every square metre of your facility performs at the highest standard, day after day.",
    tags: ["FACILITY ENGINEERING", "SMART SYSTEMS", "PREVENTIVE MAINTENANCE"]
  },
  {
    name: "Nadia Khalid",
    role: "MARKETING & BRAND STRATEGIST",
    imageUrl: "/images/team5.jpg",
    description: "Architecting compelling brand narratives that attract and retain a premium membership base.",
    tags: ["BRAND POSITIONING", "DIGITAL STRATEGY", "MEMBERSHIP GROWTH"]
  },
  {
    name: "Kamran Shah",
    role: "F&B & HOSPITALITY DIRECTOR",
    imageUrl: "/images/team6.jpg",
    description: "Transforming dining and events into signature experiences that define a club's reputation.",
    tags: ["CULINARY CURATION", "EVENT MANAGEMENT", "REVENUE OPTIMISATION"]
  }
];

export const EVENT_TABS: EventTab[] = [
  {
    id: "corporate",
    label: "CORPORATE",
    title: "Corporate Events",
    tagline: "Where Business Meets Distinction",
    description: "From high-stakes board conferences and product launches to annual galas and team-building retreats, we architect corporate experiences that leave lasting impressions. Every detail is curated to reflect your brand's prestige.",
    imageUrl: "/images/event_corporate.jpeg",
    offers: [
      "Conferences & Seminars",
      "Product Launches",
      "Annual Galas & Award Nights",
      "Executive Retreats",
      "Corporate Dinners"
    ]
  },
  {
    id: "matrimonial",
    label: "MATRIMONIAL",
    title: "Matrimonial Events",
    tagline: "Memories Woven in Gold",
    description: "Your wedding day deserves nothing less than perfection. We design every moment — from the mehndi to the walima — with exquisite attention to detail, blending tradition with contemporary elegance in Pakistan's finest venues.",
    imageUrl: "/images/event_matrimonial.jpeg",
    offers: [
      "Mehndi & Dholki",
      "Nikah Ceremonies",
      "Walima Receptions",
      "Barat Processions",
      "Honeymoon Planning"
    ]
  },
  {
    id: "birthday",
    label: "BIRTHDAY",
    title: "Birthday Celebrations",
    tagline: "Celebrations Worth Remembering",
    description: "Milestones should be celebrated in style. From intimate family dinners to extravagant themed parties, we create joyful, seamless celebrations tailored to your personal taste and guest preferences.",
    imageUrl: "/images/event_birthday.jpeg",
    offers: [
      "Theme Concept & Decor",
      "Gourmet Catering",
      "Entertainment & Sound",
      "Custom Cakes & Desserts",
      "Photography & Video"
    ]
  },
  {
    id: "school",
    label: "SCHOOL & ACADEMIC",
    title: "School & Academic Events",
    tagline: "Inspiring the Next Generation",
    description: "We specialize in academic events that celebrate achievement and inspire future leaders. From annual prize distributions and graduation ceremonies to sports days and inter-school competitions, every event is delivered with precision and pride.",
    imageUrl: "/images/event_school.jpg",
    offers: [
      "Graduation Ceremonies",
      "Prize Distributions",
      "Sports Days",
      "Science Fairs",
      "Inter-School Competitions"
    ]
  }
];

export const CLIENT_LOGOS: ClientLogo[] = [
  { id: "aaj", shortName: "AAJ", fullName: "AA Joyland", category: "FAMILY ENTERTAINMENT" },
  { id: "dgc", shortName: "DGC", fullName: "DHA Golf Club", category: "GOLF & RECREATION" },
  { id: "dcc", shortName: "DCC", fullName: "DHA Creek Club", category: "PREMIUM HOSPITALITY" },
  { id: "rh", shortName: "RH", fullName: "Ramada Hotel", category: "LUXURY HOSPITALITY" },
  { id: "css", shortName: "CSS", fullName: "City School System", category: "ACADEMIC INSTITUTION" },
  { id: "ts", shortName: "TS", fullName: "Turk Station", category: "F&B CONCEPT" },
  { id: "ptx", shortName: "PTX", fullName: "Pakistan Tracker", category: "TECHNOLOGY SERVICES" }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Horizon transformed our club's membership from 120 to over 400 active members in under 8 months. Their sales framework is unlike anything we had experienced before.",
    author: "AHMED FARRUKH",
    role: "Owner, Elite Fitness Club, Karachi"
  },
  {
    quote: "The lease model gave us complete peace of mind. We receive a fixed income every month while Horizon handles everything. Best decision we made for our club.",
    author: "KHALID MEHMOOD",
    role: "Director, Prestige Recreation, Lahore"
  },
  {
    quote: "From staff training to financial reporting, everything became professional overnight. Our members noticed the difference immediately.",
    author: "SARAH RAZA",
    role: "Owner, The Wellness Club, Islamabad"
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Can Horizon manage my existing club without me shutting it down?",
    answer: "Absolutely. Our onboarding process is designed to be seamless. We integrate with your existing operations, assess what's working and what isn't, and begin implementing improvements without disrupting your day-to-day business."
  },
  {
    question: "What is the minimum contract duration?",
    answer: "Contract terms are discussed during your free consultation and tailored to your specific situation and the partnership model you choose. We believe in relationships built on results, not locked-in contracts."
  },
  {
    question: "Will Horizon retain my existing staff?",
    answer: "Yes — in most cases we work with your existing team. Part of our service includes staff training and KPI implementation to elevate their performance rather than replace them."
  },
  {
    question: "How often will I receive financial reports?",
    answer: "You receive a detailed, fully transparent financial report every month. Our reporting covers revenue, membership numbers, marketing performance, and a full expense breakdown."
  },
  {
    question: "Does Horizon work with facilities outside Karachi?",
    answer: "Yes. We work with clubs and recreation facilities across Pakistan including Karachi, Lahore, and Islamabad. Please mention your city when filling out the consultation form."
  }
];
