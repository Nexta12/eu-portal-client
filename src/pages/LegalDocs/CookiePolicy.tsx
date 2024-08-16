import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@components/Layout';
import { Paragraph, Title } from '@components/Typography';

const CookiePolicy = () => (
  <PageLayout siteTitle="Cookie Policy">
    <h1>Cookie Policy</h1>
    <Title>Why we Use Cookie</Title>
    <Paragraph>
      At eUniversity Africa we use cookie to enhance your browsing experience and provide
      personalized services. This Cookie Usage Policy explains how we use cookies on our website and
      the information we collect through them. By continuing to use our website{' '}
      <Link to="http://www.euniversityedu.africa/" target="_blank">
        www.euniversityedu.africa
      </Link>{' '}
      you consent to the use of cookies as described in this policy. Cookies are small text files
      that are stored on your device (computer, tablet, or mobile) when you visit a website. They
      are widely used to improve website functionality, remember user preferences, and analyze
      website performance
    </Paragraph>
    <Title>Types of Cookies We Use</Title>
    <Paragraph>
      <ul>
        <li>
          <b>Essential Cookies:</b> These cookies are necessary for the functioning of our website
          and enable you to navigate our site and use its features.
        </li>
        <li>
          <b>Analytical Cookies:</b> We use analytical cookies to gather information about how
          visitors use our website. This data helps us understand website traffic, identify popular
          pages, and improve our website&apos;s performance.
        </li>
        <li>
          <b>Functional Cookies:</b> Functional cookies enable our website to remember your
          preferences, such as language settings and login information, to provide a more
          personalized experience.
        </li>
        <li>
          <b>Marketing Cookies:</b> Marketing cookies are used to deliver relevant advertisements
          and track the effectiveness of our marketing campaigns.
        </li>
        <li>
          <b>Third-Party Cookies:</b> Some of our web pages may contain third-party cookies, which
          are placed by third-party service providers. These cookies allow them to collect and track
          data for their services and purposes. We do not have control over these cookies, and their
          usage is subject to their respective privacy policies.
        </li>
        <li>
          <b>Cookie Consent and Management:</b> Upon visiting our website, you will be presented
          with a cookie banner requesting your consent to the use of cookies. You have the option to
          accept or decline cookies, except for essential cookies, which are necessary for the
          website&apos;s basic functionality. You can manage your cookie preferences through your
          browser settings or by using the cookie management tool available on our website.
        </li>
        <li>
          <b>Retention of Cookie Data:</b> The data collected through cookies is retained for a
          specified period, depending on the type of cookie. Some cookies are session-based and will
          be deleted once you close your browser, while others may have longer retention periods.
        </li>
        <li>
          <b>Security and Privacy:</b> We prioritize the security and privacy of your data. The
          information collected through cookies is used in accordance with our Privacy Policy. We do
          not store any personal information in cookies that could identify you without your
          explicit consent.
        </li>
        <li>
          <b>Changes to the Cookie Usage Policy:</b> We may update this Cookie Usage Policy from
          time to time to align with changes in our practices or legal requirements. The updated
          policy will be posted on our website, and the &quot;Effective Date&quot; at the top will
          reflect the changes.
        </li>
        <li>
          <b>Contact Information:</b> If you have any questions or concerns about our use of cookies
          or this Cookie Usage Policy, please use the contact us session on our website;{' '}
          <Link to="http://www.euniversityedu.africa/" target="_blank">
            www.euniversityedu.africa
          </Link>{' '}
          Your continued interaction and engagement with our website, indicate that you acknowledge
          that you have read and understood this Cookie Usage Policy and agree to the use of cookies
          as described herein.
        </li>
      </ul>
    </Paragraph>
  </PageLayout>
);
export default CookiePolicy;
