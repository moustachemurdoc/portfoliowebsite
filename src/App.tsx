import { useState, useEffect } from 'react';
import { ArrowLeft, Linkedin, Instagram } from 'lucide-react';
import { Header } from './components/Header';
import { Lightbox } from './components/Lightbox';
import { JustifiedGallery } from './components/JustifiedGallery';
import { projects, Project } from './projectsData';

const getAssetUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

const resolvedProjects = projects.map(p => ({
  ...p,
  coverImage: getAssetUrl(p.coverImage),
  images: p.images.map(getAssetUrl)
}));


function App() {
  const [currentTab, setCurrentTab] = useState<string>('work');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Handle URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['work', 'contact'];
      
      // Check if hash matches a project ID
      const matchingProject = resolvedProjects.find(p => p.id === hash);
      
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

  const currentProject = resolvedProjects.find(p => p.id === selectedProjectId);

  return (
    <div className="portfolio-app">
      <Header currentTab={currentTab} />

      <main className="container">
        {currentTab === 'work' && (
          <>
            {!selectedProjectId ? (
              // HOMEPAGE: PROJECTS GRID
              <>

                <div className="projects-grid" id="projects-grid">
                  {resolvedProjects.map((project: Project) => (
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
                        <div className="project-card-overlay">
                          <span className="project-card-overlay-title">{project.title}</span>
                        </div>
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
                  </div>

                  <JustifiedGallery
                    photos={currentProject.images.map(imagePath => ({
                      src: imagePath,
                      alt: `${currentProject.title} - ${imagePath.split('/').pop() || ''}`,
                    }))}
                    onPhotoClick={handleOpenLightbox}
                  />

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

        {currentTab === 'contact' && (
          // CONTACT PAGE
          <section className="contact-section" id="contact-section">
            <h2>Mettiamoci in Contatto</h2>

            <div className="contact-details" id="contact-details">
              <p className="contact-line">
                Contattami su{' '}
                <a
                  href="mailto:matteoromanobox@gmail.com"
                  className="contact-link"
                  id="contact-email-link"
                >
                  matteoromanobox@gmail.com
                </a>
              </p>
              <p className="contact-line">
                <a
                  href="tel:+393421933331"
                  className="contact-link"
                  id="contact-phone-link"
                >
                  +39 342 19 33 331
                </a>
              </p>

              <div className="contact-socials">
                <a
                  href="https://www.linkedin.com/in/matteoromanolnkdn/"
                  className="contact-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-linkedin-link"
                >
                  <Linkedin size={18} /> LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/asaplevi/"
                  className="contact-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-instagram-link"
                >
                  <Instagram size={18} /> Instagram
                </a>
              </div>
            </div>
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
