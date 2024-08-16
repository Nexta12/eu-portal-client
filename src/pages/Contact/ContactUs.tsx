import React from 'react';
import { Button } from 'antd';
import { FormWrapper, InputField, TextAreaField } from '@components/Form';
import { PageLayout } from '@components/Layout';
import styles from './ContactUs.module.scss';

const ContactUs = () => (
  <PageLayout siteTitle="Contact Us">
    <h1>Contact Us</h1>
    <div className="lh-md">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam aliquid aperiam
      assumenda aut cupiditate dolor eos ex id maiores minus molestias odio, optio quas quo tempora
      voluptate. Id, repudiandae?
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
