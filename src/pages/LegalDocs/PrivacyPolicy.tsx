import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@components/Layout';
import { Paragraph, Title } from '@components/Typography';
import { paths } from '@routes/paths';

const PrivacyPolicy = () => (
  <PageLayout siteTitle="Privacy Policy">
    <h1>Privacy Policy</h1>
    <Paragraph>
      This Privacy Policy explains the data privacy practices of eUniversity Africa (“eUniversity
      Africa”, &quot;we”, “us”, or “our”) in connection with your use of{' '}
      <Link to="http://www.euniversityedu.africa/" target="_blank">
        www.euniversityedu.africa
      </Link>{' '}
      or any other website that refers to this policy (“Websites”) and other eUniversity Africa
      services (the Websites and the services, “Services”).
    </Paragraph>
    <Paragraph>
      We offer a range of Services, encompassing websites, applications, programs, and online or
      mobile products provided by eUniversity Africa, including the eUniversity Africa Community.
      Your usage of these Services is governed by the eUniversity Africa Terms of Use, and certain
      Services may be subject to additional terms.
    </Paragraph>
    <Title bold>Disclosure of regional privacy policy</Title>
    <Paragraph>
      If you are located in certain specific regions which have enacted a personal data protection
      law, please review our{' '}
      <Link to={paths.termsOfUse} target="_blank">
        Terms of Use
      </Link>{' '}
      that may apply to you.
    </Paragraph>
    <Title>Information We may collect</Title>
    <Paragraph>
      When you create a user account, download an application, take part in our online programs, or
      engage in any communication with eUniversity Africa, we gather information, which may include
      personal data. Personal data refers to any information that can identify you. The types of
      personal data we collect encompass:
      <ul>
        <li>Contact Information: This includes your full name, phone number, and email address.</li>
        <li>Account Information: Your username and password used for account access.</li>
        <li>
          Educational Information: Details such as your student identification number, enrolled
          courses, course progress, and grades.
        </li>
        <li>Transactional Information: Bank and payment details when making transactions.</li>
        <li>Feedback Information: Surveys, inquiries, and any other feedback you provide to us.</li>
        <li>
          Online and Electronic Information: Data like browser ID, browser type, device ID, device
          type, operating system, network carrier or data providers, and IP address.
        </li>
        <li>
          Usage Data: Information obtained through cookies, content views or posts, visit frequency,
          other website browsing details, and preferences.
        </li>
        <li>
          Posted Data: Your interactions such as likes, comments, and other engagements with our
          social media pages, public forums, community pages, blogs, podcasts, and streaming
          channels.
        </li>
        <li>Location Information: Non-specific location data.</li>
        <li>
          Mobile Information: The date, time, and content of text messages you send to us, and any
          other mobile information you or your wireless carrier provide.
        </li>
        <li>
          Other Personal Data: Optional information like gender that you might provide in connection
          with our services.
        </li>
      </ul>
    </Paragraph>
    <Title>How we use your information</Title>
    <Paragraph>
      We may use your data:
      <ul>
        <li>
          We utilize your information to deliver, develop, analyse, support, secure, and enhance our
          Websites and Services.
        </li>
        <li>
          We may send you notices, updates, announcements, communications, and marketing and
          promotional content (via email, phone, pop-up notifications, SMS text, or similar methods)
          regarding the Services you have ordered or other Services that might interest you.
        </li>
        <li>
          Your identity is authenticated, and we process payments, subscriptions, credits, and
          refunds as necessary.
        </li>
        <li>Research activities, including academic research, are conducted.</li>
        <li>
          We assess admissions criteria and analyse individual and aggregate progress, performance,
          and completion of the Services.
        </li>
        <li>
          Any purpose for which you have provided consent at the time of data collection or at a
          later point is fulfilled.
        </li>
        <li>
          We may establish, exercise, or defend our legal rights, for instance, in relation to
          threatened or pending litigation or claims, or to enforce our contractual or other rights.
        </li>
        <li>
          Your personal data may be aggregated and/or de-identified, making the information no
          longer linked to you or your device. This aggregated and/or de- identified data may be
          used for various purposes, including research and marketing, and may be shared with third
          parties, including advertisers, promotional partners, and sponsors.
        </li>
        <li>
          We aim to fulfil any purpose mentioned elsewhere in this Policy, respond to inquiries, and
          adhere to our legal obligations.
        </li>
      </ul>
    </Paragraph>
    <Title>Data sharing and disclosure</Title>
    <Paragraph>
      Information posted or contributed by you to any part of a Service designed to be visible to
      the public or to other eUniversity Africa participants may be viewed and downloaded by others
      who use or access the Service. Please bear this in mind when you post such comments or other
      information.
      <div className="mt-1">
        Under various circumstances, we may share information as outlined below:
        <ul>
          <li>
            To facilitate and conduct the Services, we may share submissions, such as posted data
            mentioned earlier, with other participants in an eUniversity Africa program or other
            Services in which you are involved.
          </li>
          <li>
            Directory Information may be disclosed or provided to third parties or the public,
            unless you have opted out of such disclosure as described in this Notice.
          </li>
          <li>
            Information may be shared with a collaborating college or university associated with
            you, concerning your eUniversity Africa application and participation in the Services.
          </li>
          <li>
            Information provided by you or collected about you via the Services may be shared within
            eUniversity Africa to facilitate the provision of the Services.
          </li>
          <li>
            If your employer sponsors your participation in a Service and you have given consent or
            we are otherwise permitted to do so, we may report your progress and participation to
            your employer.
          </li>
          <li>
            To enable marketing and advertising activities, including interest-based advertising,
            eUniversity Africa may share information directly or through third parties.
          </li>
          <li>
            Aggregated, anonymized, or de-identified information may be shared with the public and
            third parties, including researchers and business partners.
          </li>
          <li>
            We may engage service providers or contractors to perform specific functions on our
            behalf, such as analytics, information processing, transaction processing, website
            operation, security, or administration.
          </li>
          <li>Sharing of information will be done in accordance with your consent.</li>
          <li>
            We may share your information to comply with applicable laws, regulations, legal
            processes, or governmental requests; investigate compliance with or enforce our Terms of
            Use and this Policy; detect, prevent, or address fraud, security, or technical issues;
            or protect, defend, or enforce the operations, property, rights, and safety of users,
            eUniversity Africa, eUniversity Africa affiliates, or others.
          </li>
        </ul>
      </div>
    </Paragraph>
    <Title>Your Privacy Choices</Title>
    <Paragraph>
      Choosing certain rights regarding your personal information, including the right to access,
      correct, update, or delete your data. If you wish to exercise any of these rights or have any
      privacy-related questions, please contact us using the contact information provided on our
      website.
    </Paragraph>
    <Title>Third-party or external links</Title>
    <Paragraph>
      Our Services may include links to websites or applications operated by third parties,
      including content providers and certain service providers, such as payment processors. Please
      note that these external websites and applications are beyond our control, and you acknowledge
      and agree that we are not accountable for the collection and utilization of your information
      by such third-party websites and applications. This Privacy Policy does not apply to those
      third-party websites and applications. We advise you to exercise caution and review the
      privacy policies and terms of use of each website and application you visit or utilize when
      redirected to a third-party platform.
    </Paragraph>
    <Title>Data security</Title>
    <Paragraph>
      eUniversity Africa has established a program to protect personal data in its possession. This
      program includes privacy and security policies, as well as administrative, physical, and
      technical measures. However, no method of data collection, storage, or transmission can be
      completely secure, and we cannot guarantee the absolute effectiveness of our security
      measures. It&#39;s important to remember that the safety of your information also depends on
      you. If you have a password for accessing certain parts of our Website or Services, please
      ensure to keep it confidential and avoid sharing it with others.
    </Paragraph>
    <Title>Retention of your information</Title>
    <Paragraph>
      The duration for which we retain information relies on the reasons for its collection and
      usage, as well as compliance with relevant laws, the quantity, nature, and sensitivity of the
      data, the potential risk of harm from unauthorized access or disclosure, the resolution of any
      pending or potential disputes, and the enforcement of our agreements.
    </Paragraph>
    <Title>Collection of data from children</Title>
    <Paragraph>
      If we become aware that we have processed the personal data of an individual under 13 years of
      age, we will promptly delete such information from our records. Ensuring the protection and
      privacy of young users is of utmost importance to us.
    </Paragraph>
    <Title>Changing our Privacy Policy</Title>
    <Paragraph>
      We may make changes to this Policy at any time. By registering for, accessing, or using the
      Website or any of the Services following any modifications, you indicate your acceptance of
      the updated Notice and all the alterations, which will take effect immediately unless we
      inform you of a later effective date. If you find the changes unacceptable, kindly refrain
      from further use of the Website and/or Services.
    </Paragraph>
    <Title>Contact us</Title>
    <Paragraph>
      Please submit any questions about this Privacy Policy or how we/or our affiliate treat
      sensitive information or your personal data, reach eUniversity through our{' '}
      <Link to={paths.contactUs} target="_blank">
        Contact us
      </Link>{' '}
      session on our website.
    </Paragraph>
  </PageLayout>
);

export default PrivacyPolicy;
