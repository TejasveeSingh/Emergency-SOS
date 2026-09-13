/**
 * SafeHer Emergency Assistance / SOS Application Engine
 * Pure modern ES6, zero external runtime dependencies.
 */

// Application State
const appState = {
  currentView: 'login',
  userName: null,
  latitude: null,
  longitude: null,
  accuracy: null,
  googleMapsUrl: '',
  emergencyMessage: '',
  isSosActive: false,
};

// DOM Elements - Views
const views = {
  login: document.getElementById('view-login'),
  home: document.getElementById('view-home'),
  confirmation: document.getElementById('view-confirmation'),
  loading: document.getElementById('view-loading'),
  error: document.getElementById('view-error'),
  active: document.getElementById('view-active'),
};

// Auth Elements
const formLogin = document.getElementById('form-login');
const inputLoginName = document.getElementById('input-login-name');
const btnSubmitLogin = document.getElementById('btn-submit-login');
const btnGuestLogin = document.getElementById('btn-guest-login');
const btnQuickTanishka = document.getElementById('btn-quick-tanishka');
const userGreetingName = document.getElementById('user-greeting-name');
const btnLogout = document.getElementById('btn-logout');
const avatarBadgeBtn = document.getElementById('avatar-badge-btn');
const navItemProfile = document.getElementById('nav-item-profile');
const navItemHome = document.getElementById('nav-item-home');

// SOS Buttons
const btnOpenSos = document.getElementById('btn-open-sos');
const btnBackHome = document.getElementById('btn-back-home');
const btnCancelSos = document.getElementById('btn-cancel-sos');
const btnActivateSos = document.getElementById('btn-activate-sos');
const btnErrorCancel = document.getElementById('btn-error-cancel');
const btnErrorRetry = document.getElementById('btn-error-retry');
const btnViewMap = document.getElementById('btn-view-map');
const btnCopyMessage = document.getElementById('btn-copy-message');
const btnCallEmergency = document.getElementById('btn-call-emergency');
const btnSafeNow = document.getElementById('btn-safe-now');
const btnCloseModal = document.getElementById('btn-close-modal');

// Displays & Content
const displayLatitude = document.getElementById('display-latitude');
const displayLongitude = document.getElementById('display-longitude');
const displayAccuracy = document.getElementById('display-accuracy');
const displayTimestamp = document.getElementById('display-timestamp');
const emergencyMessageContent = document.getElementById('emergency-message-content');
const errorMessageText = document.getElementById('error-message-text');
const modalEmergencyCall = document.getElementById('modal-emergency-call');
const toastCard = document.getElementById('toast-message');
const toastText = document.getElementById('toast-text');

let toastTimeout = null;

// ==========================================
// VIEW NAVIGATION
// ==========================================
function switchView(viewName) {
  Object.keys(views).forEach((key) => {
    if (views[key]) {
      views[key].classList.remove('active-view');
    }
  });

  if (views[viewName]) {
    views[viewName].classList.add('active-view');
    appState.currentView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, duration = 2800) {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  toastText.textContent = message;
  toastCard.classList.add('show');

  toastTimeout = setTimeout(() => {
    toastCard.classList.remove('show');
  }, duration);
}

// ==========================================
// AUTHENTICATION MANAGEMENT
// ==========================================
function setLoggedInUser(name) {
  const trimmed = name ? name.trim() : 'User';
  appState.userName = trimmed;
  userGreetingName.textContent = `Hello, ${trimmed}`;
  localStorage.setItem('safeher_user_name', trimmed);
  switchView('home');
  showToast(`Welcome, ${trimmed}!`);
}

function logoutUser() {
  appState.userName = null;
  localStorage.removeItem('safeher_user_name');
  userGreetingName.textContent = 'Hello, User';
  if (inputLoginName) {
    inputLoginName.value = '';
  }
  switchView('login');
  showToast('Logged out. Please sign in.');
}

// Initialize Auth on Page Load
function initAuth() {
  const savedName = localStorage.getItem('safeher_user_name');
  if (savedName) {
    appState.userName = savedName;
    userGreetingName.textContent = `Hello, ${savedName}`;
    switchView('home');
  } else {
    // If not logged in yet, start at Login page
    userGreetingName.textContent = 'Hello, User';
    switchView('login');
  }
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================
function openModal() {
  modalEmergencyCall.classList.add('active');
  modalEmergencyCall.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalEmergencyCall.classList.remove('active');
  modalEmergencyCall.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ==========================================
// GEOLOCATION ENGINE
// ==========================================
function requestUserLocation() {
  switchView('loading');

  if (!navigator.geolocation) {
    handleLocationError({
      code: -1,
      message: 'Geolocation is not supported by your browser.',
    });
    return;
  }

  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(
    onLocationSuccess,
    onLocationError,
    geoOptions
  );
}

function onLocationSuccess(position) {
  const { latitude, longitude, accuracy } = position.coords;

  appState.latitude = latitude;
  appState.longitude = longitude;
  appState.accuracy = accuracy;
  appState.isSosActive = true;

  // Build real Google Maps URL
  appState.googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  // Build Emergency Message dynamically
  const senderInfo = appState.userName ? ` (${appState.userName})` : '';
  appState.emergencyMessage = `EMERGENCY! I need immediate help.\nMy current location:\n${appState.googleMapsUrl}`;

  // Update DOM displays
  displayLatitude.textContent = `${latitude.toFixed(6)}°`;
  displayLongitude.textContent = `${longitude.toFixed(6)}°`;
  
  if (accuracy) {
    displayAccuracy.textContent = `Accuracy: ±${Math.round(accuracy)}m`;
  } else {
    displayAccuracy.textContent = `Accuracy: High`;
  }

  const now = new Date();
  displayTimestamp.textContent = `Updated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

  emergencyMessageContent.textContent = appState.emergencyMessage;

  // Switch to SOS Active Screen
  switchView('active');
}

function onLocationError(error) {
  handleLocationError(error);
}

function handleLocationError(error) {
  let userFriendlyMsg = 'Unable to detect your location. Please try again.';

  if (error) {
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        userFriendlyMsg = 'Location permission is required to share your current location.';
        break;
      case 2: // POSITION_UNAVAILABLE
      case 3: // TIMEOUT
        userFriendlyMsg = 'Unable to detect your location. Please try again.';
        break;
      default:
        userFriendlyMsg = 'Unable to detect your location. Please check browser settings and try again.';
        break;
    }
  }

  errorMessageText.textContent = userFriendlyMsg;
  switchView('error');
}

// ==========================================
// CLIPBOARD API (With graceful fallback)
// ==========================================
async function copyEmergencyMessage() {
  const textToCopy = appState.emergencyMessage;
  if (!textToCopy) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('Emergency message copied');
      return;
    } catch (err) {
      console.warn('Clipboard API error, attempting fallback:', err);
    }
  }

  // Fallback for environments where clipboard writeText is restricted
  try {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      showToast('Emergency message copied');
    } else {
      showToast('Unable to copy message automatically');
    }
  } catch (err) {
    console.error('Fallback clipboard error:', err);
    showToast('Clipboard unavailable. Please select text manually.');
  }
}

// ==========================================
// RESET & DEACTIVATE ("I'M SAFE NOW")
// ==========================================
function deactivateSosAndReset() {
  appState.latitude = null;
  appState.longitude = null;
  appState.accuracy = null;
  appState.googleMapsUrl = '';
  appState.emergencyMessage = '';
  appState.isSosActive = false;

  displayLatitude.textContent = 'Detecting...';
  displayLongitude.textContent = 'Detecting...';
  emergencyMessageContent.textContent = '';

  switchView('home');
  showToast('You are marked safe. SOS deactivated.', 3200);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Auth Event Listeners
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  const enteredName = inputLoginName.value.trim();
  if (enteredName) {
    setLoggedInUser(enteredName);
  } else {
    setLoggedInUser('User');
  }
});

btnGuestLogin.addEventListener('click', () => {
  setLoggedInUser('Guest');
});

btnQuickTanishka.addEventListener('click', () => {
  inputLoginName.value = 'Tanishka';
  setLoggedInUser('Tanishka');
});

if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    logoutUser();
  });
}

if (avatarBadgeBtn) {
  avatarBadgeBtn.addEventListener('click', () => {
    logoutUser();
  });
}

if (navItemProfile) {
  navItemProfile.addEventListener('click', () => {
    logoutUser();
  });
}

if (navItemHome) {
  navItemHome.addEventListener('click', () => {
    if (appState.userName) {
      switchView('home');
    } else {
      switchView('login');
    }
  });
}

// Home Page -> Click Emergency SOS Banner
btnOpenSos.addEventListener('click', () => {
  switchView('confirmation');
});

// Confirmation Back & Cancel
btnBackHome.addEventListener('click', () => {
  switchView('home');
});

btnCancelSos.addEventListener('click', () => {
  switchView('home');
});

// Confirmation -> Activate SOS
btnActivateSos.addEventListener('click', () => {
  requestUserLocation();
});

// Error View -> Retry & Cancel
btnErrorRetry.addEventListener('click', () => {
  requestUserLocation();
});

btnErrorCancel.addEventListener('click', () => {
  switchView('home');
});

// SOS Active -> View On Map
btnViewMap.addEventListener('click', () => {
  if (appState.googleMapsUrl) {
    window.open(appState.googleMapsUrl, '_blank', 'noopener,noreferrer');
  } else {
    showToast('Location URL not yet available');
  }
});

// SOS Active -> Copy Message
btnCopyMessage.addEventListener('click', () => {
  copyEmergencyMessage();
});

// SOS Active -> Call 112
btnCallEmergency.addEventListener('click', () => {
  openModal();
});

// Close Modal
btnCloseModal.addEventListener('click', () => {
  closeModal();
});

modalEmergencyCall.addEventListener('click', (e) => {
  if (e.target === modalEmergencyCall) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalEmergencyCall.classList.contains('active')) {
    closeModal();
  }
});

// SOS Active -> I'm Safe Now
btnSafeNow.addEventListener('click', () => {
  deactivateSosAndReset();
});

// Start App
initAuth();
