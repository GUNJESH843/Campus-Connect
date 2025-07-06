export const announcements = [
  {
    id: 1,
    title: 'Library Hours Extended for Finals',
    content:
      'The main library will be open 24/7 starting next week to help students prepare for final exams.',
    date: '3 days ago',
  },
  {
    id: 2,
    title: 'New Student Art Gallery Opening',
    content:
      'Come see the amazing work of our talented student artists at the new gallery in the Fine Arts building.',
    date: '1 week ago',
  },
  {
    id: 3,
    title: 'Campus Shuttle Schedule Update',
    content:
      'Please note the updated shuttle schedule for the holiday break, effective from December 18th.',
    date: '2 weeks ago',
  },
];

export const events = [
  {
    id: 1,
    name: 'Winter Wonderland Gala',
    date: 'DEC 22',
    location: 'Student Union Ballroom',
  },
  {
    id: 2,
    name: 'Guest Lecture: AI in Modern Society',
    date: 'JAN 10',
    location: 'Lecture Hall C',
  },
  {
    id: 3,
    name: 'Spring Semester Club Fair',
    date: 'JAN 25',
    location: 'Main Quad',
  },
];

export const campusGroups = [
  'Debate Club',
  'Coding Crew',
  'Art & Soul Society',
  'Photography Club',
  'International Students Association',
  'Varsity Sports',
  'Drama Club',
  'Music Ensemble',
  'Volunteering Group',
  'Entrepreneurship Hub',
];

export const campusActivities = [
  'Hackathon',
  'Art Exhibition',
  'Freshers Week',
  'Guest Lecture Series',
  'Music Fest',
  'Career Fair',
  'Sports Day',
  'Drama Production',
  'Cultural Night',
  'Startup Pitch Competition',
];

export interface StudentProfile {
  name: string;
  major: string;
  courses: string[];
  studyStyle: 'Quiet' | 'Group' | 'Collaborative' | 'Focused' | 'Online';
}

export const studentProfiles: StudentProfile[] = [
  { name: 'Alex Doe', major: 'Computer Science', courses: ['CS101', 'MATH300'], studyStyle: 'Focused' },
  { name: 'Ben Smith', major: 'Physics', courses: ['PHYS201', 'MATH300'], studyStyle: 'Quiet' },
  { name: 'Chloe Brown', major: 'Computer Science', courses: ['CS101', 'ENG202'], studyStyle: 'Collaborative' },
  { name: 'David Green', major: 'Chemistry', courses: ['CHEM101', 'BIO210'], studyStyle: 'Group' },
  { name: 'Emily White', major: 'History', courses: ['HIST101', 'ENG202'], studyStyle: 'Quiet' },
  { name: 'Frank Black', major: 'Fine Arts', courses: ['ART101', 'HIST101'], studyStyle: 'Collaborative' },
  { name: 'Grace Hall', major: 'Biology', courses: ['BIO210', 'CHEM101'], studyStyle: 'Focused' },
  { name: 'Henry King', major: 'Computer Science', courses: ['CS101', 'PHYS201'], studyStyle: 'Group' },
];

export interface CampusLocation {
  name: string;
  type: 'Library' | 'Dining' | 'Recreation' | 'Academic' | 'Student Services';
  hours: string;
  details: string;
  coordinates: { x: number; y: number };
}

export const campusLocations: CampusLocation[] = [
  {
    name: 'Main Library',
    type: 'Library',
    hours: '8 AM - 2 AM',
    details: 'The largest library on campus with quiet zones, group study rooms, and a coffee shop.',
    coordinates: { x: 25, y: 30 },
  },
  {
    name: 'Student Union',
    type: 'Student Services',
    hours: '7 AM - 11 PM',
    details: 'Hub for student life, containing the main cafeteria, campus store, and various club offices.',
    coordinates: { x: 50, y: 45 },
  },
  {
    name: 'Tech Building',
    type: 'Academic',
    hours: 'Open 24/7 for students in the program',
    details: 'Home to the Computer Science and Engineering departments. Contains several computer labs.',
    coordinates: { x: 75, y: 25 },
  },
  {
    name: 'Recreation Center',
    type: 'Recreation',
    hours: '6 AM - 10 PM',
    details: 'A fully-equipped gym with a swimming pool, basketball courts, and a rock climbing wall.',
    coordinates: { x: 40, y: 75 },
  },
  {
    name: 'Fine Arts Building',
    type: 'Academic',
    hours: '9 AM - 9 PM',
    details: 'Contains art studios, galleries, and a theatre for student productions.',
    coordinates: { x: 65, y: 60 },
  },
];

export interface Review {
  id: number;
  author: string;
  rating: number; // out of 5
  comment: string;
}

export interface Course {
  id: string;
  name: string;
  department: string;
  description: string;
  reviews: Review[];
}

export const courses: Course[] = [
  {
    id: 'CS101',
    name: 'Introduction to Programming',
    department: 'Computer Science',
    description: 'A foundational course on programming principles using Python.',
    reviews: [
      { id: 1, author: 'Ben Smith', rating: 5, comment: 'Great intro course! Professor was very clear.' },
      { id: 2, author: 'Henry King', rating: 4, comment: 'Challenging but rewarding. The final project was tough but I learned a lot.' },
    ],
  },
  {
    id: 'PHYS201',
    name: 'University Physics I',
    department: 'Physics',
    description: 'Covers mechanics, sound, and heat. Calculus-based.',
    reviews: [
      { id: 1, author: 'Ben Smith', rating: 3, comment: 'The material is dense. You really need to keep up with the readings.' },
    ],
  },
  {
    id: 'MATH300',
    name: 'Linear Algebra',
    department: 'Mathematics',
    description: 'An introduction to vectors, matrices, and linear transformations.',
     reviews: [
      { id: 1, author: 'Alex Doe', rating: 5, comment: 'Absolutely loved this class. It changed how I think about math.' },
      { id: 2, author: 'Ben Smith', rating: 4, comment: 'Tough but fair. The professor gives a lot of partial credit on exams.' },
    ],
  },
  {
    id: 'HIST101',
    name: 'World History: Ancient Civilizations',
    department: 'History',
    description: 'A survey of major world civilizations from prehistory to 500 CE.',
    reviews: [
        { id: 1, author: 'Emily White', rating: 4, comment: 'Lots of reading, but the lectures were super engaging.' },
    ],
  },
];

export const tutorSubjects = ['Mathematics', 'Physics', 'Computer Science', 'History', 'Chemistry', 'English'];
