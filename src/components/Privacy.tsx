import { useState } from 'react';
import { AuthButton } from './AuthButton';
import { navigateTo } from './Router';

// Theme helper (copied from App.tsx for consistency)
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('string-theme') === 'dark';
    } catch {
      return false;
    }
  });

  const toggle = () => setIsDark((d) => !d);
  const t = (light: string, dark: string) => (isDark ? dark : light);

  return { isDark, toggle, t };
}

function Header({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  return (
    <header className="bg-string-dark sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigateTo('/')}
          className="cursor-pointer"
        >
          <img
            src="/logo-green.svg"
            alt="String"
            className="h-7"
          />
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

export function Privacy() {
  const { isDark, toggle: toggleTheme, t } = useTheme();

  return (
    <div className={`min-h-screen ${t('bg-string-bg', 'bg-string-darker')}`}>
      <Header isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className={`${t('bg-white', 'bg-[#2a2d30]')} rounded-2xl p-8 shadow-sm`}>
          <div className="prose prose-gray max-w-none">
            <h1 className={`text-3xl font-bold mb-2 ${t('text-string-dark', 'text-white')}`}>Privacy Policy for String</h1>
            <p className={`text-sm mb-8 ${t('text-string-text-secondary', 'text-gray-400')}`}>Last updated: February 09, 2026</p>

            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Interpretation and Definitions</h2>
            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Interpretation</h3>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Definitions</h3>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>For the purposes of this Privacy Policy:</p>

            <ul className={`list-disc pl-6 space-y-3 mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>
              <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
              <li><strong>Application</strong> refers to String, the software program provided by the Company.</li>
              <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Privacy Policy) refers to String.</li>
              <li><strong>Country</strong> refers to: Singapore</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
              <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
              <li><strong>Service</strong> refers to the Application.</li>
              <li><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</li>
              <li><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Collecting and Using Your Personal Data</h2>

            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Types of Data Collected</h3>

            <h4 className={`text-lg font-medium mt-4 mb-3 ${t('text-string-dark', 'text-white')}`}>Personal Data</h4>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. When you sign in with Google, we collect:</p>

            <ul className={`list-disc pl-6 space-y-2 mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>
              <li>Email address</li>
              <li>Name</li>
              <li>Profile picture</li>
              <li>Google user ID</li>
            </ul>

            <h4 className={`text-lg font-medium mt-4 mb-3 ${t('text-string-dark', 'text-white')}`}>Usage Data</h4>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>Usage Data is collected automatically when using the Service through Google Analytics (tracking ID: G-Z710HPP78G).</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>Usage Data may include information such as Your Device's Internet Protocol address (IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>

            <h4 className={`text-lg font-medium mt-4 mb-3 ${t('text-string-dark', 'text-white')}`}>Data Storage</h4>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>We store user preferences (such as pinned applications and theme settings) locally in your browser's localStorage. This data remains on your device and is not transmitted to our servers.</p>

            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Use of Your Personal Data</h3>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>The Company may use Personal Data for the following purposes:</p>

            <ul className={`list-disc pl-6 space-y-3 mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>
              <li><strong>To provide and maintain our Service:</strong> including to monitor the usage of our Service and provide personalized features like pinned applications.</li>
              <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service and provide access to different functionalities available to registered users.</li>
              <li><strong>To improve our Service:</strong> to analyze usage patterns and improve the Service through data collected via Google Analytics.</li>
              <li><strong>To contact You:</strong> To contact You by email regarding updates or informative communications related to the functionalities, products or services, including security updates when necessary.</li>
              <li><strong>For business transfers:</strong> We may use Your Personal Data to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets.</li>
            </ul>

            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Third-Party Services</h3>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>We use the following third-party services that may collect information used to identify You:</p>

            <ul className={`list-disc pl-6 space-y-3 mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>
              <li><strong>Google Analytics:</strong> We use Google Analytics to analyze the use of our Service. Google Analytics collects information such as how often users visit this Service, what pages they visit, and what other sites they used prior to coming to this Service. For more information on Google's privacy practices, visit <a href="https://policies.google.com/privacy" target="_blank" className="text-string-mint hover:underline">Google Privacy Policy</a>.</li>
              <li><strong>Google Identity Services:</strong> We use Google's authentication service for user login. This service is governed by Google's privacy policy and terms of service.</li>
            </ul>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Retention of Your Personal Data</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We apply different retention periods based on the type of data:</p>

            <ul className={`list-disc pl-6 space-y-3 mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>
              <li><strong>Account Information:</strong> Retained for the duration of your account relationship plus up to 24 months after account deletion to handle any post-termination issues.</li>
              <li><strong>Usage Data (Google Analytics):</strong> Google Analytics data is retained for 26 months as per Google's standard retention policy.</li>
              <li><strong>Local Data:</strong> Preferences stored in your browser's localStorage remain until you clear your browser data or uninstall the application.</li>
            </ul>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Transfer of Your Personal Data</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>Your information, including Personal Data, may be transferred to and processed on servers located outside of Your jurisdiction where data protection laws may differ.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Delete Your Personal Data</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</p>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>You may update, amend, or delete Your information at any time by:</p>

            <ul className={`list-disc pl-6 space-y-2 mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>
              <li>Signing out of your Google account through the Service</li>
              <li>Clearing your browser's localStorage data</li>
              <li>Contacting us directly to request data deletion</li>
            </ul>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Disclosure of Your Personal Data</h2>

            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Business Transactions</h3>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>

            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Law enforcement</h3>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Security of Your Personal Data</h2>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially reasonable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Children's Privacy</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>Our Service does not address anyone under the age of 16. We do not knowingly collect personally identifiable information from anyone under the age of 16.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 16 without verification of parental consent, We take steps to remove that information from Our servers.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Links to Other Websites</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>Our Service contains links to third-party educational applications and websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>We strongly advise You to review the Privacy Policy of every site You visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Changes to this Privacy Policy</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Contact Us</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>If you have any questions about this Privacy Policy, You can contact us:</p>
            <ul className={`list-disc pl-6 ${t('text-string-text-primary', 'text-gray-300')}`}>
              <li>By email: <a href="mailto:kahhow@string.sg" className="text-string-mint hover:underline">kahhow@string.sg</a></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}