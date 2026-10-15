import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  LogOut,
  AlertCircle,
  Settings,
  Key,
  ExternalLink,
  Check,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Google OAuth Client ID state
  const [googleClientId, setGoogleClientId] = useState(() => {
    return (
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem('aeroforge_google_client_id') ||
      ''
    );
  });
  const [showClientIdConfig, setShowClientIdConfig] = useState(false);
  const [clientIdInput, setClientIdInput] = useState('');
  const [idSavedAlert, setIdSavedAlert] = useState(false);
  const [isGisReady, setIsGisReady] = useState(false);

  const googleButtonContainerRef = useRef(null);

  // Check if Google Identity Services script is available
  useEffect(() => {
    const checkGis = () => {
      if (window.google?.accounts?.oauth2) {
        setIsGisReady(true);
      }
    };
    checkGis();
    const interval = setInterval(checkGis, 500);
    return () => clearInterval(interval);
  }, []);

  // Sync initial client id input
  useEffect(() => {
    setClientIdInput(googleClientId);
  }, [googleClientId]);

  // Decode Google JWT Credential token if One Tap or rendered button is used
  const parseGoogleJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // Render official Google button if Client ID exists and GIS is ready
  useEffect(() => {
    if (!isOpen || !googleClientId.trim() || !window.google?.accounts?.id || !googleButtonContainerRef.current) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId.trim(),
        callback: (response) => {
          if (response.credential) {
            const profile = parseGoogleJwt(response.credential);
            if (profile) {
              const realUser = {
                name: profile.name || profile.given_name || 'Pilot',
                email: profile.email,
                avatar: profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.email}`,
                authProvider: 'Google Identity Services',
                googleSub: profile.sub,
                emailVerified: profile.email_verified,
                dgcaLicense: 'DGCA Certified Builder',
                joinedAt: new Date().toLocaleDateString('en-IN')
              };
              onLogin(realUser);
              setAuthSuccessMsg(`Authenticated as ${realUser.name}!`);
              setTimeout(() => {
                setAuthSuccessMsg('');
                onClose();
              }, 1200);
            }
          }
        }
      });

      window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
        theme: 'outline',
        size: 'large',
        width: 380,
        shape: 'pill',
        text: 'continue_with'
      });
    } catch (err) {
      console.warn('GIS button render error:', err);
    }
  }, [isOpen, googleClientId, isGisReady]);

  if (!isOpen) return null;

  // Real Google Sign-In via Google Identity Services Token Client Popup
  const handleGoogleSignIn = () => {
    setErrorMsg('');

    const activeClientId = googleClientId.trim();

    // 1. If no Client ID is configured, show configuration prompt
    if (!activeClientId) {
      setShowClientIdConfig(true);
      setErrorMsg('Google OAuth Client ID is required for live Google account sign-in. Please paste your Client ID below.');
      return;
    }

    // 2. Check if Google Identity Services SDK is loaded
    if (!window.google?.accounts?.oauth2) {
      setErrorMsg('Google Identity Services SDK is still loading. Please check your internet connection and ensure accounts.google.com is not blocked.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: activeClientId,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        prompt: 'select_account',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsSubmitting(false);
            if (tokenResponse.error === 'popup_closed_by_user') {
              setErrorMsg('Google Sign-In popup was closed before completing authentication.');
            } else {
              setErrorMsg(`Google OAuth Error: ${tokenResponse.error_description || tokenResponse.error}`);
            }
            return;
          }

          try {
            // Real Google API call using the official OAuth Bearer Token
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
              }
            });

            if (!res.ok) {
              throw new Error(`Google UserInfo API returned status ${res.status}`);
            }

            const profile = await res.json();

            // Construct real Google authenticated user
            const realUser = {
              name: profile.name || profile.given_name || 'Pilot',
              email: profile.email,
              avatar: profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.email}`,
              authProvider: 'Google / Gmail',
              googleSub: profile.sub,
              emailVerified: profile.email_verified,
              dgcaLicense: 'DGCA Certified Builder',
              joinedAt: new Date().toLocaleDateString('en-IN')
            };

            onLogin(realUser);
            setIsSubmitting(false);
            setAuthSuccessMsg(`Welcome, ${realUser.name}! Signed in with Google.`);
            setTimeout(() => {
              setAuthSuccessMsg('');
              onClose();
            }, 1200);
          } catch (err) {
            setIsSubmitting(false);
            setErrorMsg(`Failed to retrieve Google profile: ${err.message}`);
          }
        },
        error_callback: (err) => {
          setIsSubmitting(false);
          setErrorMsg(`Google Sign-In error: ${err.message || 'Popup blocked or canceled.'}`);
        }
      });

      // Launch the real Google Account selection popup window
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(`Failed to launch Google Sign-In: ${err.message}`);
    }
  };

  // Save Client ID manually
  const handleSaveClientId = (e) => {
    e.preventDefault();
    const cleanId = clientIdInput.trim();
    if (!cleanId) {
      localStorage.removeItem('aeroforge_google_client_id');
      setGoogleClientId('');
      setIdSavedAlert(false);
      return;
    }
    localStorage.setItem('aeroforge_google_client_id', cleanId);
    setGoogleClientId(cleanId);
    setErrorMsg('');
    setIdSavedAlert(true);
    setTimeout(() => setIdSavedAlert(false), 3000);
  };

  // Handle standard email/pass with persistent user store
  const handleEmailAuth = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) return;

    setIsSubmitting(true);

    try {
      const usersDb = JSON.parse(localStorage.getItem('aeroforge_registered_users') || '{}');
      const cleanEmail = email.trim().toLowerCase();

      if (authMode === 'signup') {
        usersDb[cleanEmail] = {
          name: fullName.trim() || cleanEmail.split('@')[0],
          email: cleanEmail,
          password: password,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
          authProvider: 'Email & Password',
          dgcaLicense: 'Standard Builder',
          joinedAt: new Date().toLocaleDateString('en-IN')
        };
        localStorage.setItem('aeroforge_registered_users', JSON.stringify(usersDb));

        const loggedUser = usersDb[cleanEmail];
        onLogin(loggedUser);
        setIsSubmitting(false);
        setAuthSuccessMsg('Account registered and session created successfully!');
        setTimeout(() => {
          setAuthSuccessMsg('');
          onClose();
        }, 1000);
      } else {
        // Login mode
        if (usersDb[cleanEmail]) {
          if (usersDb[cleanEmail].password && usersDb[cleanEmail].password !== password) {
            setIsSubmitting(false);
            setErrorMsg('Incorrect password. Please verify and try again.');
            return;
          }
          const loggedUser = usersDb[cleanEmail];
          onLogin(loggedUser);
          setIsSubmitting(false);
          setAuthSuccessMsg(`Welcome back, ${loggedUser.name}!`);
          setTimeout(() => {
            setAuthSuccessMsg('');
            onClose();
          }, 1000);
        } else {
          // If first time logging in with this email, create user record
          const newUser = {
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            password: password,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
            authProvider: 'Email & Password',
            dgcaLicense: 'Standard Builder',
            joinedAt: new Date().toLocaleDateString('en-IN')
          };
          usersDb[cleanEmail] = newUser;
          localStorage.setItem('aeroforge_registered_users', JSON.stringify(usersDb));

          onLogin(newUser);
          setIsSubmitting(false);
          setAuthSuccessMsg(`Authenticated as ${newUser.name}!`);
          setTimeout(() => {
            setAuthSuccessMsg('');
            onClose();
          }, 1000);
        }
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to process authentication. Please try again.');
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          title="Close"
        >
          <X className="icon-sm" />
        </button>

        {/* Success Banner */}
        {authSuccessMsg && (
          <div className="telemetry-badge volt" style={{ width: '100%', padding: '10px', marginBottom: '16px', justifyContent: 'center' }}>
            <CheckCircle2 className="icon-sm" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(255,51,85,0.15)', border: '1px solid var(--crimson-core)', borderRadius: '8px', color: '#ff6b81', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '14px', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.4 }}>
            <AlertCircle className="icon-sm" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* If user is already logged in, show Profile */}
        {user ? (
          <div className="space-y-4 text-center">
            <div style={{ width: '72px', height: '72px', margin: '0 auto', borderRadius: '50%', padding: '2px', border: '2px solid var(--amber-core)', overflow: 'hidden' }}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                {user.name}
              </h3>
              <p className="font-mono text-cyan text-xs">
                {user.email}
              </p>
            </div>

            <div className="flex justify-center gap-2">
              <span className="telemetry-badge amber">
                {user.dgcaLicense || 'Verified Pilot'}
              </span>
              <span className="telemetry-badge volt">
                Auth: {user.authProvider}
              </span>
            </div>

            <div className="stat-box cyan text-left">
              <span className="font-mono text-slate-400" style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                DIGITAL SKY &amp; INDIAN DRONE WORKSPACE:
              </span>
              <p className="text-xs text-slate-300" style={{ margin: 0 }}>
                Logged in successfully. All your customized drone CAD architectures, Indian component BOMs, and wiring notes are synced to your account.
              </p>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="btn-aero-secondary w-full"
              style={{ color: 'var(--crimson-core)', borderColor: 'rgba(255,51,85,0.4)', marginTop: '8px' }}
            >
              <LogOut className="icon-sm" />
              <span>Log Out of AeroForge</span>
            </button>
          </div>
        ) : (
          /* Login / Signup Tabs */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-amber">
                <ShieldCheck className="icon-md" />
                <span className="font-display font-bold text-2xl uppercase tracking-wider text-white">
                  AeroForge Portal
                </span>
              </div>
              <p className="text-xs text-slate-400" style={{ margin: 0 }}>
                Sign in with your Google account or email to sync real drone architectures.
              </p>
            </div>

            {/* Official Google Button Render Container (if available) */}
            <div ref={googleButtonContainerRef} style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }} />

            {/* Google / Gmail Custom Action Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="google-btn"
              title="Sign in using official Google Identity Services"
            >
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSubmitting ? 'Connecting with Google...' : 'Continue with Google / Gmail'}</span>
            </button>

            {/* Google OAuth Configuration Drawer Toggle */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setShowClientIdConfig(!showClientIdConfig)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: googleClientId ? 'var(--volt-core)' : 'var(--amber-core)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Settings className="icon-xs" />
                <span>
                  {googleClientId
                    ? 'Google Client ID: Active (Configure)'
                    : 'Set Google OAuth Client ID for Real Sign-In'}
                </span>
              </button>
            </div>

            {/* Expandable Google OAuth Client ID Configuration Box */}
            {showClientIdConfig && (
              <div 
                className="aero-glass-heavy" 
                style={{ 
                  padding: '14px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(8, 12, 20, 0.95)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="font-mono text-amber font-bold text-xs" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Key className="icon-xs" />
                    <span>GOOGLE OAUTH CLIENT ID CONFIG</span>
                  </span>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--cyan-core)', fontSize: '11px', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  >
                    <span>Google Cloud Console</span>
                    <ExternalLink className="icon-xs" />
                  </a>
                </div>

                <p className="text-slate-400" style={{ fontSize: '11px', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  Real Google OAuth requires a Web Client ID from Google Cloud Console with <strong className="text-white">http://localhost:5173</strong> in <em>Authorized JavaScript origins</em>.
                </p>

                <form onSubmit={handleSaveClientId} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="xxxxxxxxxxxx-xxxxxxxx.apps.googleusercontent.com"
                    value={clientIdInput}
                    onChange={(e) => setClientIdInput(e.target.value)}
                    className="aero-input"
                    style={{ fontSize: '11px', padding: '8px 10px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="submit"
                      className="btn-aero-primary"
                      style={{ padding: '6px 12px', fontSize: '11px', flex: 1 }}
                    >
                      <Check className="icon-xs" />
                      <span>Save Client ID</span>
                    </button>
                    {googleClientId && (
                      <button
                        type="button"
                        onClick={() => {
                          setClientIdInput('');
                          localStorage.removeItem('aeroforge_google_client_id');
                          setGoogleClientId('');
                        }}
                        className="btn-aero-secondary"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </form>

                {idSavedAlert && (
                  <div style={{ color: 'var(--volt-core)', fontSize: '11px', fontFamily: 'var(--font-mono)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 className="icon-xs" />
                    <span>Client ID saved! Click "Continue with Google" above to sign in.</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 my-2" style={{ margin: '10px 0' }}>
              <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span className="font-mono text-slate-500 uppercase" style={{ fontSize: '10px' }}>or with email &amp; password</span>
              <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {authMode === 'signup' && (
                <div>
                  <label className="font-mono text-slate-300 text-xs" style={{ display: 'block', marginBottom: '4px' }}>
                    YOUR FULL NAME / CALLSIGN
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="aero-input"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-mono text-slate-300 text-xs" style={{ display: 'block', marginBottom: '4px' }}>
                  GMAIL / EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="pilot@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="aero-input"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-slate-300 text-xs" style={{ display: 'block', marginBottom: '4px' }}>
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="aero-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-aero-primary w-full"
                style={{ marginTop: '12px' }}
              >
                <span>{authMode === 'login' ? 'Authorize & Enter Lab' : 'Create Builder Account'}</span>
                <ArrowRight className="icon-sm" />
              </button>
            </form>

            {/* Switch Mode Toggle */}
            <div className="text-center pt-2 text-xs text-slate-400" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              {authMode === 'login' ? (
                <p style={{ margin: 0 }}>
                  New to AeroForge?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-amber font-bold hover:underline"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Register free account
                  </button>
                </p>
              ) : (
                <p style={{ margin: 0 }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-cyan font-bold hover:underline"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
