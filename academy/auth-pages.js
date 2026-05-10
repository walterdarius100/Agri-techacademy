import {
  continueWithGoogleOAuth,
  getGoogleOAuthDiagnostic,
  getRedirectTarget,
  isAuthenticated,
  loginWithMockCredentials,
  registerMockUser,
  requestPasswordResetMock,
  updateAcademyAuthNavigation
} from '../lib/academy-auth.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initAcademyNavigation() {
  const menuButton = document.querySelector('#academyMenuBtn');
  const navLinks = document.querySelector('#academyNavLinks');

  if (!menuButton || !navLinks) return;

  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

function getField(form, name) {
  return form.elements.namedItem(name);
}

function setFormMessage(form, message, type = 'error') {
  const box = form.querySelector('[data-auth-message]');
  if (!box) return;

  box.textContent = message;
  box.className = `auth-message auth-message--${type}`;
  box.hidden = !message;
}

function setFieldError(input, message) {
  const field = input.closest('.auth-field');
  const error = field?.querySelector('.auth-field__error');

  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll('.auth-field input').forEach((input) => setFieldError(input, ''));
  setFormMessage(form, '');
}

function setLoading(form, isLoading) {
  const button = form.querySelector('.auth-submit[data-submit-label]');
  form.setAttribute('aria-busy', String(isLoading));
  form.querySelectorAll('input, button').forEach((element) => {
    element.disabled = isLoading;
  });

  if (button) {
    button.textContent = isLoading ? button.dataset.loadingLabel : button.dataset.submitLabel;
  }
}


function setGoogleButtonLoading(button, isLoading) {
  button.disabled = isLoading;
  button.setAttribute('aria-busy', String(isLoading));

  const label = button.querySelector('[data-google-label]');
  if (label) {
    label.textContent = isLoading ? button.dataset.googleLoadingLabel : button.dataset.googleSubmitLabel;
  }
}

function validateLogin(form) {
  let isValid = true;
  const email = getField(form, 'email');
  const password = getField(form, 'password');

  if (!EMAIL_PATTERN.test(email.value.trim())) {
    setFieldError(email, 'Entrez un email valide.');
    isValid = false;
  }

  if (password.value.length < 6) {
    setFieldError(password, 'Le mot de passe doit contenir au moins 6 caractères.');
    isValid = false;
  }

  return isValid;
}

function validateRegister(form) {
  let isValid = validateLogin(form);
  const name = getField(form, 'name');
  const password = getField(form, 'password');
  const terms = getField(form, 'terms');

  if (name.value.trim().length < 2) {
    setFieldError(name, 'Indiquez votre nom complet.');
    isValid = false;
  }

  if (!/[0-9]/.test(password.value) || !/[a-zA-Z]/.test(password.value)) {
    setFieldError(password, 'Utilisez au moins 6 caractères avec lettres et chiffres.');
    isValid = false;
  }

  if (!terms.checked) {
    setFormMessage(form, 'Vous devez accepter les conditions de simulation pour créer un compte.');
    isValid = false;
  }

  return isValid;
}

function validateForgotPassword(form) {
  const email = getField(form, 'email');
  const isValid = EMAIL_PATTERN.test(email.value.trim());
  if (!isValid) setFieldError(email, 'Entrez l’email associé à votre compte.');
  return isValid;
}

function redirectAfterAuth() {
  window.location.assign(getRedirectTarget('../dashboard/'));
}


function initGoogleOAuthButtons() {
  document.querySelectorAll('[data-google-auth]').forEach((button) => {
    button.addEventListener('click', async () => {
      const form = button.closest('form');
      if (!form) return;

      setFormMessage(form, '');
      setGoogleButtonLoading(button, true);

      try {
        const result = await continueWithGoogleOAuth({ mode: button.dataset.authMode });

        if (!result.ok) {
          const diagnostic = getGoogleOAuthDiagnostic();
          setFormMessage(form, `${result.message} (${diagnostic.code})`);
          setGoogleButtonLoading(button, false);
        }
      } catch (error) {
        setFormMessage(form, error.message || 'Impossible de démarrer la connexion Google pour le moment.');
        setGoogleButtonLoading(button, false);
      }
    });
  });
}

function initLoginForm() {
  const form = document.querySelector('#academyLoginForm');
  if (!form) return;

  if (isAuthenticated()) {
    redirectAfterAuth();
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(form);

    if (!validateLogin(form)) return;

    setLoading(form, true);
    try {
      await loginWithMockCredentials({
        email: getField(form, 'email').value,
        password: getField(form, 'password').value
      });
      setFormMessage(form, 'Connexion réussie. Redirection vers votre espace…', 'success');
      redirectAfterAuth();
    } catch (error) {
      setFormMessage(form, error.message);
      setLoading(form, false);
    }
  });
}

function initRegisterForm() {
  const form = document.querySelector('#academyRegisterForm');
  if (!form) return;

  if (isAuthenticated()) {
    redirectAfterAuth();
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(form);

    if (!validateRegister(form)) return;

    setLoading(form, true);
    try {
      await registerMockUser({
        name: getField(form, 'name').value,
        email: getField(form, 'email').value,
        password: getField(form, 'password').value
      });
      setFormMessage(form, 'Compte créé. Ouverture de votre dashboard…', 'success');
      redirectAfterAuth();
    } catch (error) {
      setFormMessage(form, error.message);
      setLoading(form, false);
    }
  });
}

function initForgotPasswordForm() {
  const form = document.querySelector('#academyForgotPasswordForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(form);

    if (!validateForgotPassword(form)) return;

    setLoading(form, true);
    const result = await requestPasswordResetMock(getField(form, 'email').value);
    setFormMessage(form, result.message, 'success');
    setLoading(form, false);
    form.reset();
  });
}

const authPagePath = window.location.pathname;
updateAcademyAuthNavigation({
  loginHref: authPagePath.includes('/login') ? './' : '../login/',
  registerHref: authPagePath.includes('/register') ? './' : '../register/',
  dashboardHref: '../dashboard/',
  myCoursesHref: '../my-courses/',
  logoutRedirectHref: '../login/'
});
initAcademyNavigation();
initGoogleOAuthButtons();
initLoginForm();
initRegisterForm();
initForgotPasswordForm();
