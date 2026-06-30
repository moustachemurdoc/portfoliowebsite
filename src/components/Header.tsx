import React from 'react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  clearProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, clearProject }) => {
  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    clearProject();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <a 
          href="#" 
          className="logo" 
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('work');
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
                  handleNavClick('work');
                }}
                id="nav-work"
              >
                Work
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={currentTab === 'about' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about');
                }}
                id="nav-about"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={currentTab === 'contact' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('contact');
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
