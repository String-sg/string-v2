import { useCalendar } from '../hooks/useCalendar';

interface CalendarBannerProps {
  t: (light: string, dark: string) => string;
}

export function CalendarBanner({ t }: CalendarBannerProps) {
  const { displayMessage, todaysPublicHoliday } = useCalendar();

  // If calculation failed or no message, hide component completely
  if (!displayMessage) {
    return null;
  }

  // Handle public holiday messaging
  let finalMessage = displayMessage;
  let holidayTone = false;
  if (todaysPublicHoliday?.isSchoolDay) {
    // Public holiday on a school day - modify the message
    const holidayEmoji = getHolidayEmoji(todaysPublicHoliday.name);
    finalMessage = `Happy ${todaysPublicHoliday.name}! ${holidayEmoji}`;
    holidayTone = true;

    // Add context if we're in a term
    if (displayMessage.includes('W')) {
      const termWeekPart = displayMessage.split(' |')[0]; // Extract "T1W6" part
      finalMessage += ` | ${termWeekPart} continues tomorrow`;
    }
  }

  const [primary, secondary] = finalMessage.split(' | ').map((part) => part.trim());
  const isTermWeek = /^T\d+W\d+/i.test(primary);

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
          holidayTone
            ? 'bg-red-100 text-red-700'
            : isTermWeek
              ? t('bg-[#E8F0FF] text-[#1E3A8A]', 'bg-[#1E293B] text-[#93C5FD]')
              : t('bg-gray-100 text-gray-700', 'bg-[#23272B] text-gray-300')
        }`}
      >
        {primary}
      </span>
      {secondary && (
        <span className={`text-xs ${t('text-string-text-secondary', 'text-gray-400')}`}>
          {secondary}
        </span>
      )}
    </div>
  );
}

function getHolidayEmoji(holidayName: string): string {
  const emojiMap: Record<string, string> = {
    'Chinese New Year': '🧧',
    'Hari Raya Puasa': '🌙',
    'Good Friday': '✝️',
    'Labour Day': '⚒️',
    'Hari Raya Haji': '🕌',
    'Vesak Day': '🪷',
    'Youth Day': '🎉',
    'National Day': '🇸🇬',
    "Teachers' Day": '👩‍🏫',
    "Children's Day": '🧒',
    'Deepavali': '🪔',
    'Christmas Day': '🎄'
  };

  return emojiMap[holidayName] || '🎉';
}
