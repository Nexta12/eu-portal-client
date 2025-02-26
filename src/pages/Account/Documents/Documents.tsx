/* eslint-disable @typescript-eslint/no-explicit-any, default-case */
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Descriptions, Row, Upload, UploadProps, message } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { Requirements } from '@components/DocsRequirements';
import { DashboardContentLayout } from '@components/Layout';
import { SuccessResponse } from '@customTypes/general';
import { StudentDocument } from '@customTypes/user';
import FileUploaded from '@pages/Account/Documents/FileUploaded';
import { authStore } from '@store/index';
import { dummyRequirements } from '@utils/data/dummyDocuments';
import { extractNameFromFileUrl } from '@utils/helpers';
import { getLocalStorageItem } from '@utils/localStorage';
import { UploadChangeParam } from 'antd/es/upload';
import styles from './Documents.module.scss';

const { Dragger } = Upload;
const token = getLocalStorageItem('token');

const Documents = () => {
  const [docsList, setDocsList] = useState<any[]>([]);
  const { user } = authStore();
  const { data, error: docsError } = useSWR('getStudentDocument', async () => {
    const response = await apiClient.get<SuccessResponse<StudentDocument>>(
      `/students/${user?.userId}/documents`
    );
    return response.data;
  });

  useEffect(() => {
    if (docsList.length === 0) {
      const studentDocs = data?.data?.docs || [];
      const docs = studentDocs.map((doc, index) => ({
        uid: String(-(index + 1)),
        name: extractNameFromFileUrl(doc.url),
        status: 'done',
        url: doc.url
      }));
      setDocsList(docs);
    }
  }, [data?.data?.docs, data?.data?.picture, docsList.length]);

  const handleChangeUpload = async (info: UploadChangeParam, type: 'file') => {
    try {
      switch (info.file.status) {
        case 'done': {
          message.success(`${info.file.name} file uploaded successfully.`);
          window.location.reload();
          break;
        }
        case 'error': {
          message.error(`${info.file.name} file upload failed.`);
          break;
        }
        case 'removed': {
          const fileUrl =
            Number(info.file.uid) < 0 ? info.file.url : info.file.response.data.fileUrl;
          await apiClient.put('/students/remove-file', {
            fileUrl
          });
          message.success(`${info.file.name} file removed.`);
          window.location.reload();
          break;
        }
      }

      if (type === 'file') {
        setDocsList(info.fileList as any[]);
      }
    } catch {
      message.error('Something went wrong');
    }
  };

  const uploadDocsProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: `${process.env.REACT_APP_API_BASE_URL}${endpoints.uploadFile}`,
    method: 'POST',
    accept: '.jpg, .jpeg, .png, .pdf',
    headers: {
      authorization: `Bearer ${token}`
    },
    onChange: (info) => handleChangeUpload(info, 'file'),
    fileList: docsList as any
  };

  return (
    <DashboardContentLayout title="Documents">
      {docsError && (
        <Alert message="Something went wrong while fetching data" type="error" showIcon />
      )}
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
                <Dragger {...uploadDocsProps}>
                  <Button size="large" type="primary" className="mt-2 align-self-center">
                    Upload More Documents
                  </Button>
                </Dragger>
              }
            />
            <div className={styles.rules}>
              <ul className="d-flex p-2 gap-1 flex-direction-column">
                <li>Maximum uploaded file size is: 10.00MB.</li>
                <div> Allowed files types: .zip, .jpg, .jpeg, .png, .pdf</div>
              </ul>
            </div>
          </div>
        </Col>
        <FileUploaded />
      </Row>
    </DashboardContentLayout>
  );
};

export default Documents;
