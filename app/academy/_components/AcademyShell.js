export function AcademyHeader({ current = 'formations' }) {
  return (
    <>
      <a className="skip-link" href="#main">Aller au contenu principal</a>
      <header className="site-header" id="top">
        <nav className="navbar" aria-label="Navigation principale Académie Agri-Tech">
          <a className="brand" href="/" aria-label="Retour à l’accueil Agri-Tech">
            <span className="brand-mark"><img src="/assets/images/logo-agritech.png" alt="" aria-hidden="true" width="127" height="96" decoding="async" /></span>
            <span className="brand-text"><strong>Agri-tech</strong><small>Académie</small></span>
          </a>
          <button className="menu-btn" id="academyMenuBtn" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="academyNavLinks">☰</button>
          <div className="nav-links" id="academyNavLinks">
            <a href="/academy/" aria-current={current === 'academy' ? 'page' : undefined}>Académie</a>
            <a href="/academy/courses/" aria-current={current === 'formations' ? 'page' : undefined}>Formations</a>
            <a href="/academy/login/">Connexion</a>
            <a href="/academy/register/" className="nav-cta">Créer un compte</a>
          </div>
        </nav>
      </header>
    </>
  );
}

export function AcademyFooter() {
  return (
    <footer className="site-footer academy-footer">
      <div className="footer-container academy-footer__grid">
        <div className="footer-col academy-footer__intro">
          <div className="footer-brand academy-footer__brand">
            <span className="footer-brand-mark"><img src="/assets/images/logo-agritech.png" alt="" aria-hidden="true" width="34" height="34" decoding="async" loading="lazy" /></span>
            <h4>Agri-Tech Academy</h4>
          </div>
          <p>Une plateforme e-learning agricole pratique pour apprendre, suivre ses formations et préparer des projets solides sur le terrain.</p>
        </div>
        <div className="footer-col">
          <h4>Navigation</h4>
          <a href="/">Accueil</a>
          <a href="/academy/">Academy</a>
          <a href="/academy/courses/">Formations</a>
          <a href="/#contact">Contact</a>
        </div>
        <div className="footer-col">
          <h4>Espace étudiant</h4>
          <a href="/academy/dashboard/">Dashboard</a>
          <a href="/academy/my-courses/">Mes formations</a>
          <a href="/academy/my-courses/cuniculture/">Continuer Cuniculture</a>
          <a href="/academy/my-courses/apiculture/">Continuer Apiculture</a>
        </div>
        <div className="footer-col">
          <h4>Formations</h4>
          <a href="/academy/courses/cuniculture/">Cuniculture</a>
          <a href="/academy/courses/aviculture/">Aviculture</a>
          <a href="/academy/courses/apiculture/">Apiculture</a>
          <a href="/academy/courses/">Toutes les formations</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="/#preuves">À propos</a>
          <a href="/#services">Services</a>
          <a href="/#processus">Méthode</a>
          <a href="/#contact">Contact</a>
        </div>
      </div>
      <div className="academy-footer__bottom"><span>© 2026 Agri-tech — Tous droits réservés</span></div>
    </footer>
  );
}

export function AcademyPageShell({ children, current }) {
  return (
    <>
      <AcademyHeader current={current} />
      <script dangerouslySetInnerHTML={{ __html: `document.addEventListener('click',function(event){var button=event.target.closest('#academyMenuBtn');if(!button)return;var nav=document.querySelector('#academyNavLinks');if(!nav)return;var isOpen=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(isOpen));});` }} />
      <main id="main" className="academy-main">{children}</main>
      <AcademyFooter />
    </>
  );
}
