import React from 'react';

interface HeaderProps {
  currentTab: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  // La navigazione è guidata dall'hash: impostarlo fa scattare il router
  // in App.tsx, che aggiorna il tab e chiude eventuali progetti aperti.
  const navigate = (tab: string) => {
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <a
          href="#work"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            navigate('work');
          }}
          id="nav-logo"
        >
          Matteo Romano
        </a>

        <nav>
          <ul className="nav-links">
            <li>
              <a
                href="#work"
                className={currentTab === 'work' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('work');
                }}
                id="nav-work"
              >
                Work
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={currentTab === 'contact' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('contact');
                }}
                id="nav-contact"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
