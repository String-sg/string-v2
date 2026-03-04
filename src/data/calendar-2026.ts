export interface Term {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string;
  semester: 1 | 2;
}

export interface Holiday {
  name: string;
  displayName: string; // Abbreviated version for UI
  startDate: string;
  endDate: string;
  type: 'term-break' | 'semester-break' | 'year-end';
}

export interface PublicHoliday {
  name: string;
  date: string;
  isSchoolDay: boolean; // false if it falls on weekend
}

export interface SchoolCalendar {
  year: number;
  terms: Term[];
  holidays: Holiday[];
  publicHolidays: PublicHoliday[];
}

export const calendar2026: SchoolCalendar = {
  year: 2026,
  terms: [
    {
      id: 'T1',
      name: 'Term I',
      startDate: '2026-01-02',
      endDate: '2026-03-13',
      semester: 1
    },
    {
      id: 'T2',
      name: 'Term II',
      startDate: '2026-03-23',
      endDate: '2026-05-29',
      semester: 1
    },
    {
      id: 'T3',
      name: 'Term III',
      startDate: '2026-06-29',
      endDate: '2026-09-04',
      semester: 2
    },
    {
      id: 'T4',
      name: 'Term IV',
      startDate: '2026-09-14',
      endDate: '2026-11-20',
      semester: 2
    }
  ],
  holidays: [
    {
      name: 'March holidays',
      displayName: 'Mar Hols',
      startDate: '2026-03-14',
      endDate: '2026-03-22',
      type: 'term-break'
    },
    {
      name: 'June holidays',
      displayName: 'Jun Hols',
      startDate: '2026-05-30',
      endDate: '2026-06-28',
      type: 'semester-break'
    },
    {
      name: 'September holidays',
      displayName: 'Sep Hols',
      startDate: '2026-09-05',
      endDate: '2026-09-13',
      type: 'term-break'
    },
    {
      name: 'Year-end holidays',
      displayName: 'EOY Hols',
      startDate: '2026-11-21',
      endDate: '2026-12-31',
      type: 'year-end'
    }
  ],
  publicHolidays: [
    // Term I
    { name: 'New Year\'s Day', date: '2026-01-01', isSchoolDay: false },
    { name: 'Chinese New Year', date: '2026-02-17', isSchoolDay: true },
    { name: 'Chinese New Year', date: '2026-02-18', isSchoolDay: true },

    // Term II
    { name: 'Hari Raya Puasa', date: '2026-03-21', isSchoolDay: false },
    { name: 'Good Friday', date: '2026-04-03', isSchoolDay: true },
    { name: 'Labour Day', date: '2026-05-01', isSchoolDay: true },
    { name: 'Hari Raya Haji', date: '2026-05-27', isSchoolDay: true },
    { name: 'Vesak Day', date: '2026-05-31', isSchoolDay: false },

    // Term III
    { name: 'Youth Day', date: '2026-07-05', isSchoolDay: false },
    { name: 'National Day', date: '2026-08-09', isSchoolDay: false },

    // Term IV
    { name: 'Teachers\' Day', date: '2026-09-04', isSchoolDay: true },
    { name: 'Children\'s Day', date: '2026-10-02', isSchoolDay: true },
    { name: 'Deepavali', date: '2026-11-08', isSchoolDay: false },
    { name: 'Christmas Day', date: '2026-12-25', isSchoolDay: false }
  ]
};