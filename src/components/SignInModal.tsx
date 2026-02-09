import { useEffect, useRef } from 'react';
import { auth } from '../lib/auth-client';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && googleButtonRef.current) {
      // Initialize Google Sign-In when modal opens
      initializeGoogleButton();
    }
  }, [isOpen]);

  const initializeGoogleButton = async () => {
    try {
      // Load Google Identity Services if not already loaded
      if (!(window as any).google) {
        await loadGoogleScript();
      }

      const google = (window as any).google;

      // Initialize Google Identity Services
      await google.accounts.id.initialize({
        client_id: '250451703266-8kl9vsuh2vg1e7spofthsskfaueg5fqh.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: false
      });

      // Render the actual Google button directly in our modal
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = ''; // Clear existing content
        google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular'
        });
      }
    } catch (error) {
      console.error('Failed to initialize Google auth:', error);
    }
  };

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google script'));
      document.head.appendChild(script);
    });
  };

  const handleCredentialResponse = (response: any) => {
    try {
      // Decode the JWT token to get user info
      const payload = parseJWT(response.credential);

      const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        image: payload.picture
      };

      console.log('Google auth successful:', user);

      // Update auth state
      (auth as any).user = user;
      localStorage.setItem('string-auth-user', JSON.stringify(user));
      (auth as any).notifyListeners();

      // Close modal
      onClose();
    } catch (error) {
      console.error('Failed to process Google credential:', error);
    }
  };

  const parseJWT = (token: string): any => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#33373B' }}>
              <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264 264">
                <path fill="#75f8cc" d="M175,28a31.64,31.64,0,0,1-30.07,21.4H90.33A55.81,55.81,0,0,0,89.78,161h1.91a28.67,28.67,0,0,0,20.3-8.3l20-19.8v0l-41.27-.2c-15.12-.08-28.25-12.5-28.17-27.63A27.5,27.5,0,0,1,90.19,77.71l54.6,0A59.72,59.72,0,0,0,182.87,64.3,58.84,58.84,0,0,0,191.26,56a59.7,59.7,0,0,0,12.87-28Z"/>
                <path fill="#75f8cc" d="M213.58,121.36a55.59,55.59,0,0,0-39.36-16.53h-1.91a28.62,28.62,0,0,0-20.3,8.29l-20,19.8,41.23.2c15.14.08,28.27,12.52,28.19,27.67a27.48,27.48,0,0,1-27.62,27.36l-56.25,0a59.64,59.64,0,0,0-38.14,13.46A57.17,57.17,0,0,0,71,209.91A59.39,59.39,0,0,0,58.52,236H88a31.69,31.69,0,0,1,29.43-19.59l56.23,0a55.79,55.79,0,0,0,39.91-95.07Z"/>
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Simplified Access to Tools
            </h1>
            <p className="text-gray-500 text-lg">
              Log in to String
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Log in with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Real Google Sign-in Button */}
          <div ref={googleButtonRef} className="w-full">
            {/* Fallback button while Google button loads */}
            <button
              className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group"
              disabled
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-400 font-medium">Loading...</span>
            </button>
          </div>

          {/* Future auth options placeholder */}
          <div className="mt-6 space-y-3 opacity-50">
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-xl cursor-not-allowed"
            >
              <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-gray-400 font-medium">Passkey</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Email placeholder */}
          <div className="opacity-50">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              disabled
              placeholder="Enter your email address..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-2">
              Use an organization email to easily collaborate with teammates
            </p>
            <button
              disabled
              className="w-full mt-4 bg-blue-500 text-white py-3 px-4 rounded-xl font-medium cursor-not-allowed opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}