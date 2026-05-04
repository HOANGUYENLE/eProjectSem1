import { useState, useEffect, useCallback, useMemo } from "react";

// ══════════════════════════════════════════════════════════════════
//  CONFIG
// ══════════════════════════════════════════════════════════════════
const BASE = "http://localhost:8000/api";

const LAWYERS = [
  {
    id: 1,
    name: "Richard Scott Lawson",
    title: "Senior Trial Attorney",
    firm: "Lawson & Berry",
    address: "3455 Peachtree Road NE, Suite 500, Atlanta, GA",
    phone: "(404) 939-7947",
    phone2: "(404) 816-4440",
    email: "r.lawson@lawsonberry.com",
    website: "www.lawsonberry.com",
    licensed: "30 years",
    barNumber: "GA-2847193",
    since: "1994",
    rating: 5.0,
    reviews: 697,
    avvo: 10,
    practice: ["DUI & DWI", "Criminal Defense"],
    education: ["J.D., Emory University School of Law", "B.A., University of Georgia — Political Science"],
    languages: ["English", "Spanish"],
    tagline: 'Don\'t Trust Your Future To A "General Practitioner." Call an Expert (24/7)',
    bio: "Richard Scott Lawson is one of Georgia's most recognized DUI defense attorneys, having successfully defended thousands of clients throughout his 30-year career. A former prosecutor, he understands both sides of the courtroom and uses that insight to build powerful defense strategies.",
    achievements: [
      "Super Lawyers Top 100 — Georgia (2018–2024)",
      "Avvo Rating 10 — Superb (Top Attorney)",
      "National College for DUI Defense — Board Certified",
      "Georgia Association of Criminal Defense Lawyers — Member",
      "Forbes Legal Council — 2023 Inductee",
      "10,000+ cases handled across 30 years",
    ],
    accent: "#1a3a5c",
    badge: "PRO",
  },
  {
    id: 2,
    name: "Margaret A. Chen",
    title: "Partner & Family Law Specialist",
    firm: "Chen & Whitmore LLP",
    address: "1200 Brickell Ave, Suite 1800, Miami, FL",
    phone: "(305) 555-0192",
    phone2: "(305) 555-0193",
    email: "m.chen@chenwhitmore.com",
    website: "www.chenwhitmore.com",
    licensed: "22 years",
    barNumber: "FL-1047822",
    since: "2002",
    rating: 4.9,
    reviews: 483,
    avvo: 9,
    practice: ["Family Law", "Divorce", "Child Custody"],
    education: ["J.D., University of Miami School of Law", "B.A., Yale University — Psychology"],
    languages: ["English", "Mandarin", "Cantonese"],
    tagline: "Protecting families through every transition. Compassionate, strategic, relentless.",
    bio: "Margaret Chen has devoted her 22-year career to family law, guiding clients through some of life's most emotionally complex legal challenges. Known for her empathetic approach combined with sharp litigation skills, she has successfully handled hundreds of high-asset divorce and custody cases across Florida.",
    achievements: [
      "Florida Bar Board Certified — Marital & Family Law",
      "AV Preeminent Rated — Martindale-Hubbell",
      "South Florida Legal Guide Top Lawyer (2019–2024)",
      "Best Lawyers in America — Family Law 2022",
      "Avvo Rating 9 — Excellent",
    ],
    accent: "#7c3aed",
    badge: "CERTIFIED",
  },
  {
    id: 3,
    name: "David J. O'Brien",
    title: "Managing Partner",
    firm: "O'Brien & Associates",
    address: "200 State St, 9th Floor, Boston, MA",
    phone: "(617) 555-0341",
    phone2: "(617) 555-0342",
    email: "david@obrienlaw.com",
    website: "www.obrienlaw.com",
    licensed: "18 years",
    barNumber: "MA-0683142",
    since: "2006",
    rating: 4.8,
    reviews: 312,
    avvo: 9,
    practice: ["Personal Injury", "Medical Malpractice", "Workers' Comp"],
    education: ["J.D., Boston College Law School", "B.S., Northeastern University — Business"],
    languages: ["English", "Irish Gaelic"],
    tagline: "When you're injured, you deserve a fighter. We don't get paid until you do.",
    bio: "David O'Brien built his firm on a simple promise: fight hard for the injured. With 18 years handling personal injury and malpractice cases across Massachusetts, he has recovered over $200 million in verdicts and settlements for his clients.",
    achievements: [
      "Multi-Million Dollar Advocates Forum Member",
      "Massachusetts Academy of Trial Attorneys — President 2021",
      "Super Lawyers Rising Star (2012–2018)",
      "Boston Magazine Top Lawyers (2020–2024)",
      "Trial Lawyers of America — Fellow",
    ],
    accent: "#b45309",
    badge: "TOP RATED",
  },
  {
    id: 4,
    name: "Sophia R. Patel",
    title: "Immigration Law Expert",
    firm: "Patel Immigration Group",
    address: "505 Montgomery St, Floor 11, San Francisco, CA",
    phone: "(415) 555-0788",
    phone2: "(415) 555-0789",
    email: "sophia@patelimmigration.com",
    website: "www.patelimmigration.com",
    licensed: "15 years",
    barNumber: "CA-2918473",
    since: "2009",
    rating: 4.9,
    reviews: 541,
    avvo: 10,
    practice: ["Immigration", "Visa & Green Cards", "Deportation Defense"],
    education: ["J.D., UC Berkeley School of Law", "B.A., Stanford University — International Relations"],
    languages: ["English", "Hindi", "Gujarati", "Spanish"],
    tagline: "Your American Dream is our mission. Expert immigration counsel since 2009.",
    bio: "Sophia Patel is a nationally recognized immigration attorney who has helped thousands of families, entrepreneurs, and professionals navigate the U.S. immigration system. Her multilingual team handles everything from H-1B visas to complex deportation defense cases.",
    achievements: [
      "AILA (American Immigration Lawyers Association) — Board Member",
      "Avvo Rating 10 — Superb",
      "California Lawyer Attorney of the Year — Immigration (2022)",
      "Super Lawyers — Top 50 Women in Northern California (2021–2024)",
      "5,000+ successful visa applications",
    ],
    accent: "#0f766e",
    badge: "PRO",
  },
  {
    id: 5,
    name: "James T. Whitfield",
    title: "Corporate & Securities Attorney",
    firm: "Whitfield Mercer & Park",
    address: "One World Trade Center, 42nd Floor, New York, NY",
    phone: "(212) 555-0965",
    phone2: "(212) 555-0966",
    email: "j.whitfield@wmplaw.com",
    website: "www.wmplaw.com",
    licensed: "25 years",
    barNumber: "NY-1823044",
    since: "1999",
    rating: 4.7,
    reviews: 198,
    avvo: 9,
    practice: ["Corporate Law", "M&A", "Securities & Finance"],
    education: ["J.D., Columbia Law School (Law Review)", "B.A., Harvard University — Economics"],
    languages: ["English", "French"],
    tagline: "Trusted counsel for Fortune 500 companies and emerging ventures alike.",
    bio: "James Whitfield has been at the center of some of New York's most significant corporate transactions. With 25 years advising multinationals, private equity firms, and startups, he brings unmatched depth to M&A, securities offerings, and complex commercial agreements.",
    achievements: [
      "Chambers USA Band 1 — Corporate/M&A New York (2018–2024)",
      "Legal 500 US Leading Lawyer — Capital Markets",
      "Deal of the Year — American Lawyer (2019, 2022)",
      "NYU Law School Adjunct Professor — Securities Regulation",
      "Former SEC Enforcement Division Attorney",
    ],
    accent: "#1e40af",
    badge: "ELITE",
  },
  {
    id: 6,
    name: "Lorena V. Castillo",
    title: "Employment & Labor Attorney",
    firm: "Castillo Workers' Rights Center",
    address: "1600 Vine St, Suite 300, Los Angeles, CA",
    phone: "(213) 555-0447",
    phone2: "(213) 555-0448",
    email: "lorena@castillolabor.com",
    website: "www.castillolabor.com",
    licensed: "12 years",
    barNumber: "CA-3041982",
    since: "2012",
    rating: 4.8,
    reviews: 374,
    avvo: 9,
    practice: ["Employment Law", "Wrongful Termination", "Workplace Discrimination"],
    education: ["J.D., UCLA School of Law", "B.A., UC Santa Barbara — Sociology"],
    languages: ["English", "Spanish"],
    tagline: "Every worker deserves dignity. We fight for yours.",
    bio: "Lorena Castillo founded her firm with one goal: making quality employment law accessible. She has represented hundreds of employees in discrimination, harassment, and wrongful termination cases, recovering millions in damages for workers across California.",
    achievements: [
      "National Employment Lawyers Association — Member",
      "California Employment Lawyers Association — Board 2023",
      "Los Angeles Business Journal Top Employment Attorney 2022",
      "Consumer Attorneys of California — Member",
      "Recovered $15M+ in client settlements",
    ],
    accent: "#be185d",
    badge: "CERTIFIED",
  },
  {
    id: 7,
    name: "Benjamin T. Nakamura",
    title: "Intellectual Property Counsel",
    firm: "Nakamura IP Law Group",
    address: "2100 Geng Rd, Suite 210, Palo Alto, CA",
    phone: "(650) 555-0833",
    phone2: "(650) 555-0834",
    email: "ben@nakamuraip.com",
    website: "www.nakamuraip.com",
    licensed: "20 years",
    barNumber: "CA-2203851",
    since: "2004",
    rating: 4.9,
    reviews: 267,
    avvo: 10,
    practice: ["Intellectual Property", "Patent Law", "Trademark & Copyright"],
    education: ["J.D., Stanford Law School", "M.S., MIT — Electrical Engineering", "B.S., Caltech — Computer Science"],
    languages: ["English", "Japanese"],
    tagline: "Protecting innovation from idea to patent. Silicon Valley's IP counsel since 2004.",
    bio: "Benjamin Nakamura combines a deep engineering background with elite legal training to protect the most complex innovations in tech. With 20 years advising startups to Fortune 500s in Silicon Valley, he has prosecuted over 1,200 patents and successfully litigated dozens of high-stakes IP disputes.",
    achievements: [
      "USPTO Registered Patent Attorney",
      "IAM Patent 1000 — Recommended Attorney (2020–2024)",
      "Chambers USA — IP: Patents (Northern CA) Band 2",
      "Stanford Law Alumni Achievement Award 2021",
      "1,200+ patents prosecuted across 30 countries",
    ],
    accent: "#0e7490",
    badge: "ELITE",
  },
  {
    id: 8,
    name: "Aaliyah M. Washington",
    title: "Civil Rights & Public Interest Attorney",
    firm: "Washington Justice Project",
    address: "655 15th St NW, Suite 800, Washington, DC",
    phone: "(202) 555-0621",
    phone2: "(202) 555-0622",
    email: "aaliyah@washingtonjustice.org",
    website: "www.washingtonjustice.org",
    licensed: "16 years",
    barNumber: "DC-1094723",
    since: "2008",
    rating: 5.0,
    reviews: 189,
    avvo: 10,
    practice: ["Civil Rights", "Police Misconduct", "Constitutional Law"],
    education: ["J.D., Howard University School of Law (Valedictorian)", "B.A., Spelman College — Political Science"],
    languages: ["English", "French", "ASL"],
    tagline: "Justice is not a privilege. It is a right. We defend it for everyone.",
    bio: "Aaliyah Washington has dedicated her entire career to civil rights litigation, taking on powerful institutions on behalf of those whose constitutional rights have been violated. A Howard Law valedictorian, she has argued before the D.C. Circuit Court and is widely regarded as one of the most formidable civil rights litigators in the country.",
    achievements: [
      "NAACP Legal Defense Fund — Cooperating Attorney",
      "National Bar Association Civil Rights Division — Chair 2022",
      "The National Law Journal — Civil Rights Trailblazer Award 2021",
      "Argued 3 cases before the U.S. Court of Appeals for the D.C. Circuit",
      "Recovered $22M+ in civil rights verdicts and settlements",
    ],
    accent: "#7c2d12",
    badge: "PRO",
  },
  {
    id: 9,
    name: "Dr. Henrik R. Johansson",
    title: "International & Tax Law Expert",
    firm: "Johansson Lindqvist International",
    address: "100 N. Riverside Plaza, 19th Floor, Chicago, IL",
    phone: "(312) 555-0576",
    phone2: "(312) 555-0577",
    email: "h.johansson@jlilaw.com",
    website: "www.jlilaw.com",
    licensed: "28 years",
    barNumber: "IL-0752189",
    since: "1996",
    rating: 4.7,
    reviews: 143,
    avvo: 9,
    practice: ["Tax Law", "International Law", "Estate Planning"],
    education: ["LL.M., NYU School of Law — Taxation", "J.D., University of Chicago Law School", "B.A., Uppsala University, Sweden — Law & Economics"],
    languages: ["English", "Swedish", "German", "French"],
    tagline: "Cross-border expertise. Bulletproof tax strategy. Your global legal partner.",
    bio: "Henrik Johansson brings rare multilingual and multinational expertise to complex tax and international law matters. With offices in Chicago and affiliates in Stockholm, Frankfurt, and Paris, he advises high-net-worth individuals and multinational corporations on cross-border taxation, estate planning, and international transactions.",
    achievements: [
      "International Fiscal Association — Member since 1998",
      "Best Lawyers in America — Tax Law (2016–2024)",
      "Illinois State Bar — International Law Section Chair 2020",
      "Published Author: 'Cross-Border Tax Planning' (3rd Ed.)",
      "Advises clients in 40+ countries",
    ],
    accent: "#1d4ed8",
    badge: "TOP RATED",
  },
  {
    id: 10,
    name: "Priscilla A. Okafor",
    title: "Real Estate & Property Attorney",
    firm: "Okafor Realty Law PLLC",
    address: "4400 Post Oak Pkwy, Suite 2360, Houston, TX",
    phone: "(713) 555-0384",
    phone2: "(713) 555-0385",
    email: "priscilla@okaforlaw.com",
    website: "www.okaforlaw.com",
    licensed: "14 years",
    barNumber: "TX-2408815",
    since: "2010",
    rating: 4.8,
    reviews: 421,
    avvo: 9,
    practice: ["Real Estate Law", "Commercial Leasing", "Property Disputes"],
    education: ["J.D., University of Texas School of Law", "B.B.A., Texas A&M University — Finance"],
    languages: ["English", "Igbo", "Yoruba"],
    tagline: "From contract to closing — expert real estate legal counsel in every transaction.",
    bio: "Priscilla Okafor has guided buyers, sellers, developers, and landlords through thousands of real estate transactions across Texas. Whether it's a multimillion-dollar commercial development or a complex residential dispute, she provides practical, deal-oriented counsel that protects her clients' investments.",
    achievements: [
      "Texas Real Estate Commission — Legal Advisory Panel Member",
      "Houston Business Journal Top Real Estate Attorney 2023",
      "State Bar of Texas — Real Estate Section Chair (2021–2023)",
      "Certified Commercial Investment Member (CCIM) Affiliate",
      "$800M+ in transactions handled",
    ],
    accent: "#b45309",
    badge: "CERTIFIED",
  },
  {
    id: 11,
    name: "Marco E. Russo",
    title: "Bankruptcy & Debt Relief Attorney",
    firm: "Russo Debt Relief Law",
    address: "401 N. Michigan Ave, Suite 1200, Chicago, IL",
    phone: "(312) 555-0219",
    phone2: "(312) 555-0220",
    email: "marco@russodebtlaw.com",
    website: "www.russodebtlaw.com",
    licensed: "17 years",
    barNumber: "IL-1183045",
    since: "2007",
    rating: 4.6,
    reviews: 528,
    avvo: 9,
    practice: ["Bankruptcy", "Debt Relief", "Business Restructuring"],
    education: ["J.D., Loyola University Chicago School of Law", "B.S., DePaul University — Accounting"],
    languages: ["English", "Italian"],
    tagline: "A fresh financial start is possible. We'll guide you every step of the way.",
    bio: "Marco Russo has helped over 3,000 individuals and businesses navigate bankruptcy and debt relief. His accounting background gives him an edge in complex business restructurings and Chapter 11 proceedings. He is known for clear communication, affordable rates, and genuinely caring about client outcomes.",
    achievements: [
      "American Bankruptcy Institute — Member",
      "Illinois State Bar — Bankruptcy Law Section",
      "Consumer Debt Attorneys of America — Board Member 2022",
      "Martindale-Hubbell AV Preeminent Rated",
      "3,000+ successful debt relief cases",
    ],
    accent: "#065f46",
    badge: "PRO",
  },
  {
    id: 12,
    name: "Yuna K. Park",
    title: "Healthcare & Medical Law Attorney",
    firm: "Park Healthcare Legal Group",
    address: "3500 Lacey Rd, Suite 600, Downers Grove, IL",
    phone: "(630) 555-0712",
    phone2: "(630) 555-0713",
    email: "yuna@parkhealthlaw.com",
    website: "www.parkhealthlaw.com",
    licensed: "11 years",
    barNumber: "IL-2917634",
    since: "2013",
    rating: 4.9,
    reviews: 156,
    avvo: 9,
    practice: ["Healthcare Law", "Medical Malpractice", "HIPAA Compliance"],
    education: ["J.D., Northwestern University Pritzker School of Law", "M.P.H., Johns Hopkins Bloomberg School of Public Health", "B.S., University of Illinois — Biochemistry"],
    languages: ["English", "Korean", "Japanese"],
    tagline: "Where medicine and the law meet — protecting patients, providers, and institutions.",
    bio: "Yuna Park is uniquely positioned at the intersection of medicine and law, holding both a J.D. from Northwestern and a Master of Public Health from Johns Hopkins. She counsels hospitals, physicians, and patients on healthcare compliance, licensing defense, and medical malpractice litigation.",
    achievements: [
      "American Health Law Association — Rising Star 2022",
      "Illinois Healthcare Attorneys Network — Founding Member",
      "Northwestern Law Review — Articles Editor",
      "Illinois Super Lawyers Rising Stars (2019–2024)",
      "Dual-licensed attorney and public health practitioner",
    ],
    accent: "#4f46e5",
    badge: "ELITE",
  },
];

const PRACTICE_AREAS = [...new Set(LAWYERS.flatMap(l => l.practice))].sort();

const SLOTS = [
  { id: 1, label: "Mon 9:00 AM" },
  { id: 2, label: "Mon 2:00 PM" },
  { id: 3, label: "Tue 10:00 AM" },
  { id: 4, label: "Wed 11:00 AM" },
  { id: 5, label: "Thu 3:00 PM" },
  { id: 6, label: "Fri 9:00 AM" },
];
const slotLabel = (id) => SLOTS.find((s) => s.id === id)?.label ?? `Slot #${id}`;

// ══════════════════════════════════════════════════════════════════
//  API
// ══════════════════════════════════════════════════════════════════
const api = {
  get:    (p)    => fetch(`${BASE}${p}`).then(r => r.json()),
  post:   (p, b) => fetch(`${BASE}${p}`, { method:"POST",   headers:{"Content-Type":"application/json"}, body:JSON.stringify(b) }).then(r => r.json()),
  put:    (p, b) => fetch(`${BASE}${p}`, { method:"PUT",    headers:{"Content-Type":"application/json"}, body:JSON.stringify(b) }).then(r => r.json()),
  delete: (p)    => fetch(`${BASE}${p}`, { method:"DELETE" }).then(r => r.json()),
};

// ══════════════════════════════════════════════════════════════════
//  TOKENS
// ══════════════════════════════════════════════════════════════════
const C = {
  navy:"#0d1f35", blue:"#1a3a5c", gold:"#c8952a", goldL:"#f5a623",
  cream:"#fdf8f0", bg:"#f2f5f9", white:"#ffffff",
  muted:"#7a8fa6", border:"#dde5ef",
  danger:"#b91c1c", success:"#15643b", info:"#1a6abf",
};

// ══════════════════════════════════════════════════════════════════
//  ICONS
// ══════════════════════════════════════════════════════════════════
const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
    <path d={d} />
  </svg>
);
const I = {
  cal:    (s=16) => <Ic size={s} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
  re:     (s=16) => <Ic size={s} d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />,
  user:   (s=16) => <Ic size={s} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  users:  (s=16) => <Ic size={s} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  plus:   (s=16) => <Ic size={s} d="M12 5v14M5 12h14" />,
  edit:   (s=16) => <Ic size={s} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
  trash:  (s=16) => <Ic size={s} d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />,
  phone:  (s=16) => <Ic size={s} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.73 1.18h3a2 2 0 0 1 2 1.72 15.59 15.59 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 6.29 6.29l1.81-1.81a2 2 0 0 1 2.11-.45 15.59 15.59 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  pin:    (s=16) => <Ic size={s} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  check:  (s=16) => <Ic size={s} d="M20 6L9 17l-5-5" />,
  x:      (s=16) => <Ic size={s} d="M18 6L6 18M6 6l12 12" />,
  mail:   (s=16) => <Ic size={s} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />,
  globe:  (s=16) => <Ic size={s} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />,
  award:  (s=16) => <Ic size={s} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  book:   (s=16) => <Ic size={s} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />,
  logout: (s=16) => <Ic size={s} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  back:   (s=16) => <Ic size={s} d="M19 12H5M12 19l-7-7 7-7" />,
  eye:    (s=16) => <Ic size={s} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  brief:  (s=16) => <Ic size={s} d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />,
  shield: (s=16) => <Ic size={s} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  search: (s=16) => <Ic size={s} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />,
  filter: (s=16) => <Ic size={s} d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  star2:  (s=16) => <Ic size={s} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  cal2:   (s=16) => <Ic size={s} d="M8 2v4M16 2v4M3 10h18M21 6H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />,
  list:   (s=16) => <Ic size={s} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
};

const Star = ({ size = 14, filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? C.goldL : "none"} stroke={C.goldL} strokeWidth={1.5}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const StarRating = ({ rating, size = 13 }) => {
  const full = Math.floor(rating);
  return (
    <span style={{ display:"inline-flex", gap:2, alignItems:"center" }}>
      {[...Array(5)].map((_, i) => <Star key={i} size={size} filled={i < full} />)}
    </span>
  );
};

const LawyerAvatar = ({ lawyer, size = 64 }) => (
  <img
    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&size=${size * 2}&background=${lawyer.accent.replace("#","")}&color=fff&bold=true&font-size=0.35`}
    alt={lawyer.name}
    style={{ width:size, height:size, borderRadius: size > 80 ? 16 : 12, display:"block", flexShrink:0 }}
  />
);

// ══════════════════════════════════════════════════════════════════
//  ATOMS
// ══════════════════════════════════════════════════════════════════
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position:"fixed", bottom:28, right:28, zIndex:9999,
      background: type==="error" ? C.danger : C.success,
      color:"#fff", padding:"13px 22px", borderRadius:12,
      boxShadow:"0 8px 36px rgba(0,0,0,0.28)",
      display:"flex", alignItems:"center", gap:10,
      fontSize:14, fontWeight:500, animation:"slideIn .3s ease",
    }}>
      {type==="error" ? I.x() : I.check()} {msg}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.58)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3000, backdropFilter:"blur(6px)", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.white, borderRadius:20, padding:"36px 40px", width:"100%", maxWidth:500, boxShadow:"0 28px 80px rgba(0,0,0,0.3)", animation:"fadeUp .25s ease", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:C.navy, margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, padding:4 }}>{I.x()}</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const Fld = ({ label, children }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:6 }}>{label}</label>
    {children}
  </div>
);

const Inp = (props) => (
  <input {...props} style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:14, color:C.navy, outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:C.white, transition:"border-color .2s, box-shadow .2s" }}
    onFocus={e => { e.target.style.borderColor=C.info; e.target.style.boxShadow="0 0 0 3px rgba(26,106,191,0.12)"; }}
    onBlur={e  => { e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }} />
);

const Sel = ({ children, ...p }) => (
  <select {...p} style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:14, color:C.navy, background:C.white, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}>{children}</select>
);

const Txa = (p) => (
  <textarea {...p} rows={3} style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:14, color:C.navy, resize:"vertical", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
);

function Btn({ children, onClick, variant="primary", sm, disabled, fullWidth }) {
  const vs = {
    primary: { bg:C.blue, fg:"#fff", bdr:"none" },
    gold:    { bg:C.gold, fg:"#fff", bdr:"none" },
    danger:  { bg:C.danger, fg:"#fff", bdr:"none" },
    ghost:   { bg:"transparent", fg:C.blue, bdr:`1.5px solid ${C.blue}` },
    success: { bg:C.success, fg:"#fff", bdr:"none" },
    muted:   { bg:"#eef2f7", fg:C.muted, bdr:`1px solid ${C.border}` },
  };
  const v = vs[variant] || vs.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{ background:v.bg, color:v.fg, border:v.bdr, borderRadius:9, cursor:disabled?"not-allowed":"pointer", padding:sm?"6px 14px":"10px 20px", fontSize:sm?12:14, fontWeight:600, display:"inline-flex", alignItems:"center", gap:6, opacity:disabled?.6:1, fontFamily:"inherit", width:fullWidth?"100%":"auto", transition:"opacity .15s", justifyContent:"center" }}
      onMouseEnter={e => { if(!disabled) e.currentTarget.style.opacity=".83"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}>
      {children}
    </button>
  );
}

function Badge({ label, bg, color }) {
  return <span style={{ background:bg, color, padding:"2px 10px", borderRadius:20, fontSize:12, fontWeight:600, letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{label}</span>;
}
const StatusBadge = ({ status }) => status === "rescheduled"
  ? <Badge label="Rescheduled" bg="#dbeafe" color="#1e40af" />
  : <Badge label="Canceled"   bg="#fee2e2" color="#991b1b" />;
const SlotBadge = ({ id, old: isOld }) => (
  <Badge label={slotLabel(id)} bg={isOld?"#fff3cd":"#d4edda"} color={isOld?"#856404":"#155724"} />
);

function Card({ children, style = {} }) {
  return <div style={{ background:C.white, borderRadius:18, padding:"28px 26px", boxShadow:"0 4px 24px rgba(13,31,53,0.08)", border:`1px solid ${C.border}`, ...style }}>{children}</div>;
}

function SectionHead({ icon, title, sub, color="#1a3a5c" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
      <div style={{ background:color, color:"#fff", borderRadius:11, padding:10, display:"flex", flexShrink:0 }}>{icon}</div>
      <div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:19, color:C.navy, margin:0 }}>{title}</h2>
        {sub && <p style={{ fontSize:12, color:C.muted, margin:0 }}>{sub}</p>}
      </div>
    </div>
  );
}

const EmptyState = ({ msg }) => (
  <div style={{ textAlign:"center", padding:"56px 0", color:C.muted, background:"#f8fafc", borderRadius:12, border:`1.5px dashed ${C.border}` }}>
    <div style={{ fontSize:32, marginBottom:10 }}>📋</div>
    <p style={{ fontSize:14 }}>{msg}</p>
  </div>
);

const Spinner = () => (
  <div style={{ textAlign:"center", padding:"48px 0", color:C.muted }}>
    <div style={{ width:32, height:32, border:`3px solid ${C.border}`, borderTopColor:C.blue, borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 10px" }} />
    Loading…
  </div>
);

function Table({ heads, rows }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13.5 }}>
        <thead>
          <tr style={{ background:"#f0f4f9" }}>
            {heads.map(h => <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:C.muted, fontWeight:700, fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background:i%2===0?C.white:"#f8fafc", borderBottom:"1px solid #edf1f6" }}>
              {row.map((cell, j) => <td key={j} style={{ padding:"11px 14px", verticalAlign:"middle" }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  FORMS
// ══════════════════════════════════════════════════════════════════
function AppointmentForm({ lawyerId = "1", onSubmit, onCancel, saving }) {
  const [f, setF] = useState({ customer_id:"", lawyer_id: String(lawyerId), slot_id:"1", request_text:"", response_text:"" });
  const set = k => e => setF(p => ({ ...p, [k]:e.target.value }));
  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 18px" }}>
        <Fld label="Customer ID"><Inp type="number" placeholder="e.g. 1" value={f.customer_id} onChange={set("customer_id")} /></Fld>
        <Fld label="Lawyer ID"><Inp type="number" value={f.lawyer_id} onChange={set("lawyer_id")} /></Fld>
      </div>
      <Fld label="Time Slot">
        <Sel value={f.slot_id} onChange={set("slot_id")}>
          {SLOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </Sel>
      </Fld>
      <Fld label="Request / Description"><Txa placeholder="Describe your legal matter…" value={f.request_text} onChange={set("request_text")} /></Fld>
      <Fld label="Response Note (optional)"><Txa placeholder="Lawyer's note…" value={f.response_text} onChange={set("response_text")} /></Fld>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={() => onSubmit(f)} disabled={saving}>{saving ? "Saving…" : "Create Appointment"}</Btn>
      </div>
    </>
  );
}

function RescheduleForm({ initial, onSubmit, onCancel, saving, isEdit }) {
  const [f, setF] = useState(initial || { appointment_id:"", customer_id:"", old_slot_id:"1", new_slot_id:"1", reason:"", status:"rescheduled" });
  const set = k => e => setF(p => ({ ...p, [k]:e.target.value }));
  return (
    <>
      {!isEdit && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 18px" }}>
          <Fld label="Appointment ID"><Inp type="number" placeholder="e.g. 1" value={f.appointment_id} onChange={set("appointment_id")} /></Fld>
          <Fld label="Customer ID"><Inp type="number" placeholder="e.g. 1" value={f.customer_id} onChange={set("customer_id")} /></Fld>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 18px" }}>
        <Fld label="Old Slot"><Sel value={f.old_slot_id} onChange={set("old_slot_id")}>{SLOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</Sel></Fld>
        <Fld label="New Slot"><Sel value={f.new_slot_id} onChange={set("new_slot_id")}>{SLOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</Sel></Fld>
      </div>
      <Fld label="Status">
        <Sel value={f.status} onChange={set("status")}>
          <option value="rescheduled">Rescheduled</option>
          <option value="canceled">Canceled</option>
        </Sel>
      </Fld>
      <Fld label="Reason"><Txa placeholder="Reason for rescheduling…" value={f.reason} onChange={set("reason")} /></Fld>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn variant={isEdit?"primary":"success"} onClick={() => onSubmit(f)} disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Request"}
        </Btn>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
//  SHARED RESCHEDULE SECTION
// ══════════════════════════════════════════════════════════════════
function RescheduleSection({ toast }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [delItem, setDelItem] = useState(null);
  const [saving, setSaving]   = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/reschedules").then(r => { setData(r.data||[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const handleAdd = async (f) => {
    if (!f.appointment_id || !f.customer_id) return toast("Appointment ID & Customer ID required", "error");
    setSaving(true);
    const r = await api.post("/reschedules", { appointment_id:parseInt(f.appointment_id), customer_id:parseInt(f.customer_id), old_slot_id:parseInt(f.old_slot_id), new_slot_id:parseInt(f.new_slot_id)||null, reason:f.reason||null, status:f.status });
    setSaving(false);
    if (r.success) { toast("Reschedule created!"); setModal(null); load(); } else toast(r.message||"Error","error");
  };
  const handleEdit = async (f) => {
    setSaving(true);
    const r = await api.put(`/reschedules/${modal.item.id}`, { old_slot_id:parseInt(f.old_slot_id), new_slot_id:parseInt(f.new_slot_id)||null, reason:f.reason||null, status:f.status });
    setSaving(false);
    if (r.success) { toast("Updated!"); setModal(null); load(); } else toast(r.message||"Error","error");
  };
  const handleDelete = async () => {
    const r = await api.delete(`/reschedules/${delItem.id}`);
    if (r.success) { toast("Deleted!"); setDelItem(null); load(); } else toast(r.message||"Error","error");
  };

  const rows = data.map(r => [
    <span style={{ fontWeight:700, color:"#5c1a3a" }}>#{r.id}</span>,
    <span style={{ color:C.muted }}>#{r.appointment_id}</span>,
    `ID: ${r.customer_id}`,
    <SlotBadge id={r.old_slot_id} old />,
    r.new_slot_id ? <SlotBadge id={r.new_slot_id} /> : <span style={{ color:C.border }}>—</span>,
    <span style={{ maxWidth:140, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.reason||<span style={{color:C.border}}>—</span>}</span>,
    <StatusBadge status={r.status} />,
    <div style={{ display:"flex", gap:6 }}>
      <button onClick={() => setModal({ item:r })} style={{ background:"#e0f0ff", color:C.info, border:"none", borderRadius:7, padding:"5px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600 }}>{I.edit(13)}Edit</button>
      <button onClick={() => setDelItem(r)} style={{ background:"#fee2e2", color:C.danger, border:"none", borderRadius:7, padding:"5px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600 }}>{I.trash(13)}Del</button>
    </div>,
  ]);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <SectionHead icon={I.re()} title="Reschedule Requests" sub="View, Add, Edit, Delete" color="#5c1a3a" />
        <Btn onClick={() => setModal("add")}>{I.plus()} New Request</Btn>
      </div>
      {loading ? <Spinner /> : data.length===0 ? <EmptyState msg="No reschedule requests yet." /> : (
        <Table heads={["#","Appt","Customer","Old Slot","New Slot","Reason","Status","Actions"]} rows={rows} />
      )}
      {modal==="add" && <Modal title="New Reschedule Request" onClose={() => setModal(null)}><RescheduleForm onSubmit={handleAdd} onCancel={() => setModal(null)} saving={saving} /></Modal>}
      {modal?.item && <Modal title={`Edit Reschedule #${modal.item.id}`} onClose={() => setModal(null)}><RescheduleForm isEdit initial={{ old_slot_id:modal.item.old_slot_id, new_slot_id:modal.item.new_slot_id||"1", reason:modal.item.reason||"", status:modal.item.status }} onSubmit={handleEdit} onCancel={() => setModal(null)} saving={saving} /></Modal>}
      {delItem && (
        <Modal title="Confirm Delete" onClose={() => setDelItem(null)}>
          <p style={{ color:C.muted, marginBottom:28, lineHeight:1.6 }}>Delete <strong>Reschedule #{delItem.id}</strong>? This cannot be undone.</p>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setDelItem(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={handleDelete}>{I.trash()} Delete</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  LAWYER CARD (directory grid)
// ══════════════════════════════════════════════════════════════════
function LawyerCard({ lawyer, onView, onBook }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:C.white, borderRadius:18, overflow:"hidden",
        boxShadow: hov ? "0 12px 40px rgba(13,31,53,0.14)" : "0 4px 20px rgba(13,31,53,0.07)",
        border:`1px solid ${hov ? lawyer.accent+"55" : C.border}`,
        transition:"all .22s", transform: hov ? "translateY(-3px)" : "none",
        display:"flex", flexDirection:"column",
      }}>
      {/* Accent bar */}
      <div style={{ height:5, background:`linear-gradient(90deg,${lawyer.accent},${lawyer.accent}aa)` }} />

      <div style={{ padding:"22px 22px 16px" }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:14 }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <LawyerAvatar lawyer={lawyer} size={62} />
            <span style={{ position:"absolute", bottom:-5, right:-5, background:lawyer.accent, color:"#fff", fontSize:8, fontWeight:800, padding:"2px 6px", borderRadius:8, letterSpacing:"0.06em", whiteSpace:"nowrap" }}>
              {lawyer.badge}
            </span>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:C.navy, margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{lawyer.name}</h3>
            <p style={{ fontSize:12, color:C.muted, margin:"0 0 6px" }}>{lawyer.title}</p>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <StarRating rating={lawyer.rating} size={11} />
              <span style={{ fontSize:12, fontWeight:700, color:C.navy }}>{lawyer.rating.toFixed(1)}</span>
              <span style={{ fontSize:11, color:C.muted }}>({lawyer.reviews})</span>
            </div>
          </div>
          <div style={{ background: lawyer.accent+"18", borderRadius:10, padding:"4px 9px", flexShrink:0 }}>
            <div style={{ fontSize:10, color:C.muted, textAlign:"center" }}>Avvo</div>
            <div style={{ fontSize:16, fontWeight:800, color:lawyer.accent, textAlign:"center", lineHeight:1 }}>{lawyer.avvo}</div>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.muted, marginBottom:3 }}>
          {I.brief(12)} <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:600 }}>{lawyer.firm}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.muted, marginBottom:10 }}>
          {I.pin(11)}
          <span>{lawyer.address.split(",").slice(-2).join(",").trim()}</span>
          <span style={{ opacity:.35 }}>·</span>
          <span>{lawyer.licensed} exp.</span>
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
          {lawyer.practice.slice(0,3).map(p => (
            <span key={p} style={{ background:lawyer.accent+"15", color:lawyer.accent, borderRadius:20, padding:"3px 9px", fontSize:11, fontWeight:600 }}>{p}</span>
          ))}
        </div>

        <p style={{ fontSize:12, color:"#3a4a5e", lineHeight:1.6, margin:0, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{lawyer.bio}</p>
      </div>

      <div style={{ borderTop:`1px solid ${C.border}`, padding:"12px 22px", display:"flex", gap:8, marginTop:"auto" }}>
        <button onClick={() => onView(lawyer)} style={{ flex:1, background:lawyer.accent+"18", color:lawyer.accent, border:`1px solid ${lawyer.accent}44`, borderRadius:9, padding:"8px 0", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
          {I.eye(13)} View Profile
        </button>
        <button onClick={() => onBook(lawyer)} style={{ flex:1, background:lawyer.accent, color:"#fff", border:"none", borderRadius:9, padding:"8px 0", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
          {I.cal(13)} Book Now
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  LAWYER DIRECTORY (listing + search/filter)
// ══════════════════════════════════════════════════════════════════
function LawyerDirectory({ onView, onBook }) {
  const [search, setSearch]     = useState("");
  const [filterArea, setFilter] = useState("all");
  const [sortBy, setSort]       = useState("rating");

  const filtered = useMemo(() => {
    let list = LAWYERS.filter(l => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.name.toLowerCase().includes(q) || l.practice.some(p => p.toLowerCase().includes(q)) || l.firm.toLowerCase().includes(q);
      const matchArea = filterArea === "all" || l.practice.includes(filterArea);
      return matchSearch && matchArea;
    });
    if (sortBy === "rating")  list = [...list].sort((a,b) => b.rating - a.rating);
    if (sortBy === "reviews") list = [...list].sort((a,b) => b.reviews - a.reviews);
    if (sortBy === "avvo")    list = [...list].sort((a,b) => b.avvo - a.avvo);
    if (sortBy === "name")    list = [...list].sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }, [search, filterArea, sortBy]);

  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:18, padding:"30px 32px", marginBottom:28, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:"rgba(200,149,42,0.07)", pointerEvents:"none" }} />
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#fff", margin:"0 0 6px" }}>Find Your Lawyer</h1>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, margin:"0 0 22px" }}>{LAWYERS.length} verified attorneys · 15 practice areas · Free consultation available</p>

        {/* Stats chips */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20 }}>
          {[
            { label:"Avg Rating", value:"4.85 ★", bg:"rgba(245,166,35,0.2)", color:C.goldL },
            { label:"Total Reviews", value:LAWYERS.reduce((s,l)=>s+l.reviews,0).toLocaleString(), bg:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.8)" },
            { label:"Cities", value:"8 metros", bg:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.8)" },
            { label:"Languages", value:"12+ spoken", bg:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.8)" },
          ].map(s => (
            <div key={s.label} style={{ background:s.bg, borderRadius:20, padding:"5px 14px", display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{s.label}:</span>
              <span style={{ fontSize:12, fontWeight:700, color:s.color }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:200, position:"relative" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)", pointerEvents:"none" }}>{I.search(15)}</span>
            <input
              type="text"
              placeholder="Search by name, practice area, or firm…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width:"100%", padding:"10px 12px 10px 38px", borderRadius:10, border:"1.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.1)", color:"#fff", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
            />
          </div>
          <select value={filterArea} onChange={e => setFilter(e.target.value)} style={{ padding:"10px 14px", borderRadius:10, border:"1.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.1)", color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit" }}>
            <option value="all" style={{ background:C.navy }}>All Practice Areas</option>
            {PRACTICE_AREAS.map(a => <option key={a} value={a} style={{ background:C.navy }}>{a}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSort(e.target.value)} style={{ padding:"10px 14px", borderRadius:10, border:"1.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.1)", color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit" }}>
            <option value="rating"  style={{ background:C.navy }}>Sort: Top Rated</option>
            <option value="reviews" style={{ background:C.navy }}>Sort: Most Reviews</option>
            <option value="avvo"    style={{ background:C.navy }}>Sort: Avvo Rating</option>
            <option value="name"    style={{ background:C.navy }}>Sort: Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <p style={{ fontSize:13, color:C.muted }}>
          Showing <strong style={{ color:C.navy }}>{filtered.length}</strong> of {LAWYERS.length} attorneys
          {filterArea !== "all" && <span> in <strong style={{ color:C.blue }}>{filterArea}</strong></span>}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:C.muted }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
          <p style={{ fontSize:15 }}>No attorneys match your search.</p>
          <button onClick={() => { setSearch(""); setFilter("all"); }} style={{ marginTop:12, background:"none", border:"none", color:C.info, fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>Clear filters</button>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:20 }}>
          {filtered.map(l => <LawyerCard key={l.id} lawyer={l} onView={onView} onBook={onBook} />)}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  LAWYER PROFILE PAGE (detail)
// ══════════════════════════════════════════════════════════════════
function LawyerProfilePage({ lawyer, onBack, onBook }) {
  const [tab, setTab] = useState("overview");
  const tabs = [{ key:"overview", label:"Overview" }, { key:"achievements", label:"Achievements" }, { key:"contact", label:"Contact" }];

  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:13, fontWeight:600, marginBottom:20, fontFamily:"inherit" }}>
        {I.back()} Back to Directory
      </button>

      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${lawyer.accent} 100%)`, borderRadius:20, padding:"40px 40px 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.03)" }} />
        <div style={{ position:"absolute", top:-60, right:"10%", width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />

        <div style={{ display:"flex", gap:28, alignItems:"flex-start", flexWrap:"wrap", position:"relative" }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <LawyerAvatar lawyer={lawyer} size={110} />
            <span style={{ position:"absolute", bottom:-8, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.gold},${C.goldL})`, color:"#fff", fontSize:9, fontWeight:800, padding:"3px 10px", borderRadius:12, whiteSpace:"nowrap", letterSpacing:"0.1em" }}>⭐ {lawyer.badge}</span>
          </div>

          <div style={{ flex:1, minWidth:200, color:"#fff" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:6 }}>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:0 }}>{lawyer.name}</h1>
              <span style={{ background:"rgba(200,149,42,0.25)", border:"1px solid rgba(200,149,42,0.5)", color:C.goldL, borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>Avvo {lawyer.avvo}</span>
            </div>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.55)", margin:"0 0 10px" }}>{lawyer.title} · {lawyer.firm}</p>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:8 }}>
              <StarRating rating={lawyer.rating} size={14} />
              <span style={{ fontWeight:700, fontSize:14, marginLeft:2 }}>{lawyer.rating.toFixed(1)}</span>
              <span style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>({lawyer.reviews.toLocaleString()} reviews)</span>
            </div>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap", fontSize:13, color:"rgba(255,255,255,0.5)" }}>
              <span>🏛 Licensed {lawyer.licensed}</span>
              <span>📋 Bar #{lawyer.barNumber}</span>
              <span>📅 Since {lawyer.since}</span>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
              {lawyer.practice.map(p => <span key={p} style={{ background:"rgba(255,255,255,0.12)", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600, color:"#fff" }}>{p}</span>)}
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10, flexShrink:0 }}>
            <a href={`tel:${lawyer.phone}`} style={{ background:`linear-gradient(135deg,${C.info},#1a56a8)`, color:"#fff", borderRadius:12, padding:"14px 22px", textDecoration:"none", textAlign:"center", fontFamily:"inherit" }}>
              <div style={{ fontSize:11, fontWeight:600, opacity:.8, marginBottom:2 }}>FREE Consultation</div>
              <div style={{ fontSize:17, fontWeight:800 }}>{lawyer.phone}</div>
            </a>
            <button onClick={() => onBook(lawyer)} style={{ background:`linear-gradient(135deg,${C.gold},${C.goldL})`, color:"#fff", border:"none", borderRadius:12, padding:"13px 22px", cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {I.cal2(16)} Book Appointment
            </button>
          </div>
        </div>

        <div style={{ display:"flex", marginTop:24 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ background:"none", border:"none", cursor:"pointer", color:tab===t.key?"#fff":"rgba(255,255,255,0.4)", fontSize:13, fontWeight:700, padding:"10px 22px", fontFamily:"inherit", borderBottom:tab===t.key?`2px solid ${C.goldL}`:"2px solid transparent", transition:"all .18s" }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Tab body */}
      <Card style={{ borderTopLeftRadius:0, borderTopRightRadius:0, borderTop:"none" }}>
        {tab === "overview" && (
          <div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:C.navy, marginBottom:12 }}>About</h3>
            <p style={{ lineHeight:1.78, color:"#3a4a5e", fontSize:14, marginBottom:28 }}>{lawyer.bio}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
              <div>
                <h4 style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:12 }}>Education</h4>
                {lawyer.education.map((e,i) => (
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                    <span style={{ color:C.gold, flexShrink:0, marginTop:1 }}>{I.book(14)}</span>
                    <span style={{ fontSize:13, color:"#3a4a5e", lineHeight:1.5 }}>{e}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:12 }}>Languages</h4>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
                  {lawyer.languages.map(l => <span key={l} style={{ background:"#eef2f9", color:C.blue, borderRadius:20, padding:"5px 14px", fontSize:13, fontWeight:600 }}>{l}</span>)}
                </div>
                <h4 style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:12 }}>Practice Areas</h4>
                {lawyer.practice.map(p => (
                  <div key={p} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
                    {I.shield(14)} <span style={{ fontSize:13, color:"#3a4a5e" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontStyle:"italic", color:C.muted, fontSize:13, marginTop:24, borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
              "{lawyer.tagline}"
            </div>
          </div>
        )}
        {tab === "achievements" && (
          <div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:C.navy, marginBottom:20 }}>Awards & Recognition</h3>
            {lawyer.achievements.map((a,i) => (
              <div key={i} style={{ display:"flex", gap:14, alignItems:"center", padding:"14px 18px", background:i%2===0?C.cream:C.white, borderRadius:12, marginBottom:10, border:`1px solid ${C.border}` }}>
                <div style={{ background:`linear-gradient(135deg,${C.gold},${C.goldL})`, color:"#fff", width:34, height:34, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{I.award(16)}</div>
                <span style={{ fontSize:14, color:"#3a4a5e", fontWeight:500 }}>{a}</span>
              </div>
            ))}
          </div>
        )}
        {tab === "contact" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              [I.phone(18),"Primary Phone", lawyer.phone,     false],
              [I.phone(18),"Alt. Phone",    lawyer.phone2,    false],
              [I.mail(18), "Email",         lawyer.email,     false],
              [I.globe(18),"Website",       lawyer.website,   false],
              [I.pin(18),  "Office Address",lawyer.address,   true],
              [I.brief(18),"Bar Number",    lawyer.barNumber, false],
              [I.book(18), "Licensed Since",lawyer.since,     false],
            ].map(([icon,label,value,full],i) => (
              <div key={i} style={{ background:"#f6f9fc", borderRadius:14, padding:"16px 18px", border:`1px solid ${C.border}`, gridColumn:full?"1 / -1":"auto" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ color:lawyer.accent }}>{icon}</span>
                  <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:C.muted }}>{label}</span>
                </div>
                <div style={{ fontSize:14, color:C.navy, fontWeight:500 }}>{value}</div>
              </div>
            ))}
            <div style={{ gridColumn:"1 / -1" }}>
              <button onClick={() => onBook(lawyer)} style={{ width:"100%", background:`linear-gradient(135deg,${lawyer.accent},${lawyer.accent}cc)`, color:"#fff", border:"none", borderRadius:14, padding:"16px 28px", cursor:"pointer", fontWeight:700, fontSize:16, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                {I.cal2(20)} Book an Appointment with {lawyer.name.split(" ")[0]}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  USER — APPOINTMENTS PAGE
// ══════════════════════════════════════════════════════════════════
function UserAppointments({ toast, onViewDirectory }) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving,  setSaving]  = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/appointments").then(r => { setData(r.data||[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const handleAdd = async (f) => {
    if (!f.customer_id) return toast("Customer ID is required","error");
    setSaving(true);
    const r = await api.post("/appointments", { customer_id:parseInt(f.customer_id), lawyer_id:parseInt(f.lawyer_id), slot_id:parseInt(f.slot_id), request_text:f.request_text||null, response_text:f.response_text||null });
    setSaving(false);
    if (r.success) { toast("Appointment created!"); setShowAdd(false); load(); } else toast(r.message||"Error","error");
  };

  const rows = data.map(a => [
    <span style={{ fontWeight:700, color:C.blue }}>#{a.id}</span>,
    `ID: ${a.customer_id}`,
    (() => { const l = LAWYERS.find(x => x.id === a.lawyer_id); return l ? <span style={{ display:"flex", alignItems:"center", gap:6 }}><LawyerAvatar lawyer={l} size={22} />{l.name.split(" ").slice(-1)[0]}</span> : `ID: ${a.lawyer_id}`; })(),
    <Badge label={slotLabel(a.slot_id)} bg="#dbeafe" color="#1e40af" />,
    <span style={{ maxWidth:160, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontSize:13 }}>{a.request_text||<span style={{color:C.border}}>—</span>}</span>,
    <span style={{ fontSize:12, color:C.muted }}>{new Date(a.created_at).toLocaleDateString()}</span>,
  ]);

  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      {/* Top strip */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:18, padding:"20px 24px", marginBottom:24, display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", color:"#fff", fontSize:18, margin:"0 0 4px" }}>My Appointments</h2>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, margin:0 }}>View all your booked appointments below</p>
        </div>
        <Btn variant="gold" onClick={onViewDirectory}>{I.users()} Find a Lawyer</Btn>
        <Btn onClick={() => setShowAdd(true)}>{I.plus()} Book Appointment</Btn>
      </div>

      <Card>
        {loading ? <Spinner /> : data.length===0 ? <EmptyState msg="No appointments yet. Browse our lawyers and book your first one!" /> : (
          <Table heads={["#","Customer","Lawyer","Slot","Request","Date"]} rows={rows} />
        )}
      </Card>

      {showAdd && (
        <Modal title="Book New Appointment" onClose={() => setShowAdd(false)}>
          <AppointmentForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  USER LAYOUT
// ══════════════════════════════════════════════════════════════════
function UserLayout({ toast, onLogout }) {
  const [page,         setPage]         = useState("appointments");
  const [viewedLawyer, setViewedLawyer] = useState(null);
  const [bookLawyer,   setBookLawyer]   = useState(null);
  const [saving,       setSaving]       = useState(false);

  const nav = [
    { key:"appointments", label:"My Appointments", icon:I.cal()   },
    { key:"reschedules",  label:"Reschedule",       icon:I.re()    },
    { key:"directory",    label:"Find a Lawyer",    icon:I.users() },
  ];

  const handleBook = useCallback((lawyer) => { setBookLawyer(lawyer); }, []);
  const handleView = useCallback((lawyer) => { setViewedLawyer(lawyer); setPage("profile"); }, []);

  const handleBookSubmit = async (f) => {
    if (!f.customer_id) return toast("Customer ID is required","error");
    setSaving(true);
    const r = await api.post("/appointments", { customer_id:parseInt(f.customer_id), lawyer_id:parseInt(f.lawyer_id), slot_id:parseInt(f.slot_id), request_text:f.request_text||null, response_text:f.response_text||null });
    setSaving(false);
    if (r.success) { toast(`Appointment with ${bookLawyer?.name} created!`); setBookLawyer(null); }
    else toast(r.message||"Error","error");
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <header style={{ background:`linear-gradient(135deg,${C.navy},#1a3558)`, color:"#fff", padding:"0 32px", display:"flex", alignItems:"center", gap:20, height:58, boxShadow:"0 2px 20px rgba(0,0,0,0.3)", position:"sticky", top:0, zIndex:500 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:30, height:30, background:`linear-gradient(135deg,${C.gold},${C.goldL})`, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>⚖️</div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17 }}>LawPortal</span>
        </div>
        <nav style={{ display:"flex", gap:2, flex:1 }}>
          {nav.map(n => (
            <button key={n.key} onClick={() => setPage(n.key)} style={{ background:page===n.key?"rgba(255,255,255,0.15)":"transparent", border:"none", color:page===n.key?"#fff":"rgba(255,255,255,0.5)", borderRadius:8, padding:"6px 14px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, borderBottom:page===n.key?`2px solid ${C.goldL}`:"2px solid transparent", transition:"all .18s" }}>{n.icon}{n.label}</button>
          ))}
        </nav>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <span style={{ background:"rgba(26,106,191,0.35)", border:"1px solid rgba(26,106,191,0.5)", color:"#fff", borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700 }}>👤 CLIENT</span>
          <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.7)", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>{I.logout()} Logout</button>
        </div>
      </header>

      <main style={{ maxWidth:1080, margin:"0 auto", padding:"36px 20px 64px" }}>
        {page==="appointments" && <UserAppointments toast={toast} onViewDirectory={() => setPage("directory")} />}
        {page==="reschedules"  && <Card><RescheduleSection toast={toast} /></Card>}
        {page==="directory"    && <LawyerDirectory onView={handleView} onBook={handleBook} />}
        {page==="profile"      && viewedLawyer && (
          <LawyerProfilePage lawyer={viewedLawyer} onBack={() => { setPage("directory"); setViewedLawyer(null); }} onBook={handleBook} />
        )}
      </main>

      {bookLawyer && (
        <Modal title={`Book with ${bookLawyer.name}`} onClose={() => setBookLawyer(null)}>
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"#f6f9fc", borderRadius:12, marginBottom:20 }}>
            <LawyerAvatar lawyer={bookLawyer} size={42} />
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:C.navy }}>{bookLawyer.name}</div>
              <div style={{ fontSize:12, color:C.muted }}>{bookLawyer.practice.join(" · ")}</div>
            </div>
          </div>
          <AppointmentForm lawyerId={bookLawyer.id} onSubmit={handleBookSubmit} onCancel={() => setBookLawyer(null)} saving={saving} />
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  LAWYER — APPOINTMENTS
// ══════════════════════════════════════════════════════════════════
function LawyerAppointments({ toast }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving]   = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/appointments").then(r => { setData(r.data||[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const handleAdd = async (f) => {
    if (!f.customer_id) return toast("Customer ID is required","error");
    setSaving(true);
    const r = await api.post("/appointments", { customer_id:parseInt(f.customer_id), lawyer_id:parseInt(f.lawyer_id), slot_id:parseInt(f.slot_id), request_text:f.request_text||null, response_text:f.response_text||null });
    setSaving(false);
    if (r.success) { toast("Appointment added!"); setShowAdd(false); load(); } else toast(r.message||"Error","error");
  };

  const now = new Date();
  const stats = [
    { label:"Total",       value:data.length,        color:C.blue   },
    { label:"This Month",  value:data.filter(a => new Date(a.created_at).getMonth()===now.getMonth()).length, color:C.gold },
    { label:"No Response", value:data.filter(a => !a.response_text).length, color:"#7c3aed" },
  ];

  const rows = data.map(a => [
    <span style={{ fontWeight:700, color:C.blue }}>#{a.id}</span>,
    `ID: ${a.customer_id}`,
    <Badge label={slotLabel(a.slot_id)} bg="#dbeafe" color="#1e40af" />,
    <span style={{ maxWidth:180, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.request_text||<span style={{color:C.border}}>—</span>}</span>,
    <span style={{ maxWidth:160, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.response_text||<span style={{color:C.border}}>—</span>}</span>,
    <span style={{ fontSize:12, color:C.muted }}>{new Date(a.created_at).toLocaleDateString()}</span>,
  ]);

  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding:"20px 22px", borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:28, fontWeight:800, color:s.color, fontFamily:"'Playfair Display',serif" }}>{s.value}</div>
            <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <SectionHead icon={I.cal()} title="All Appointments" sub="View and manage client bookings" />
          <Btn onClick={() => setShowAdd(true)}>{I.plus()} Add Appointment</Btn>
        </div>
        {loading ? <Spinner /> : data.length===0 ? <EmptyState msg="No appointments found." /> : (
          <Table heads={["#","Customer","Slot","Request","Response","Date"]} rows={rows} />
        )}
      </Card>
      {showAdd && <Modal title="Add New Appointment" onClose={() => setShowAdd(false)}><AppointmentForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} /></Modal>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  LAWYER LAYOUT
// ══════════════════════════════════════════════════════════════════
function LawyerLayout({ lawyerUser, toast, onLogout }) {
  const [page, setPage] = useState("appointments");
  const nav = [
    { key:"appointments", label:"Appointments", icon:I.cal()   },
    { key:"reschedules",  label:"Reschedules",  icon:I.re()    },
    { key:"directory",    label:"All Lawyers",  icon:I.users() },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#eef0f4", fontFamily:"'DM Sans',sans-serif", display:"flex" }}>
      <aside style={{ width:240, background:`linear-gradient(180deg,${C.navy} 0%,#162840 100%)`, display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:"28px 22px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, background:`linear-gradient(135deg,${C.gold},${C.goldL})`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚖️</div>
            <div>
              <div style={{ color:"#fff", fontFamily:"'Playfair Display',serif", fontSize:17, lineHeight:1 }}>LawPortal</div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, letterSpacing:"0.08em" }}>LAWYER PANEL</div>
            </div>
          </div>
        </div>
        <div style={{ padding:"20px 22px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <LawyerAvatar lawyer={lawyerUser} size={52} />
          <div style={{ color:"#fff", fontSize:13, fontWeight:700, marginBottom:2, marginTop:10 }}>{lawyerUser.name}</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, marginBottom:8 }}>{lawyerUser.firm}</div>
          <div style={{ display:"flex", gap:3 }}>
            <StarRating rating={lawyerUser.rating} size={10} />
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginLeft:3 }}>{lawyerUser.rating}</span>
          </div>
        </div>
        <nav style={{ padding:"16px 12px", flex:1 }}>
          {nav.map(n => (
            <button key={n.key} onClick={() => setPage(n.key)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, background:page===n.key?"rgba(255,255,255,0.11)":"transparent", border:"none", borderLeft:page===n.key?`3px solid ${C.goldL}`:"3px solid transparent", color:page===n.key?"#fff":"rgba(255,255,255,0.4)", borderRadius:10, padding:"11px 14px", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600, marginBottom:4, textAlign:"left", transition:"all .18s" }}>{n.icon}{n.label}</button>
          ))}
        </nav>
        <div style={{ padding:"16px 22px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={onLogout} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", borderRadius:10, padding:"10px 14px", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>{I.logout()} Sign Out</button>
        </div>
      </aside>

      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <header style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 32px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", position:"sticky", top:0, zIndex:200 }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:C.navy, margin:0 }}>
              {page==="appointments" ? "Appointment Management" : page==="reschedules" ? "Reschedule Management" : "Lawyer Directory"}
            </h2>
            <p style={{ fontSize:12, color:C.muted, margin:0 }}>
              {page==="appointments" ? "View and manage all client appointments" : page==="reschedules" ? "View, add, edit, and delete reschedule requests" : "Browse all registered attorneys"}
            </p>
          </div>
          <span style={{ background:"rgba(200,149,42,0.15)", border:"1px solid rgba(200,149,42,0.4)", color:C.gold, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700 }}>⚖️ LAWYER</span>
        </header>
        <main style={{ flex:1, padding:"28px 32px 64px", overflowY:"auto" }}>
          {page==="appointments" && <LawyerAppointments toast={toast} />}
          {page==="reschedules"  && <Card><RescheduleSection toast={toast} /></Card>}
          {page==="directory"    && <LawyerDirectory onView={() => {}} onBook={() => {}} />}
        </main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  LOGIN PAGE
// ══════════════════════════════════════════════════════════════════
function LoginPage({ onLoginUser, onLoginLawyer }) {
  const [hov, setHov]               = useState(null);
  const [lawyerPick, setLawyerPick] = useState(null);

  if (lawyerPick) {
    return (
      <div style={{ minHeight:"100vh", background:`linear-gradient(145deg,${C.navy},#1a3860 55%,#0d2440)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:24 }}>
        <div style={{ maxWidth:560, width:"100%" }}>
          <button onClick={() => setLawyerPick(null)} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontSize:13, fontWeight:600, marginBottom:24, fontFamily:"inherit" }}>{I.back()} Back</button>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#fff", margin:"0 0 6px" }}>Sign in as Lawyer</h2>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:24 }}>Choose your profile:</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {LAWYERS.map(l => (
              <button key={l.id} onClick={() => onLoginLawyer(l)}
                onMouseEnter={() => setHov(l.id)} onMouseLeave={() => setHov(null)}
                style={{ background:hov===l.id?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.05)", border:`1.5px solid ${hov===l.id ? l.accent+"cc" : "rgba(255,255,255,0.08)"}`, borderRadius:14, padding:"16px 14px", cursor:"pointer", color:"#fff", textAlign:"left", fontFamily:"inherit", transition:"all .2s", transform:hov===l.id?"translateY(-2px)":"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <LawyerAvatar lawyer={l} size={38} />
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, lineHeight:1.3 }}>{l.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{l.firm}</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {l.practice.slice(0,2).map(p => <span key={p} style={{ background:l.accent+"30", color:l.accent, borderRadius:12, padding:"2px 7px", fontSize:10, fontWeight:600 }}>{p}</span>)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(145deg,${C.navy} 0%,#1a3860 55%,#0d2440 100%)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:24, position:"relative", overflow:"hidden" }}>
      {[["6%","8%","380px"],["72%","-4%","260px"]].map(([t,l,s],i) => (
        <div key={i} style={{ position:"fixed", top:t, left:l, width:s, height:s, borderRadius:"50%", background:"rgba(255,255,255,0.025)", pointerEvents:"none" }} />
      ))}

      <div style={{ maxWidth:540, width:"100%", position:"relative" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:68, height:68, background:`linear-gradient(135deg,${C.gold},${C.goldL})`, borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 18px", boxShadow:"0 10px 30px rgba(200,149,42,0.4)" }}>⚖️</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:"#fff", margin:"0 0 8px" }}>LawPortal</h1>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Appointment Management System</p>
        </div>

        {/* Mini lawyer strip */}
        <div style={{ display:"flex", gap:10, marginBottom:28, overflowX:"auto", paddingBottom:4 }}>
          {LAWYERS.map(l => (
            <div key={l.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, flexShrink:0 }}>
              <LawyerAvatar lawyer={l} size={40} />
              <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)", textAlign:"center", maxWidth:52 }}>{l.name.split(" ").slice(-1)[0]}</span>
            </div>
          ))}
        </div>

        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, textAlign:"center", marginBottom:18 }}>Select your role to continue:</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
          {[
            { role:"user",   emoji:"👤", label:"Client / User",  desc:"Browse lawyers, book appointments, manage reschedules", accent:"#1a6abf", action: onLoginUser  },
            { role:"lawyer", emoji:"⚖️", label:"Lawyer",         desc:"Full dashboard: appointments and reschedule management",  accent:C.gold,   action: () => setLawyerPick(true) },
          ].map(r => (
            <button key={r.role} onClick={r.action}
              onMouseEnter={() => setHov(r.role)} onMouseLeave={() => setHov(null)}
              style={{ background:hov===r.role?"rgba(255,255,255,0.13)":"rgba(255,255,255,0.06)", border:`2px solid ${hov===r.role?r.accent:"rgba(255,255,255,0.1)"}`, borderRadius:18, padding:"26px 18px", cursor:"pointer", color:"#fff", textAlign:"center", fontFamily:"inherit", transform:hov===r.role?"translateY(-4px)":"none", transition:"all .2s" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{r.emoji}</div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:8, color:hov===r.role?r.accent:"#fff" }}>{r.label}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{r.desc}</div>
            </button>
          ))}
        </div>
        <p style={{ color:"rgba(255,255,255,0.15)", fontSize:11, textAlign:"center" }}>Demo mode — no password required</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  ROOT
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null); // null | { role, lawyer? }
  const [toast,   setToast]   = useState(null);
  const showToast = useCallback((msg, type="success") => setToast({ msg, type }), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{-webkit-font-smoothing:antialiased}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#c8d5e2;border-radius:3px}
        input::placeholder{color:rgba(255,255,255,0.3)}
      `}</style>

      {!session && (
        <LoginPage
          onLoginUser={()   => setSession({ role:"user" })}
          onLoginLawyer={(l) => setSession({ role:"lawyer", lawyer:l })}
        />
      )}
      {session?.role === "user"   && <UserLayout   toast={showToast} onLogout={() => setSession(null)} />}
      {session?.role === "lawyer" && <LawyerLayout lawyerUser={session.lawyer} toast={showToast} onLogout={() => setSession(null)} />}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}
