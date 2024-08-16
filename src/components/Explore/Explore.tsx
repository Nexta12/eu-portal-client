import React from 'react';
import explore1 from '@assets/images/explore3.jpg';
import styles from './Explore.module.scss';

export const Explore = () => (
  <div className={styles.container}>
    <div className={styles.exploreContainer}>
      <div className={styles.exploreText}>
        <div>We are eUniversity Africa!</div>
        <div className="text-justify">
          eUniversity Africa (eUA) is a unique 21st-century eLearning institution that functions
          entirely on a digital platform, providing multimodal and multidimensional learning
          pathways to learners from diverse educational backgrounds. eUA aims at being locally and
          continentally relevant as well as globally responsive to the emerging needs of
          individuals, communities, organisations, and industry. It integrates academic knowledge
          with industrial skills and experience to produce graduates who meet all employability
          indices. As a result, hands-on industry-based externships are embedded in all our
          programmes, catering to the variations among learners by establishing a conducive
          ecosystem for lifelong competency-based and skills development (through industry-eUA
          partnership from day one of a learner&apos;s registration in his/her chosen programme of
          study), with a particular emphasis on entrepreneurship, as appropriate to the needs of
          employers and learners on graduation. Our assessment and certification of learning
          outcomes employ a portfolio comprising digital badges and a blockchain credentialing
          system. We advocate for borderless education, ensuring that learners can become
          autonomous, self-directed individuals without facing logistical constraints related to
          space, time, location, gender, age, finance, or other physical resources. Join us in the
          crusade to make education tremendously relevant to Africa and humanity in the digital age.
        </div>
      </div>
      <div className={styles.imgDiv}>
        <img src={explore1} alt="explore" />
      </div>
    </div>
  </div>
);
