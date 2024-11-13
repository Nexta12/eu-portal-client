import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import styles from './Profile.module.scss';

const StaffProfile = () => {
  const user = 'Emeka Odigbo';
  return (
    <div className={styles.profileWrapper}>
      <div className={styles.left}>
        <div className={styles.profilePiceZone}>
          <div className={styles.imgContainer}>
            <img src="/avater.png" alt="profile" />
          </div>
          <span className={styles.name}>{user}</span>
          <span className={styles.portfolio}>Senior Auditor General</span>
        </div>
        <div className={styles.quote}>
          <span>
            <FaQuoteLeft className={styles.quoticon} />
          </span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse aut vitae, labore ex quia
          maxime debitis officiis quas vero soluta,
        </div>

        <div className={styles.otherInfo}>
          <div className={styles.InnerDetails}>
            <p className={styles.InnerKey}>Department:</p>
            <p className={styles.InnerValue}>Bursar</p>
          </div>
          <div className={styles.InnerDetails}>
            <p className={styles.InnerKey}>Email:</p>
            <p className={styles.InnerValue}>johndoe@gmail.com</p>
          </div>
          <div className={styles.InnerDetails}>
            <p className={styles.InnerKey}>Location:</p>
            <p className={styles.InnerValue}>Lagos</p>
          </div>

          <div className={styles.valuesBotton}>
            <button>Organized</button>
            <button>Analytical</button>
            <button>Lovely</button>
            <button>Networking</button>
            <button>Sporty</button>
            <button>Easy Going</button>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.Segment}>
          <div className={styles.top}>
            <div className={styles.title}>Bio</div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, blanditiis necessitatibus
            nesciunt at magni expedita labore, explicabo, voluptate modi non ipsam alias obcaecati?
            Illo quas, unde numquam iste autem impedit.
          </div>
          <div className={styles.bottom}>
            <div className={styles.title}>Professional Background</div>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non quis corporis
            reprehenderit molestias quisquam quos in obcaecati autem natus sunt quo voluptas unde
            nisi vitae quasi, magnam eaque enim cum!
          </div>
        </div>

        <div className={styles.Segment}>
          <div className={styles.top}>
            <div className={styles.title}>Professional Development</div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem delectus error
            cumque debitis eos ab ratione, repellat consequuntur quibusdam ullam numquam consequatur
            impedit distinctio dignissimos. Officiis cumque provident praesentium ipsa.
          </div>
          <div className={styles.bottom}>
            <div className={styles.title}>Curriculum Contributions</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ducimus veniam
            consectetur totam modi sapiente maxime asperiores recusandae commodi fugit, doloribus,
            tempora consequatur quas iure odio inventore dicta nemo? Dicta.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
