import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { SuccessResponse } from '@customTypes/general';
import { StaffProfile } from '@customTypes/user';
import { paths } from '@routes/paths';
import useAuthStore from '@store/authStore';
import styles from './Profile.module.scss';

const StaffProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuthStore();

  // Fetch current user
  const { data, isLoading } = useSWR(`${endpoints.staffs}/${userId}`, async (link: string) => {
    const response = await apiClient.get<SuccessResponse<StaffProfile>>(link);
    return response.data.data;
  });

  // Loading State
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Handle data being unavailable
  if (!data) {
    return <div>Profile not found</div>;
  }
  const {
    firstName,
    lastName,
    middleName,
    description,
    quote,
    contributions,
    location,
    portfolio,
    email,
    department,
    qualification,
    certifications,
    profilePicture
  } = data;
  return (
    <div className={styles.profileWrapper}>
      {user?.userId === userId && (
        <Link to={`${paths.editStaffProfile}/${userId}`} className={styles.Link}>
          Update Info
        </Link>
      )}

      <div className={styles.left}>
        <div className={styles.profilePiceZone}>
          <div className={styles.imgContainer}>
            <img src={profilePicture || '/avater.png'} alt="profile" />
          </div>
          <span className={styles.name}>
            {' '}
            {firstName} {middleName} {lastName}
          </span>
          <span className={styles.portfolio}>{portfolio || 'Yet to provide'}</span>
        </div>
        <div className={styles.quote}>
          <span>
            <FaQuoteLeft className={styles.quoticon} />
          </span>
          {quote || 'Add a beautiful quote here'}
        </div>

        <div className={styles.otherInfo}>
          <div className={styles.InnerDetails}>
            <p className={styles.InnerKey}>Department:</p>
            <p className={styles.InnerValue}>{department || 'Yet to provide'}</p>
          </div>
          <div className={styles.InnerDetails}>
            <p className={styles.InnerKey}>Email:</p>
            <p className={styles.InnerValue}>{email}</p>
          </div>
          <div className={styles.InnerDetails}>
            <p className={styles.InnerKey}>Location:</p>
            <p className={styles.InnerValue}>{location || 'Yet to Provide'}</p>
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
            {description || 'Yet to provide bio information'}
          </div>
          <div className={styles.bottom}>
            <div className={styles.title}>Professional Background</div>
            {qualification || 'Yet to provide educational qualifications'}
          </div>
        </div>

        <div className={styles.Segment}>
          <div className={styles.top}>
            <div className={styles.title}>Professional Development</div>
            {certifications || 'Yet to provide Certification information'}
          </div>
          <div className={styles.bottom}>
            <div className={styles.title}>Curriculum Contributions</div>
            {contributions || 'Yet to provide details about contribution to curriculum development'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfilePage;
