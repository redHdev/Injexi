import HeadMeta from '/src/components/HeadMeta.js'; 
import styles from '/src/components/index.module.css';
import Header from '../components/header'; // Import the Header component

function Home() {
  return (
    <div>
      <HeadMeta page="home" />
      
      
      <Header isHomepage={true} /> {/* Add the Header component here with isHomepage prop set to true */}

      
        <div className={styles.homefirstblock}>
        <div className={styles.content}>
          <p><i className="fa-solid fa-heart" style={{color: '#f64cb7'}}></i>   <strong>Enhance your aesthetics</strong></p>
          <h1 className={styles.homeh1}>Find <span className={styles.headlinespan}>Cosmetic</span> Treatment Providers</h1>

          <a href="/au/"><button className={styles.homemainbutton}>Find Clinics Near You</button></a>
          
          <div>
            <ul className={styles.treatmentlist}>
            <li><a href="/au/anti-wrinkle-injections/">Anti-Wrinkle Injections</a></li>
            <li><a href="/au/profhilo/">Profhilo</a></li>
            <li><a href="/au/dermal-filler/">Dermal Fillers</a></li>
            <li><a href="/au/lip-filler/">Lip Filler</a></li>
            <li><a href="/au/prp-treatment/">PRP Treatment</a></li>
            <li><a href="/au/skin-needling/">Microneedling</a></li>
            <li><a href="/au/">See All Treatments</a></li>
            </ul>
          </div>
        </div></div>
        <div className={styles.containerhome}>
        <div className={styles.homesecondblock}>
          <h2 className={styles.homeh2}>The <span className={styles.headlinespan}>Skincare Directory</span> Of The Future </h2>

          <p>Injexi.com is a pioneering online platform that bridges the gap between consumers and cosmetic treatment professionals. It has built a vast, comprehensive directory that links you to local businesses offering a variety of cosmetic and skincare treatments such as PRP (Platelet-Rich Plasma), Botox, Bio-remodelling, Profhilo, Dermal Fillers,  Facial Services, Microneedling and more. </p>

          <p>The convenience of this online directory allows customers to discover, compare, and choose services that best suit their cosmetic and skincare needs, all from the comfort of their homes.</p>

          <p>One of the distinguishing features of Injexi.com is its commitment to transparency. It provides clear and detailed information about the prices of each service, ensuring that users can make informed decisions about their skincare treatments. </p>

          <p>This enables users to plan and budget effectively and can help to demystify the often opaque pricing structures in the skincare industry. With its user-friendly interface and dedication to transparency, Injexi.com is making it easier than ever to navigate the world of cosmetic treatments.</p>

          <a href="/au/"><button className={styles.homesecondbutton}>Find Providers Near You   <i className="fa-solid fa-arrow-right"></i></button></a>
        </div>
      </div>
    </div>
  )
}

export default Home;
