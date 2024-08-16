import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import euaLogo from '@assets/images/eua-logo.png';
import styles from './FooterAddress.module.scss';

const socialMediaIconSize = 20;

const socialMediaIcons = [
  {
    name: 'facebook',
    icon: <FaFacebookF size={socialMediaIconSize} />
  },
  {
    name: 'twitter',
    icon: <FaTwitter size={socialMediaIconSize} />
  },
  {
    name: 'instagram',
    icon: <FaInstagram size={socialMediaIconSize} />
  },
  {
    name: 'youtube',
    icon: <FaYoutube size={socialMediaIconSize} />
  }
];

const FooterAddress = () => (
  <div className={styles.container}>
    <div>
      <img src={euaLogo} alt="eUniversity Africa" />
      <h3 className="mt-1">eUniversity Africa</h3>
    </div>
    <div>
      <div>C/O Digital Bridge Institute</div>
      <div>Cappa-Oshodi, Agege Motor Road,</div>
      <div>Lagos, Nigeria</div>
    </div>
    <div>
      <div>
        Phone: <a href="tel:+234 803 588 5539">+234 803 588 5539</a>
      </div>
      <div>Email: info@euniversityedu.africa</div>
    </div>
    <div className="d-flex">
      {socialMediaIcons.map(({ name, icon }) => (
        <div className={styles.socialIcon} key={name}>
          {icon}
        </div>
      ))}
    </div>
  </div>
);

export default FooterAddress;
