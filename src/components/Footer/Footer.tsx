import React from 'react';
import { useNavigate } from 'react-router-dom';
import FooterAddress from '@components/Footer/FooterAddress';
// import { InputButton } from '@components/Form';
import { paths } from '@routes/paths';
import styles from './Footer.module.scss';

const visitingEua = [
  {
    text: 'About us',
    link: ''
  },
  {
    text: 'Cookie Policy',
    link: paths.cookiePolicy
  },
  {
    text: 'Privacy Policy',
    link: paths.privacyPolicy
  },
  {
    text: 'Term of Use',
    link: paths.termsOfUse
  },
  {
    text: 'Careers',
    link: ''
  },
  {
    text: 'Sitemap',
    link: ''
  }
];

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.footerContainer}>
      <div className={styles.grid}>
        <div>
          <FooterAddress />
        </div>
        <div className={styles.usefulLink}>
          <div>USEFUL LINKS</div>
          <div>
            {visitingEua.map(({ text, link }, index) => (
              <div className={styles.link} key={`${text}${index}`} onClick={() => navigate(link)}>
                {text}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.subscribe}>
          <div className="mb-2 lh-lg">
            <div>OUR INFOTAINMENT</div>
            <div>Enter your email address here to subscribe to our infotainment.</div>
          </div>
          {/* <div className={styles.subscribeInput}>
              <InputButton />
            </div> */}
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div>
          Copyright &copy; {new Date().getFullYear()} <b>eUniversity Africa</b>.
        </div>
      </div>
    </div>
  );
};
