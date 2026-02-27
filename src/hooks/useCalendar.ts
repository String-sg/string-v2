import { useMemo } from 'react';
import { calendar2026, type Term, type Holiday, type PublicHoliday } from '../data/calendar-2026';

interface CalendarInfo {
  currentTerm: string | null; // "T1", "T2", etc.
  currentWeek: number | null; // 1-10
  daysUntilNext: number | null;
  nextEventName: string | null; // "Mar Hols", "T2", etc.
  displayMessage: string | null; // "T1W6 | 8D to Mar Hols"
  isHolidayPeriod: boolean;
  todaysPublicHoliday: PublicHoliday | null;
}

export function useCalendar(): CalendarInfo {
  return useMemo(() => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Check if today is a public holiday
      const todaysPublicHoliday = calendar2026.publicHolidays.find(
        holiday => holiday.date === today
      ) || null;

      // Check if we're in a term
      const currentTerm = calendar2026.terms.find(term => {
        return today >= term.startDate && today <= term.endDate;
      });

      if (currentTerm) {
        // We're in a term period
        const termStartDate = new Date(currentTerm.startDate);
        const currentDate = new Date(today);

        // Calculate current week (1-indexed)
        const daysDiff = Math.floor((currentDate.getTime() - termStartDate.getTime()) / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor(daysDiff / 7) + 1;

        // Find next holiday after term end
        const termEndDate = new Date(currentTerm.endDate);
        const nextHoliday = calendar2026.holidays.find(holiday => {
          const holidayStart = new Date(holiday.startDate);
          return holidayStart > termEndDate;
        });

        if (nextHoliday) {
          const holidayStartDate = new Date(nextHoliday.startDate);
          const daysUntilHoliday = Math.ceil((holidayStartDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

          const displayMessage = `${currentTerm.id}W${currentWeek} | ${daysUntilHoliday}D to ${nextHoliday.displayName}`;

          return {
            currentTerm: currentTerm.id,
            currentWeek,
            daysUntilNext: daysUntilHoliday,
            nextEventName: nextHoliday.displayName,
            displayMessage,
            isHolidayPeriod: false,
            todaysPublicHoliday
          };
        }

        // No upcoming holiday found, might be near year end
        const displayMessage = `${currentTerm.id}W${currentWeek}`;

        return {
          currentTerm: currentTerm.id,
          currentWeek,
          daysUntilNext: null,
          nextEventName: null,
          displayMessage,
          isHolidayPeriod: false,
          todaysPublicHoliday
        };
      }

      // Check if we're in a holiday period
      const currentHoliday = calendar2026.holidays.find(holiday => {
        return today >= holiday.startDate && today <= holiday.endDate;
      });

      if (currentHoliday) {
        // We're in holiday period, find next term
        const holidayEndDate = new Date(currentHoliday.endDate);
        const nextTerm = calendar2026.terms.find(term => {
          const termStartDate = new Date(term.startDate);
          return termStartDate > holidayEndDate;
        });

        if (nextTerm) {
          const currentDate = new Date(today);
          const termStartDate = new Date(nextTerm.startDate);
          const daysUntilTerm = Math.ceil((termStartDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

          const displayMessage = `${currentHoliday.displayName} | ${nextTerm.id} starts in ${daysUntilTerm}D`;

          return {
            currentTerm: null,
            currentWeek: null,
            daysUntilNext: daysUntilTerm,
            nextEventName: nextTerm.id,
            displayMessage,
            isHolidayPeriod: true,
            todaysPublicHoliday
          };
        }

        // Holiday period but no next term (probably year-end)
        const displayMessage = `${currentHoliday.displayName}`;

        return {
          currentTerm: null,
          currentWeek: null,
          daysUntilNext: null,
          nextEventName: null,
          displayMessage,
          isHolidayPeriod: true,
          todaysPublicHoliday
        };
      }

      // Not in term or holiday - might be before school year starts
      const firstTerm = calendar2026.terms[0];
      if (today < firstTerm.startDate) {
        const currentDate = new Date(today);
        const termStartDate = new Date(firstTerm.startDate);
        const daysUntilSchool = Math.ceil((termStartDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        const displayMessage = `School starts in ${daysUntilSchool}D`;

        return {
          currentTerm: null,
          currentWeek: null,
          daysUntilNext: daysUntilSchool,
          nextEventName: firstTerm.id,
          displayMessage,
          isHolidayPeriod: false,
          todaysPublicHoliday
        };
      }

      // After school year ends
      const displayMessage = `School Year Complete`;

      return {
        currentTerm: null,
        currentWeek: null,
        daysUntilNext: null,
        nextEventName: null,
        displayMessage,
        isHolidayPeriod: false,
        todaysPublicHoliday
      };

    } catch (error) {
      // Return null values on any calculation error - component will hide completely
      return {
        currentTerm: null,
        currentWeek: null,
        daysUntilNext: null,
        nextEventName: null,
        displayMessage: null,
        isHolidayPeriod: false,
        todaysPublicHoliday: null
      };
    }
  }, []); // Empty dependency array - calculate once per component mount (daily updates handled by app restart)
}