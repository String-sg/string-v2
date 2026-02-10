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

import { useState } from 'react';

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

export function Terms() {
  const { isDark, toggle: toggleTheme, t } = useTheme();

  return (
    <div className={`min-h-screen ${t('bg-string-bg', 'bg-string-darker')}`}>
      <Header isDark={isDark} onToggleTheme={toggleTheme} t={t} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className={`${t('bg-white', 'bg-[#2a2d30]')} rounded-2xl p-8 shadow-sm`}>
          <div className="prose prose-gray max-w-none">
            <h1 className={`text-3xl font-bold mb-2 ${t('text-string-dark', 'text-white')}`}>Terms and Conditions</h1>
            <p className={`text-sm mb-8 ${t('text-string-text-secondary', 'text-gray-400')}`}>Last updated: February 09, 2026</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>Please read these terms and conditions carefully before using Our Service.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Interpretation and Definitions</h2>
            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Interpretation</h3>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Definitions</h3>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>For the purposes of these Terms and Conditions:</p>

            <ul className={`list-disc pl-6 space-y-3 mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>
              <li><strong>Application</strong> means the software program provided by the Company downloaded by You on any electronic device, named String</li>
              <li><strong>Application Store</strong> means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded.</li>
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
              <li><strong>Country</strong> refers to: Singapore</li>
              <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in these Terms and Conditions) refers to String.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
              <li><strong>Service</strong> refers to the Application.</li>
              <li><strong>Terms and Conditions</strong> (also referred to as "Terms") means these Terms and Conditions, including any documents expressly incorporated by reference, which govern Your access to and use of the Service and form the entire agreement between You and the Company regarding the Service. These Terms and Conditions have been created with the help of the <a href="https://www.termsfeed.com/terms-conditions-generator/" target="_blank" className="text-string-mint hover:underline">Terms and Conditions Generator</a>.</li>
              <li><strong>Third-Party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third party that is displayed, included, made available, or linked to through the Service.</li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Acknowledgment</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>These are the Terms and Conditions governing the use of this Service and the agreement between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>Your access to and use of the Service is also subject to Our Privacy Policy, which describes how We collect, use, and disclose personal information. Please read Our Privacy Policy carefully before using Our Service.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Links to Other Websites</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>Our Service may contain links to third-party websites or services that are not owned or controlled by the Company.</p>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such websites or services.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>We strongly advise You to read the terms and conditions and privacy policies of any third-party websites or services that You visit.</p>

            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Links from a Third-Party Social Media Service</h3>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>The Service may display, include, make available, or link to content or services provided by a Third-Party Social Media Service. A Third-Party Social Media Service is not owned or controlled by the Company, and the Company does not endorse or assume responsibility for any Third-Party Social Media Service.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>You acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with Your access to or use of any Third-Party Social Media Service, including any content, goods, or services made available through them. Your use of any Third-Party Social Media Service is governed by that Third-Party Social Media Service's terms and privacy policies.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Termination</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>Upon termination, Your right to use the Service will cease immediately.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Limitation of Liability</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of these Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of these Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>"AS IS" and "AS AVAILABLE" Disclaimer</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Governing Law</h2>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>The laws of the Country, excluding its conflicts of law rules, shall govern these Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Disputes Resolution</h2>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>For European Union (EU) Users</h2>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>United States Legal Compliance</h2>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Severability and Waiver</h2>
            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Severability</h3>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>

            <h3 className={`text-xl font-semibold mt-6 mb-3 ${t('text-string-dark', 'text-white')}`}>Waiver</h3>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Translation Interpretation</h2>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Changes to These Terms and Conditions</h2>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p>
            <p className={`mb-6 ${t('text-string-text-primary', 'text-gray-300')}`}>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Service.</p>

            <h2 className={`text-2xl font-semibold mt-8 mb-4 ${t('text-string-dark', 'text-white')}`}>Contact Us</h2>
            <p className={`mb-4 ${t('text-string-text-primary', 'text-gray-300')}`}>If you have any questions about these Terms and Conditions, You can contact us:</p>
            <ul className={`list-disc pl-6 ${t('text-string-text-primary', 'text-gray-300')}`}>
              <li>By email: <a href="mailto:info@string.sg" className="text-string-mint hover:underline">info@string.sg</a></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}