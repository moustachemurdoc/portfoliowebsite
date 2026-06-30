import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Check } from 'lucide-react';
import { Header } from './components/Header';
import { Lightbox } from './components/Lightbox';
import { projects, Project } from './projectsData';

function App() {
  const [currentTab, setCurrentTab] = useState<string>('work');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Handle URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['work', 'about', 'contact'];
      
      // Check if hash matches a project ID
      const matchingProject = projects.find(p => p.id === hash);
      
      if (matchingProject) {
        setSelectedProjectId(matchingProject.id);
        setCurrentTab('work');
      } else if (validTabs.includes(hash)) {
        setCurrentTab(hash);
        setSelectedProjectId(null);
      } else {
        // Default
        setCurrentTab('work');
        setSelectedProjectId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Call once on mount
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    window.location.hash = projectId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearProject = () => {
    setSelectedProjectId(null);
    window.location.hash = currentTab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }, 1200);
  };

  const currentProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="portfolio-app">
      <Header 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.location.hash = tab;
        }} 
        clearProject={handleClearProject} 
      />

      <main className="container">
        {currentTab === 'work' && (
          <>
            {!selectedProjectId ? (
              // HOMEPAGE: PROJECTS GRID
              <>

                <div className="projects-grid" id="projects-grid">
                  {projects.map((project: Project) => (
                    <article 
                      key={project.id} 
                      className="project-card"
                      onClick={() => handleSelectProject(project.id)}
                      id={`project-card-${project.id}`}
                    >
                      <div className="project-card-image-wrapper">
                        <img 
                          src={project.coverImage} 
                          alt={`Copertina del progetto ${project.title}`} 
                          loading="lazy"
                        />
                      </div>
                      <div className="project-card-info">
                        <h2 className="project-card-title">{project.title}</h2>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              // PROJECT DETAIL PAGE
              currentProject && (
                <section className="project-detail-view">
                  <div className="project-header">
                    <button 
                      onClick={handleClearProject} 
                      className="back-button"
                      id="project-back-btn"
                    >
                      <ArrowLeft size={16} /> Torna ai Progetti
                    </button>
                    <h1 className="project-detail-title">{currentProject.title}</h1>
                    <div className="project-detail-meta" id="project-detail-meta">
                      Collezione fotografica — {currentProject.images.length} scatti
                    </div>
                  </div>

                  <div className="photos-masonry" id="photos-masonry">
                    {currentProject.images.map((imagePath, index) => {
                      const filename = imagePath.split('/').pop() || '';
                      return (
                        <div 
                          key={imagePath} 
                          className="photo-item"
                          onClick={() => handleOpenLightbox(index)}
                          id={`photo-item-${index}`}
                        >
                          <img 
                            src={imagePath} 
                            alt={`${currentProject.title} - ${filename}`} 
                            loading="lazy"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <Lightbox 
                    isOpen={lightboxOpen}
                    images={currentProject.images}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                    onNavigate={(index) => setLightboxIndex(index)}
                  />
                </section>
              )
            )}
          </>
        )}

        {currentTab === 'about' && (
          // ABOUT PAGE
          <section className="about-section" id="about-section">
            <div className="about-grid">
              <div className="about-text">
                <h2>La Mia Storia</h2>
                <p>
                  Sono Matteo Romano, fotografo d'arte e ritrattista con base in Italia. La mia ricerca fotografica si concentra sull'intersezione tra luce naturale, architetture urbane ed elementi selvaggi della natura.
                </p>
                <p>
                  Credo che ogni scatto debba raccontare una storia intima ed espressiva, priva di artifici. Catturo momenti che sfuggono alla quotidianità, immortalando contrasti intensi e geometrie spontanee.
                </p>
                <p>
                  I miei lavori sono stati esposti in gallerie indipendenti e raccolti in pubblicazioni di settore. Collaboro con riviste d'arte, brand di design e progetti editoriali internazionali.
                </p>
              </div>
              <div className="about-image" id="about-image-wrapper">
                <img 
                  src="/about-portrait.jpg" 
                  alt="Ritratto di Matteo Romano" 
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        )}

        {currentTab === 'contact' && (
          // CONTACT PAGE
          <section className="contact-section" id="contact-section">
            <h2>Mettiamoci in Contatto</h2>
            <p>
              Per progetti commerciali, stampe d'arte o semplici collaborazioni, inviami un messaggio. Ti risponderò al più presto.
            </p>

            <form className="contact-form" onSubmit={handleContactSubmit} id="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Nome</label>
                <input 
                  type="text" 
                  id="contact-name" 
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  disabled={formStatus === 'submitting'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input 
                  type="email" 
                  id="contact-email" 
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  disabled={formStatus === 'submitting'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Messaggio</label>
                <textarea 
                  id="contact-message" 
                  rows={6} 
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  disabled={formStatus === 'submitting'}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={formStatus !== 'idle'}
                id="contact-submit-btn"
              >
                {formStatus === 'idle' && (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Invia Messaggio <Send size={16} />
                  </span>
                )}
                {formStatus === 'submitting' && 'Invio in corso...'}
                {formStatus === 'success' && (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981' }}>
                    Messaggio Inviato! <Check size={16} />
                  </span>
                )}
              </button>
            </form>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Matteo Romano Photography. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
