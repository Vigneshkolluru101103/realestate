import { useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import './AppLayout.css';

export default function AppLayout({
  activeNavId = 'home',
  onNavigate,
  selectedLanguage = 'EN',
  onSelectLanguage,
  user,
  onLogout,
  children
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const greeting = user ? `Hello, ${user.name} ≡ƒæï` : 'Hello, Broker ≡ƒæï';

  return (
    <div className="zd-app-shell">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar
        activeNavId={activeNavId}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />

      {/* Mobile Drawer (visible on narrow screens when triggered) */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeNavId={activeNavId}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />

      {/* Main View Area */}
      <div className="zd-main-wrapper">
        <Header
          greeting={greeting}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={onSelectLanguage}
        />

        <main className="zd-content-viewport" id="main-content">
          <div className="zd-content-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
