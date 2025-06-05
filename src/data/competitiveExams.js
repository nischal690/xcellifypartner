export const competitiveExams = {
  school_level_exams: [
    {
      name: "NTSE",
      full_form: "National Talent Search Exam",
      purpose: "Scholarship for Class 10 students"
    },
    {
      name: "KVPY",
      full_form: "Kishore Vaigyanik Protsahan Yojana",
      purpose: "Scholarship for science stream students"
    },
    {
      name: "RMO/INMO",
      full_form: "Regional/Indian National Mathematical Olympiad",
      purpose: "Selection for international Olympiads"
    },
    {
      name: "SOF Olympiads",
      full_form: "NSO, IMO, IEO, NCO",
      purpose: "Subject-wise Olympiads for school students"
    },
    {
      name: "NSTSE",
      full_form: "National Level Science Talent Search Exam",
      purpose: "Science and Math aptitude test"
    },
    {
      name: "GeoGenius",
      purpose: "Geography awareness"
    },
    {
      name: "Green Olympiad",
      purpose: "Environmental awareness"
    }
  ],
  after_12th_exams: {
    engineering: [
      { name: "JEE Main", purpose: "Admission to NITs, IIITs" },
      { name: "JEE Advanced", purpose: "Admission to IITs" },
      { name: "BITSAT", purpose: "Admission to BITS campuses" },
      { name: "VITEEE", purpose: "Admission to VIT University" },
      { name: "SRMJEEE", purpose: "Admission to SRM University" },
      { name: "AEEE", purpose: "Admission to Amrita University" },
      { name: "MU-OET", purpose: "Admission to Manipal University" }
    ],
    medical: [
      { name: "NEET-UG", purpose: "Admission to MBBS, BDS, etc." },
      { name: "AIIMS MBBS", purpose: "Merged with NEET" },
      { name: "JIPMER", purpose: "Merged with NEET" }
    ],
    law: [
      { name: "CLAT", purpose: "Admission to NLUs" },
      { name: "AILET", purpose: "Admission to NLU Delhi" },
      { name: "SLAT", purpose: "Symbiosis Law Admission" },
      { name: "LSAT India", purpose: "Law school admissions in India" }
    ],
    commerce_management: [
      { name: "CUET UG", purpose: "Admission to Central Universities" },
      { name: "IPMAT", purpose: "Integrated MBA at IIMs" },
      { name: "NPAT", purpose: "Admission to NMIMS" },
      { name: "Christ University Entrance Test", purpose: "Various UG courses" }
    ]
  },
  postgraduate_exams: {
    management: [
      { name: "CAT", purpose: "Admission to IIMs and other MBA colleges" },
      { name: "XAT", purpose: "Admission to XLRI and others" },
      { name: "CMAT", purpose: "Admission to AICTE-approved institutes" },
      { name: "MAT", purpose: "Management Aptitude Test for B-Schools" },
      { name: "SNAP", purpose: "Symbiosis MBA entrance" },
      { name: "NMAT", purpose: "Admission to NMIMS and others" }
    ],
    postgraduate_general: [
      { name: "CUET PG", purpose: "Admission to Central Universities" },
      { name: "TISSNET", purpose: "Social Sciences PG programs" },
      { name: "IIFT", purpose: "MBA in International Business" },
      { name: "ICAR AIEEA PG", purpose: "Agriculture PG courses" }
    ],
    engineering_science: [
      { name: "GATE", purpose: "M.Tech admission & PSU jobs" },
      { name: "CSIR NET", purpose: "Lectureship & PhD in Science" },
      { name: "UGC NET", purpose: "Lectureship & PhD in Arts/Commerce" },
      { name: "JEST", purpose: "PhD entrance in Physics/Math" },
      { name: "IIT JAM", purpose: "MSc in IITs" }
    ]
  },
  civil_services_government: [
    { name: "UPSC CSE", full_form: "Civil Services Examination", purpose: "IAS, IPS, IFS" },
    { name: "IES", full_form: "Indian Engineering Services", purpose: "Engineering officers in government" },
    { name: "IFS", full_form: "Indian Forest Services", purpose: "Forest officers" },
    { name: "SSC CGL", purpose: "Central Government jobs" },
    { name: "SSC CHSL", purpose: "Lower Division Clerk and similar jobs" },
    { name: "SSC GD", purpose: "Constable recruitment" },
    { name: "RRB NTPC", purpose: "Railway non-technical jobs" },
    { name: "RRB Group D", purpose: "Railway Group D jobs" },
    { name: "IBPS PO", purpose: "Bank Probationary Officer" },
    { name: "IBPS Clerk", purpose: "Clerical jobs in banks" },
    { name: "IBPS RRB", purpose: "Regional Rural Banks" },
    { name: "SBI PO", purpose: "Probationary Officer in SBI" },
    { name: "SBI Clerk", purpose: "Clerical post in SBI" },
    { name: "LIC AAO", purpose: "LIC Assistant Administrative Officer" },
    { name: "LIC ADO", purpose: "LIC Development Officer" },
    { name: "EPFO Exams", purpose: "Provident Fund organization posts" },
    { name: "ESIC Exams", purpose: "Insurance Corporation posts" },
    { name: "State PCS", purpose: "State administrative jobs" }
  ],
  judiciary_law: [
    { name: "Judicial Services Exam", alias: "PCS-J", purpose: "Judge selection at state level" },
    { name: "CLAT PG", purpose: "LLM admissions" },
    { name: "AIBE", full_form: "All India Bar Exam", purpose: "Certificate to practice law" }
  ],
  defence_exams: [
    { name: "NDA", full_form: "National Defence Academy", purpose: "Army, Navy, Air Force (after 12th)" },
    { name: "CDS", full_form: "Combined Defence Services", purpose: "Officer posts for graduates" },
    { name: "AFCAT", purpose: "Indian Air Force selection" },
    { name: "INET", purpose: "Navy recruitment" },
    { name: "SSR/AA", purpose: "Senior Secondary Recruit/Aviation Artificer Apprentice in Navy" },
    { name: "CAPF", full_form: "Central Armed Police Forces", purpose: "Assistant Commandant" },
    { name: "Territorial Army Exam", purpose: "Officer post in TA (reserves)" }
  ],
  professional_exams: [
    { name: "CA Exams", levels: ["Foundation", "Intermediate", "Final"], purpose: "Chartered Accountant" },
    { name: "CMA Exams", levels: ["Foundation", "Inter", "Final"], purpose: "Cost & Management Accounting" },
    { name: "CS Exams", levels: ["Executive", "Professional"], purpose: "Company Secretary" },
    { name: "NTA NET", purpose: "Lectureship/PhD (Arts, Commerce, Science)" },
    { name: "RBI Grade B", purpose: "RBI Officer recruitment" },
    { name: "SEBI Grade A", purpose: "Securities Officer" },
    { name: "NABARD Grade A/B", purpose: "Rural development bank officer" },
    { name: "UGC JRF", purpose: "Junior Research Fellowship" }
  ]
};

// Create a flattened array of all exams for easier searching
export const getAllExams = () => {
  const allExams = [];
  
  // Add school level exams
  competitiveExams.school_level_exams.forEach(exam => {
    allExams.push(exam);
  });
  
  // Add after 12th exams
  Object.values(competitiveExams.after_12th_exams).forEach(category => {
    category.forEach(exam => {
      allExams.push(exam);
    });
  });
  
  // Add postgraduate exams
  Object.values(competitiveExams.postgraduate_exams).forEach(category => {
    category.forEach(exam => {
      allExams.push(exam);
    });
  });
  
  // Add remaining categories
  ['civil_services_government', 'judiciary_law', 'defence_exams', 'professional_exams'].forEach(category => {
    competitiveExams[category].forEach(exam => {
      allExams.push(exam);
    });
  });
  
  return allExams;
};
