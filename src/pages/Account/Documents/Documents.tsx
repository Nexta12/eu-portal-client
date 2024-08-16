import React from 'react';
import { BsFillFileEarmarkPlusFill } from 'react-icons/bs';
import { Button, Col, Descriptions, Row, Upload, message } from 'antd';
import { Requirements } from '@components/DocsRequirements';
import { DashboardContentLayout } from '@components/Layout';
import FileUploaded from '@pages/Account/Documents/FileUploaded';
import { dummyRequirements } from '@utils/data/dummyDocuments';
import type { UploadProps } from 'antd/lib/upload';
import styles from './Documents.module.scss';

const props: UploadProps = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text'
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      message.loading(`${info.file.name} file is uploading`);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

const Documents = () => (
  <DashboardContentLayout title="Documents">
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <div className="pb-1">
          Please provide all the required documents to help us evaluate your Scholarship and
          Academic eligibility.
        </div>
        <Requirements requirements={dummyRequirements} />
        <div className={styles.card}>
          <Descriptions
            bordered
            title="Upload Document"
            extra={
              <Upload {...props}>
                <Button type="primary" disabled>
                  <BsFillFileEarmarkPlusFill />
                </Button>
              </Upload>
            }
          />
          <div className={styles.rules}>
            <ul className="d-flex p-2 gap-1 flex-direction-column">
              <li>Maximum uploaded file size is: 10.00MB.</li>
              <div> Allowed files types: .zip, .jpg, .jpeg, .png, .pdf, .doc, .docx</div>
            </ul>
          </div>
        </div>
      </Col>
      <FileUploaded />
    </Row>
  </DashboardContentLayout>
);

export default Documents;
