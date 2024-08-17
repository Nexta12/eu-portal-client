import React from 'react';
import first_bank from '@assets/brands/First-Bank.png';
import uba from '@assets/brands/UBA-Logo.png';
import commonWealth from '@assets/brands/commonWealth.png';
import cornField from '@assets/brands/cornfield.png';
import digitalBridge from '@assets/brands/digitalBridge.png';
import eco_bank from '@assets/brands/ecobank.png';
import mainOne from '@assets/brands/mainOne.png';
import meta from '@assets/brands/meta.png';
import microsoft from '@assets/brands/microsoft.png';
import noun from '@assets/brands/noun.png';
import nuc from '@assets/brands/nuc.png';
import styles from './Partnership.module.scss';

const partners = [
  {
    logo: digitalBridge,
    alt: 'Company logo for digital bridge'
  },
  {
    logo: microsoft,
    alt: 'Company logo for microsoft'
  },
  {
    logo: meta,
    alt: 'Company logo for meta'
  },
  {
    logo: cornField,
    alt: 'Company logo for corn field'
  },
  {
    logo: nuc,
    alt: 'Company logo for national university commission'
  },
  {
    logo: noun,
    alt: 'Company logo for national open university'
  },
  {
    logo: first_bank,
    alt: 'Company logo for first bank'
  },
  {
    logo: commonWealth,
    alt: 'Company logo for common wealth'
  },
  {
    logo: uba,
    alt: 'Company logo for united bank for africa'
  },
  {
    logo: mainOne,
    alt: 'Company logo for united bank for main one'
  },
  {
    logo: eco_bank,
    alt: 'Company logo for eco bank'
  }
];

export const Partnership = () => (
  <div className="text-center mb-5">
    <div className={styles.title}>Partnerships</div>
    <div className={styles.subtitle}>
      Companies and Institutions that are currently in partnership with our school and projects
    </div>
    <div className={styles.partners}>
      <div className={styles.partner}>
        {partners.map(({ logo, alt }) => (
          <img src={logo} alt={alt} key={alt} className={styles.partnersImage} />
        ))}
      </div>
      <div className={styles.partner}>
        {partners.map(({ logo, alt }) => (
          <img src={logo} alt={alt} key={alt} className={styles.partnersImage} />
        ))}
      </div>
    </div>
  </div>
);
