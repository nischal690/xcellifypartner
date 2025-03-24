export const hsnCodeMapping = {
  'Study overseas': '999294',
  'Study India': '999294',
  'Career counselling': '999293',
  Events: '998596',
  'Study Finance': '997156',
  Tutoring: '999293',
  'Summer courses': '999293',
};

export const gstRateMapping = {
  'Study overseas': '18',
  'Study India': '18',
  'Career counselling': '18',
  Events: '18',
  'Study Finance': '18',
  Tutoring: '18',
  'Summer courses': '18',
};

export const OptionCountries = [
  'USA',
  'Canada',
  'UK',
  'Europe',
  'Australia',
  'India',
  'Other Asian Countries',
  'Others',
].map((country) => ({
  value: country,
  label: country,
}));

export const loadServiceDelivary = ['Online', 'Physical'].map((service) => ({
  value: service,
  label: service,
}));

export const loadStudyLevel = ['UG', 'PG'].map((level) => ({
  value: level,
  label: level,
}));

export const loadTutorStudyLevel = [
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  'Graduation',
].map((level) => ({
  value: level,
  label: level,
}));

export const loadModeOfTeaching = [
  'Online(1 on 1)',
  'Online(group)',
  'Physical(1 on 1)',
  'Physical(group)',
  'Home Visits',
].map((mode) => ({
  value: mode,
  label: mode,
}));

export const loadSubjects = [
  'Maths',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'History',
  'Geography',
  'Others',
].map((subject) => ({
  value: subject,
  label: subject,
}));

export const loadCounsellingLevel = [
  'Under grade 6',
  '6th to 8th',
  '9th & 10th',
  '11th & 12th',
  'UG',
].map((level) => ({
  value: level,
  label: level,
}));

export const loadLoanStudyLevel = [
  'School',
  'College',
  'Diploma',
  'UG',
  'PG',
].map((level) => ({
  value: level,
  label: level,
}));

export const loadScholarShipCategories = [
  'General',
  'SC/ST/OBC',
  'Minority',
  'Girls',
  'Physically Challenged',
  'BPL',
].map((category) => ({
  value: category,
  label: category,
}));

export const loadScholarShipTypes = ['Scholarship', 'Fellowship'].map(
  (type) => ({
    value: type,
    label: type,
  })
);

export const loadScholarShipCourses = [
  'Engineering',
  'Medical',
  'Management',
  'Talent',
  'Sports',
  'Others',
].map((course) => ({
  value: course,
  label: course,
}));
