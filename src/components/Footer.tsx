import { navigateTo } from './Router';

export function Footer({ t }: { t: (l: any, d: any) => any }) {
  return (
    <footer className={`mt-16 border-t ${t('border-gray-200 bg-white', 'border-[#3a3f44] bg-[#2a2d30]')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-6 w-6">
              {t(
                // Light mode - use dark logo
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264 264">
                  <path fill="#33373b" d="M175,28a31.64,31.64,0,0,1-30.07,21.4H90.33A55.81,55.81,0,0,0,89.78,161h1.91a28.67,28.67,0,0,0,20.3-8.3l20-19.8v0l-41.27-.2c-15.12-.08-28.25-12.5-28.17-27.63A27.5,27.5,0,0,1,90.19,77.71l54.6,0A59.72,59.72,0,0,0,182.87,64.3,58.84,58.84,0,0,0,191.26,56a59.7,59.7,0,0,0,12.87-28Z"/>
                  <path fill="#33373b" d="M213.58,121.36a55.59,55.59,0,0,0-39.36-16.53h-1.91a28.62,28.62,0,0,0-20.3,8.29l-20,19.8,41.23.2c15.14.08,28.27,12.52,28.19,27.67a27.48,27.48,0,0,1-27.62,27.36l-56.25,0a59.64,59.64,0,0,0-38.14,13.46A57.17,57.17,0,0,0,71,209.91A59.39,59.39,0,0,0,58.52,236H88a31.69,31.69,0,0,1,29.43-19.59l56.23,0a55.79,55.79,0,0,0,39.91-95.07Z"/>
                </svg>,
                // Dark mode - use green logo
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264 264">
                  <path fill="#75f8cc" d="M175,28a31.64,31.64,0,0,1-30.07,21.4H90.33A55.81,55.81,0,0,0,89.78,161h1.91a28.67,28.67,0,0,0,20.3-8.3l20-19.8v0l-41.27-.2c-15.12-.08-28.25-12.5-28.17-27.63A27.5,27.5,0,0,1,90.19,77.71l54.6,0A59.72,59.72,0,0,0,182.87,64.3,58.84,58.84,0,0,0,191.26,56a59.7,59.7,0,0,0,12.87-28Z"/>
                  <path fill="#75f8cc" d="M213.58,121.36a55.59,55.59,0,0,0-39.36-16.53h-1.91a28.62,28.62,0,0,0-20.3,8.29l-20,19.8,41.23.2c15.14.08,28.27,12.52,28.19,27.67a27.48,27.48,0,0,1-27.62,27.36l-56.25,0a59.64,59.64,0,0,0-38.14,13.46A57.17,57.17,0,0,0,71,209.91A59.39,59.39,0,0,0,58.52,236H88a31.69,31.69,0,0,1,29.43-19.59l56.23,0a55.79,55.79,0,0,0,39.91-95.07Z"/>
                </svg>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <button
              onClick={() => navigateTo('/privacy')}
              className={`transition-colors ${t('text-string-text-secondary hover:text-string-dark', 'text-gray-400 hover:text-white')}`}
            >
              Privacy
            </button>
            <button
              onClick={() => navigateTo('/terms')}
              className={`transition-colors ${t('text-string-text-secondary hover:text-string-dark', 'text-gray-400 hover:text-white')}`}
            >
              Terms
            </button>
            <a
              href="https://www.linkedin.com/company/77759625"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${t('text-string-text-secondary hover:text-string-dark', 'text-gray-400 hover:text-white')}`}
            >
              LinkedIn
            </a>
            <a
              href="https://medium.com/string"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${t('text-string-text-secondary hover:text-string-dark', 'text-gray-400 hover:text-white')}`}
            >
              Medium
            </a>
            <a
              href="https://luma.com/string"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${t('text-string-text-secondary hover:text-string-dark', 'text-gray-400 hover:text-white')}`}
            >
              Events
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className={`mt-6 pt-6 border-t text-center text-xs ${t('border-gray-200 text-string-text-secondary', 'border-[#3a3f44] text-gray-500')}`}>
          © {new Date().getFullYear()} String. All rights reserved.
        </div>
      </div>
    </footer>
  );
}