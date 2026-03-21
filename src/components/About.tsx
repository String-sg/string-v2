import { useState, useEffect } from 'react';
import { AuthButton } from './AuthButton';
import { navigateTo } from './Router';

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('string-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('string-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);
  const t = (light: string, dark: string) => (isDark ? dark : light);

  return { isDark, toggle, t };
}

function Header({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  return (
    <header className="bg-string-dark sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button onClick={() => navigateTo('/')} className="cursor-pointer">
          <img src="/logo-green.svg" alt="String" className="h-7" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-string-darker text-gray-400"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

export function About() {
  const { isDark, toggle: toggleTheme, t } = useTheme();

  return (
    <div className={`min-h-screen ${t('bg-string-bg', 'bg-string-darker')}`}>
      <Header isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Intro + Mission */}
        <div className={`${t('bg-white', 'bg-[#2a2d30]')} rounded-2xl p-8 shadow-sm text-center`}>
          <h1 className={`text-3xl font-bold mb-4 ${t('text-string-dark', 'text-white')}`}>About</h1>
          <h2 className="text-xl font-semibold text-string-mint mb-4">
            String is an EduTech ecosystem builder focused on products, programmes, and partnerships for educators.
          </h2>
          <p className={`max-w-2xl mx-auto ${t('text-string-text-primary', 'text-gray-300')}`}>
            Our biggest resolution is to enable educators to focus on what truly matters: teaching and learning. We do this by culling subject-agnostic admin and facilitating access to tooling and community partners — tackling it one step at a time, together, with more thoughtful design and the right affordances of tech.
          </p>
        </div>

        {/* Meetup photos */}
        <div className={`${t('bg-white', 'bg-[#2a2d30]')} rounded-2xl p-8 shadow-sm space-y-8`}>
          <div>
            <img src="/highlights-14str.jpg" alt="String's meetup at Open Government Products" className="w-full rounded-xl shadow-sm mb-2" />
            <p className={`text-sm text-center ${t('text-string-text-secondary', 'text-gray-400')}`}>
              String's meetup at Open Government Products, 18 Nov 2024 |{' '}
              <a href="https://www.linkedin.com/feed/update/urn:li:activity:7265594854934487040/" target="_blank" rel="noopener noreferrer" className="text-string-mint hover:underline">
                Read more
              </a>
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img src="/meetupatcrater2022.png" alt="Meetup at Crater @ NYGH" className="w-full rounded-xl shadow-sm mb-2" />
              <p className={`text-sm text-center ${t('text-string-text-secondary', 'text-gray-400')}`}>
                Meetup at Crater @ NYGH (Dec 2022) |{' '}
                <a href="https://www.linkedin.com/feed/update/urn:li:activity:7008581328241655808/" target="_blank" rel="noopener noreferrer" className="text-string-mint hover:underline">
                  Read more
                </a>
              </p>
            </div>
            <div className="md:w-1/2">
              <img src="/meetupatgoogle2023.png" alt="Meetup @ Google APAC HQ" className="w-full rounded-xl shadow-sm mb-2" />
              <p className={`text-sm text-center ${t('text-string-text-secondary', 'text-gray-400')}`}>
                Meetup @ Google APAC HQ (Jun 2023) |{' '}
                <a href="https://www.linkedin.com/feed/update/urn:li:activity:7072765894686343168/" target="_blank" rel="noopener noreferrer" className="text-string-mint hover:underline">
                  Read more
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Year in Review */}
        <div className={`${t('bg-white', 'bg-[#2a2d30]')} rounded-2xl p-8 shadow-sm`}>
          <h2 className={`text-2xl font-bold mb-6 ${t('text-string-dark', 'text-white')}`}>Year in Review</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://medium.com/string/it-happened-on-string-e7f0a5df81f3"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 rounded-xl p-5 border transition-colors ${t('border-string-border hover:bg-string-surface-hover', 'border-gray-600 hover:bg-[#33373b]')}`}
            >
              <p className="text-string-mint font-semibold mb-1">2024 Recap</p>
              <p className={`text-sm ${t('text-string-text-secondary', 'text-gray-400')}`}>It happened on String — a look back at 2024 →</p>
            </a>
            <a
              href="https://medium.com/it-happened-on-string-2025-09836fdef4b3"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 rounded-xl p-5 border transition-colors ${t('border-string-border hover:bg-string-surface-hover', 'border-gray-600 hover:bg-[#33373b]')}`}
            >
              <p className="text-string-mint font-semibold mb-1">2025 Recap</p>
              <p className={`text-sm ${t('text-string-text-secondary', 'text-gray-400')}`}>It happened on String — a look back at 2025 →</p>
            </a>
          </div>
        </div>

        {/* CTAs */}
        <div className={`${t('bg-white', 'bg-[#2a2d30]')} rounded-2xl p-8 shadow-sm`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${t('text-string-dark', 'text-white')}`}>Get in Touch</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="http://join.string.sg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-string-mint text-string-dark font-semibold py-3 px-6 rounded-xl hover:bg-string-mint-light transition-colors"
            >
              Join String
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <a
              href="https://reports.string.sg/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl border transition-colors ${t('border-string-border text-string-dark hover:bg-string-surface-hover', 'border-gray-600 text-gray-300 hover:bg-[#33373b]')}`}
            >
              Product metrics
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <a
              href="https://luma.com/string"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl border transition-colors ${t('border-string-border text-string-dark hover:bg-string-surface-hover', 'border-gray-600 text-gray-300 hover:bg-[#33373b]')}`}
            >
              Events
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
            </a>
            <a
              href="https://discord.gg/ZRHqBtwh9b"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl border transition-colors ${t('border-string-border text-string-dark hover:bg-string-surface-hover', 'border-gray-600 text-gray-300 hover:bg-[#33373b]')}`}
            >
              Discord
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
