// Google OAuth integration for client-side apps
window.GoogleAuth = {
  CLIENT_ID: '250451703266-8kl9vsuh2vg1e7spofthsskfaueg5fqh.apps.googleusercontent.com',

  async init() {
    if (!window.google) {
      await this.loadGoogleAPI();
    }

    await window.google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback: this.handleCredentialResponse.bind(this)
    });
  },

  async loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  handleCredentialResponse(response) {
    try {
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));

      const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        image: payload.picture
      };

      // Dispatch custom event with user data
      window.dispatchEvent(new CustomEvent('google-auth-success', { detail: user }));
    } catch (error) {
      console.error('Failed to parse Google credential:', error);
      window.dispatchEvent(new CustomEvent('google-auth-error', { detail: error }));
    }
  },

  async signIn() {
    if (!window.google) {
      await this.init();
    }

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        // Fallback to popup if One Tap is not available
        this.signInWithPopup();
      }
    });
  },

  async signInWithPopup() {
    if (!window.google) {
      await this.init();
    }

    // Create a temporary button for popup flow
    const buttonDiv = document.createElement('div');
    buttonDiv.style.display = 'none';
    document.body.appendChild(buttonDiv);

    window.google.accounts.id.renderButton(buttonDiv, {
      theme: 'outline',
      size: 'large'
    });

    // Trigger the button click
    buttonDiv.querySelector('button')?.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(buttonDiv);
    }, 1000);
  }
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.GoogleAuth.init();
  });
} else {
  window.GoogleAuth.init();
}