export const TutoringPackageSchema = [
  { name: 'package_title', label: 'Package Title', type: 'text' },
  {
    name: 'pricing_type',
    label: 'Pricing Type',
    type: 'select',
    options: ['Per Hour', 'Per Session'],
  },
  { name: 'package_duration_hours', label: 'Duration (hours)', type: 'number' },
  { name: 'package_details', label: 'Package Description', type: 'textarea' },
  {
    name: 'mode_of_teaching',
    label: 'Mode of Teaching',
    type: 'multiselect',
    options: ['online', 'in-person'],
  },
  {
    name: 'study_levels',
    label: 'Study Levels',
    type: 'multiselect',
    options: ['Primary', 'Undergraduate'],
  },
  {
    name: 'subjects',
    label: 'Subjects',
    type: 'multiselect',
    options: ['Math', 'Science', 'English'],
  },
  {
    name: 'language_medium',
    label: 'Language Medium',
    type: 'multiselect',
    options: ['English', 'Hindi'],
  },
  {
    name: 'materials_provided',
    label: 'Materials Provided',
    type: 'createselect',
    options: [],
  },
  {
    name: 'available_slots',
    label: 'Available Slots',
    type: 'createselect',
    options: [],
  },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'discount_percent', label: 'Discount (%)', type: 'number' },
  {
    name: 'currency',
    label: 'Currency',
    type: 'select',
    options: ['INR', 'USD'],
  },
];

export const SummerCoursesPackageSchema = [
  {
    name: 'package_title',
    label: 'Package Title',
    type: 'text',
  },
  {
    name: 'pricing_type',
    label: 'Pricing Type',
    type: 'select',
    options: ['Per Hour', 'Per Session'],
  },
  {
    name: 'schedule',
    label: 'Schedule',
    type: 'select',
    options: [
      'Weekdays, Morning',
      'Weekdays, Evening',
      'Weekends, 10 AM - 12 PM',
      'Flexible',
    ],
  },
  {
    name: 'included_services',
    label: 'Included Services',
    type: 'multiselect',
    options: [
      'Live Lectures',
      'Practice Worksheets',
      'Recorded Videos',
      '1-on-1 Doubt Sessions',
      'Group Activities',
      'Assessments',
      'Certificate',
    ],
  },
  {
    name: 'session_duration_mins',
    label: 'Session Duration (mins)',
    type: 'number',
  },
  {
    name: 'number_of_sessions',
    label: 'Number of Sessions',
    type: 'number',
  },
  {
    name: 'mode_of_delivery',
    label: 'Mode of Delivery',
    type: 'select',
    options: ['Online', 'Offline', 'Hybrid'],
  },
  {
    name: 'additional_notes',
    label: 'Additional Notes',
    type: 'textarea',
  },
  {
    name: 'price',
    label: 'Price (₹)',
    type: 'number',
  },
  {
    name: 'discount_percent',
    label: 'Discount (%)',
    type: 'number',
  },
  {
    name: 'currency',
    label: 'Currency',
    type: 'select',
    options: ['INR', 'USD'],
  },
];

export const MentoringPackageSchema = [
  {
    name: 'package_title',
    label: 'Package Title',
    type: 'text',
  },
  {
    name: 'pricing_type',
    label: 'Pricing Type',
    type: 'select',
    options: ['Fixed', 'Per Hour', 'Per Session'],
  },
  {
    name: 'package_duration',
    label: 'Package Duration (in days)',
    type: 'text',
  },
  {
    name: 'included_services',
    label: 'Included Services',
    type: 'multiselect',
    options: [
      'Free Consultation',
      'Follow-up Materials',
      'Goal Setting Session',
      'Progress Evaluation',
      'Live Q&A',
    ],
  },
  {
    name: 'session_duration_mins',
    label: 'Session Duration (mins)',
    type: 'number',
  },
  {
    name: 'number_of_sessions',
    label: 'Number of Sessions',
    type: 'number',
  },
  {
    name: 'mode_of_delivery',
    label: 'Mode of Service',
    type: 'select',
    options: ['Online', 'Offline', 'Hybrid'],
  },
  {
    name: 'additional_notes',
    label: 'Additional Notes',
    type: 'textarea',
  },
  {
    name: 'price',
    label: 'Price (in ₹)',
    type: 'number',
  },
  {
    name: 'discount_percent',
    label: 'Discount (%)',
    type: 'number',
  },
  {
    name: 'currency',
    label: 'Currency',
    type: 'select',
    options: ['INR', 'USD'],
  },
];

export const competitativeExamSchema = [
  {
    name: 'package_title',
    label: 'Package Title',
    type: 'text',
  },
  {
    name: 'pricing_type',
    label: 'Pricing Type',
    type: 'select',
    options: ['Per Hour', 'Per Session'],
  },
  {
    name: 'package_duration',
    label: 'Package Duration',
    type: 'number',
  },
  {
    name: 'included_services',
    label: 'Included Services',
    type: 'multiselect',
    options: ['Test', 'Live Classes', 'Practice Tests', 'Study Material'],
  },
  {
    name: 'session_duration_mins',
    label: 'Session Duration (minutes)',
    type: 'number',
  },
  {
    name: 'number_of_sessions',
    label: 'Number of Sessions',
    type: 'number',
  },
  {
    name: 'additional_notes',
    label: 'Additional Notes',
    type: 'text',
  },
  {
    name: 'mode_of_delivery',
    label: 'Mode of Delivery',
    type: 'select',
    options: ['online', 'offline', 'hybrid'],
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
  },
  {
    name: 'discount_percent',
    label: 'Discount Percent',
    type: 'number',
  },
  {
    name: 'currency',
    label: 'Currency',
    type: 'text',
  },
];

export const careerCounsellingSchema = [
  {
    name: 'package_title',
    label: 'Package Title',
    type: 'text',
  },
  {
    name: 'pricing_type',
    label: 'Pricing Type',
    type: 'select',
    options: ['Per Hour', 'Per Session'],
  },
  {
    name: 'package_duration',
    label: 'Package Duration',
    type: 'number',
  },
  {
    name: 'package_details',
    label: 'Package Details',
    type: 'textarea',
  },
  {
    name: 'mode_of_service',
    label: 'Mode of Service',
    type: 'select',
    options: ['Online', 'Offline', 'Hybrid'],
  },
  {
    name: 'included_services',
    label: 'Included Services',
    type: 'multiselect',
    options: ['Live Lectures', 'Doubt Clearing', 'Assignments', 'Mock Tests'],
  },
  {
    name: 'session_duration_mins',
    label: 'Session Duration (minutes)',
    type: 'number',
  },
  {
    name: 'number_of_sessions',
    label: 'Number of Sessions',
    type: 'number',
  },
  {
    name: 'additional_notes',
    label: 'Additional Notes',
    type: 'textarea',
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
  },
  {
    name: 'discount_percent',
    label: 'Discount Percent',
    type: 'number',
  },
  {
    name: 'currency',
    label: 'Currency',
    type: 'text',
  },
];
