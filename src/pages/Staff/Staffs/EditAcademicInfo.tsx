import React, { ChangeEvent } from 'react';
import { TextAreaField } from '@components/Form';
import { StaffProfile } from '@customTypes/user';
import styles from './Profile.module.scss';

type EditAcademicInfo = Pick<
  StaffProfile,
  'description' | 'qualification' | 'certifications' | 'contributions'
>;

interface EditAcademicInfoProps extends EditAcademicInfo {
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EditAcedmic: React.FC<EditAcademicInfoProps> = ({
  description,
  qualification,
  certifications,
  contributions,
  onChange
}) => (
  <>
    <div className={styles.twoRowGrid}>
      <TextAreaField
        placeholder="Write something..."
        label="Biodata/Description"
        name="description"
        value={description}
        onChange={onChange}
      />
      <TextAreaField
        placeholder="Write something..."
        label="Qualification"
        name="qualification"
        value={qualification}
        onChange={onChange}
      />
    </div>
    <div className={styles.twoRowGrid}>
      <TextAreaField
        placeholder="Write something..."
        label="Certifications"
        name="certifications"
        value={certifications}
        onChange={onChange}
      />
      <TextAreaField
        placeholder="Write something..."
        name="contributions"
        label="Curriculum Contribution"
        value={contributions}
        onChange={onChange}
      />
    </div>
  </>
);

export default EditAcedmic;
