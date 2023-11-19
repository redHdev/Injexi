import React, { useState, useEffect } from 'react';
import styles from './header.module.css';
import { useSession } from 'next-auth/react';

const Header = ({ isHomepage = false }) => {
  // State to track whether the menu is open or not
  const [menuOpen, setMenuOpen] = useState(false);

  // Use Next Auth to check for a session
  const { data: session } = useSession();
  const isLoggedIn = !!session; 

  const toggleMenu = (event) => {
    if (event.target.closest('.menuToggle')) { // Replace '.menuToggle' with the appropriate selector or condition
      event.preventDefault();
      event.stopPropagation();
      setMenuOpen((prevState) => !prevState);
    }
  };

  // Effect to close the menu when clicking outside
  useEffect(() => {
    const closeMenu = () => {
      setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('click', closeMenu);
    }

    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Top Bar */}
      {!isLoggedIn && ( // Show this div only when the user is not logged in
  <div className={styles.headerTopBar}>
    <div className={styles.innerContainer}>
      <div></div>
      <div className={styles.rightSide}>
        <a href="/register" className={`${styles.link} ${styles.customUnderline}`}>
          <i className={`fa-solid fa-heart ${styles.heartIcon}`}></i> Join The Injexi Club - Free
        </a>
        /
        <a href="/login" className={`${styles.link} ${styles.customUnderline}`}>
          {isLoggedIn ? "Log Out" : "Sign In"} {/* Conditionally display text based on login status */}
        </a>
      </div>
    </div>
  </div>
)}


      {/* Main Header */}
      <header className={`${styles.header} ${isHomepage ? styles.homepage : ''}`}>
        <div className={styles['header-container']}>
          {/* Logo */}
          <div className={styles.logo}>
            <a href="/">Injexi</a>
          </div>

          {/* Navigation */}
          <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
            {/* Hamburger Menu */}
            <div className={`${styles.hamburger} menuToggle`} onClick={toggleMenu}>
              &#9776;
            </div>

            {/* Main Menu */}
            <ul className={styles.hideBlackOnMobile}><li className={styles.hideOnMobile}><a href="/for-business/">For Business</a></li>
              <li onClick={toggleMenu}>
              <a href="#" className={`${styles.hideOnMobile} menuToggle`}>Menu&nbsp;<i className="fa-solid fa-chevron-down"></i></a>
                {menuOpen && (
                 
                  <ul className={styles.submenu}>
                    
                    <li><a href="/au/anti-wrinkle-injections/">Anti-Wrinkle Injections</a></li>
                    <li><a href="/au/dermal-filler/">Dermal Filler</a></li>
                    <li><a href="/au/skin-needling/">Microneedling</a></li>
                    <li><a href="/au/lip-filler/">Lip Filler</a></li>
                    <li><a href="/au/profhilo/">Profhilo</a></li>
                    <li><a href="/au/prp-treatment/">PRP Treatment</a></li>
                    <li className={styles.lastmenuitem}><a href="/au/">See All Cosmetic Treatments</a></li>
                    
                  </ul>
                  
                )}
              </li>
            </ul>
            
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
