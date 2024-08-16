import React from 'react';
import { PageLayout } from '@components/Layout';
import { Paragraph, Title } from '@components/Typography';
import { formatUSDollar } from '@utils/currencyFormatter';

const AdmissionRequirement = () => (
  <PageLayout siteTitle="Admission Requirement">
    <h1>Admission Requirements and Guidelines</h1>
    <Paragraph>
      As an e-university, applications to all our programmes and courses are made online using the
      eUA web-based application system Click ‘Apply Now’ at the end of this section. eUA has three
      cohorts of programme of study: certificate, diploma and degree. You may apply for admission
      into any programme under any cohort that interests you for which you are qualified to study.
      To complete the application form, you will have to pay the application fee, have it
      acknowledged and then be directed to proceed to completing the form. While you may apply at
      any time of the year for a programme which interests you, please note that there are deadlines
      for specific programmes. You are therefore encouraged to apply early. Should you have any
      questions, concerns or issue about the application process, please contact us via email
      (admission@euniversityedu.africa) or the university’s toll free telephone number (800 000000)
      or via chat. You might be emailed a link and asked to complete additional questionnaires. You
      must check both the inbox and ‘spam’/’junk’ folder of the email account you gave in during
      your eUA application, through which you may be contacted by the University at various stages
      of your application. The non-refundable application fee, which must precede the completion of
      the form, is USD Twenty dollars ({formatUSDollar.format(20)}) only. Please note that eUA does
      not accept cash at any of its offices for any transaction whatsoever.
    </Paragraph>
    <Title>Admission Requirements</Title>
    <Paragraph>
      The eUniversity Africa recognises the London GCE, &apos;A&apos; and &sbquo;O&sbquo; level
      qualifications, GCSE or their equivalents; International Baccalaureate (25 points (excluding
      EE and TOK points) including a HL 3 in a Science or Maths AND 3 subjects taken at Standard
      Level (SL), any final secondary/high school examination deemed equivalent to GCSE/SSCE/NECO/
      by the Kenya National Examinations Council or any internationally recognised examination body
    </Paragraph>
    <Title>
      General Admission Requirements (Using the West African examination results as a guide):
    </Title>
    <Paragraph>
      <h3>
        <b>Certificate Programmes</b>
      </h3>
      <ol>
        <li>
          At least Two SSCE/GCE/NABTEB credit passes in two subjects relevant to the programme at
          not more than two sittings. The subjects must include English language, Mathematics and
          any other subject related to your course of study.
        </li>
        <li>
          With the completion of a one-year, 35 credit units certificate programme, a learner can
          use his/her certificate to gain admission into a related diploma programme or used to
          support a larger number of SSCE/GCE/NABTEB credit passes to gain admission to a degree
          programme at eUA or elsewhere. A certificate in a eUA programme may also be used to gain
          admission into a polytechnic or college of education for an ND/NCE programme provided the
          learner has three credit passes in relevant subjects obtained at the at the
          SSCE/GCE/NABTEB or equivalent examinations.
        </li>
      </ol>
    </Paragraph>
    <Paragraph>
      <h3>
        <b>Diploma Programmes</b>
      </h3>
      <ol>
        <li>
          At least Three SSCE/GCE/NABTEB credit passes in three subjects relevant to the programme
          at not more than two sittings. The subjects must include English language, Mathematics and
          any other subject related to your programme of study.
        </li>
        <li>
          With the completion of a two-year 65 credit units, a learner can use his/her Diploma to
          gain admission into a related degree programme at eUA or elsewhere.
        </li>
        <li>
          Diploma in an NBTE accredited university, one can use his/her certificate to gain
          admission into a polytechnic for an ND program provided he/she has four credit passes in
          relevant subjects obtained at the Pre-ND examination.
        </li>
      </ol>
    </Paragraph>
    <Paragraph>
      <h3>
        <b>Degree Programmes</b>
      </h3>
      <ol>
        <li>
          Minimum qualification for the First Degree Programme: 5 credits at the GCE/SSCE/NECO
          Examinations or their equivalent (at not more than 2 sittings); There is no age barrier to
          applying for admission at eUA.
        </li>
        <li>
          Candidates applying for Transfer Admissions/Credits need to present Transcript and
          Attestation Letter from the previous University or higher institution indicating the
          subjects studied and credits earned
        </li>
        <li>
          100 level or 3-year Direct Entry: GCE Advanced level or Higher School Certificate, OND,
          HND, NCE or Bachelor degree in any related course from any accredited College of
          Education, Polytechnic or University with third class division and above. Candidates must
          present their transcripts and O’ level results- as stated in the O’ level requirements
          above. A minimum of Grade C+ at the Kenya Certificate of Secondary Examination (KCSE) or
          equivalent.
        </li>
      </ol>
    </Paragraph>
    <Paragraph>
      <h3>
        <b>List of required documents to support the application</b>
      </h3>
      <ol>
        <li>Completed application form.</li>
        <li>Proof of payment of the application fee.</li>
        <li>Secondary/high school certificate transcript of records.</li>
        <li>Other relevant academic certificates related to your proposed.</li>
      </ol>
      <ul>
        <b>Programme of study</b>
        <li>1 passport-sized photo(s)</li>
        <li>Copy of valid passport, current driver&apos;s License, and/or personal ID.</li>
        <li>Provide a Sworn translation of documents if they are not in English or</li>
      </ul>
      <ul>
        <b>Afrikaans</b>
        <li>A copy of your Marriage Certificate or divorce decree, if applicable</li>
      </ul>
    </Paragraph>
  </PageLayout>
);

export default AdmissionRequirement;
