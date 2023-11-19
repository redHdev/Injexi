import React from 'react';
import styles from './footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        <div className={styles.aboutSection}>
          <h2>About Injexi</h2>
          <p>Injexi is your trusted destination to find service providers in your local area that can help you to level up your appearance aesthetically.</p><p> Sometimes in life, all we need is a little confidence boost. Injexi will pair you with the exact service you need to take your appearance to the next level.</p>

          <div className={styles.socialLinks}>
            <a href="https://www.facebook.com/injexi" target="_blank" rel="noreferrer"><i className="fa-brands fa-square-facebook fa-2xl"></i></a>
            <a href="https://www.instagram.com/injexiofficial" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram fa-2xl"></i></a>
          </div>
        </div>

        <div className={styles.menuSection}>
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/about/">About Us</a></li>
            <li><a href="/au/">Find Provider</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/contact/">Contact</a></li>
            <li><a href="/for-business/">For Business</a></li>
            <li><a href="/register/">Join The Injexi Club</a></li>
            <li><a href="/login/">Sign In</a></li>
          </ul>
        </div>

      </div>

      <div className={styles['footer-bottom']}>
        <p>© Injexi.com 2023 - Saorsa & Murphy Ltd &nbsp;<i className={`fa-solid fa-heart ${styles.heartIcon}`}></i>&nbsp; <a href="/sitemap/">Sitemap</a> | <a href="/terms/">Terms</a> | <a href="/privacy/">Privacy</a></p>
      </div>
    </footer>
  );
};

export default Footer;
