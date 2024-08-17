import React from 'react';
import { Button } from 'antd';
import { FormWrapper, InputField, TextAreaField } from '@components/Form';
import { PageLayout } from '@components/Layout';
import styles from './ContactUs.module.scss';

const ContactUs = () => (
  <PageLayout siteTitle="Contact Us">
    <h1>Contact Us</h1>
    <div className="lh-md">
      Fill the form below and our dedicated team will get in touch with you as quickly as possible.
    </div>
    <FormWrapper className="mt-3">
      <div className={styles.grid}>
        <InputField placeholder="First Name" label="First Name" />
        <InputField placeholder="Last Name" label="Last Name" />
      </div>
      <InputField placeholder="Email" label="Email" />
      <TextAreaField label="Enquiry" placeholder="Enquiry" />
      <Button type="primary" size="large" className={styles.actionButton}>
        Send
      </Button>
    </FormWrapper>
  </PageLayout>
);

export default ContactUs;
