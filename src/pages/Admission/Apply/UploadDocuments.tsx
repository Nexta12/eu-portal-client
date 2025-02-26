/* eslint-disable @typescript-eslint/no-explicit-any, default-case */
import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Alert, Button, Upload, UploadProps, message } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import Requirements from '@components/DocsRequirements/Requirements';
import { DashboardContentLayout } from '@components/Layout';
import { CustomModal } from '@components/Modal';
import { SuccessResponse } from '@customTypes/general';
import { AdmissionStatus, StudentDocument } from '@customTypes/user';
import authStore from '@store/authStore';
import { dummyRequirements } from '@utils/data/dummyDocuments';
import { extractNameFromFileUrl } from '@utils/helpers';
import { getLocalStorageItem } from '@utils/localStorage';
import { UploadChangeParam } from 'antd/es/upload';

const { Dragger } = Upload;
const token = getLocalStorageItem('token');

const UploadDocuments = () => {
  const [pictureList, setPictureList] = useState<any[]>([]);
  const [docsList, setDocsList] = useState<any[]>([]);
  const { user, updateUser } = authStore();
  const { data, error: docsError } = useSWR('getStudentDocument', async () => {
    const response = await apiClient.get<SuccessResponse<StudentDocument>>(
      `/students/${user?.userId}/documents`
    );
    return response.data;
  });
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  useEffect(() => {
    if (data?.data?.picture) {
      setPictureList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: data?.data?.picture
        }
      ]);
    }

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

  const handleChangeUpload = async (info: UploadChangeParam, type: 'file' | 'picture') => {
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
          if (type === 'picture') {
            const pictureUrl =
              info.file.uid === '-1' ? info.file.url : info.file.response.data.pictureUrl;
            await apiClient.put('/students/remove-picture', {
              pictureUrl
            });
          } else {
            const fileUrl =
              Number(info.file.uid) < 0 ? info.file.url : info.file.response.data.fileUrl;
            await apiClient.put('/students/remove-file', {
              fileUrl
            });
          }
          message.success(`${info.file.name} file removed.`);
          window.location.reload();
          break;
        }
      }

      if (type === 'file') {
        setDocsList(info.fileList as any[]);
      } else {
        setPictureList(info.fileList as any[]);
      }
    } catch {
      message.error('Something went wrong');
    }
  };

  const uploadPictureProps: UploadProps = {
    action: `${process.env.REACT_APP_API_BASE_URL}${endpoints.uploadPicture}`,
    method: 'POST',
    accept: '.jpg, .jpeg, .png',
    maxCount: 1,
    name: 'picture',
    headers: {
      authorization: `Bearer ${token}`
    },
    listType: 'picture-circle',
    showUploadList: {
      showRemoveIcon: true,
      showPreviewIcon: true
    },
    onChange: (info) => handleChangeUpload(info, 'picture'),
    fileList: pictureList as any
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

  const handleSubmitApplication = async () => {
    try {
      await apiClient.put(endpoints.submitApplication);
      setOpenConfirmationModal(false);
      updateUser({ admissionStatus: AdmissionStatus.IN_REVIEW });
    } catch {
      message.error('Something went wrong');
    }
  };

  return (
    <DashboardContentLayout title="Upload your Documents">
      {docsError && (
        <Alert message="Something went wrong while fetching data" type="error" showIcon />
      )}
      <div className="d-flex flex-direction-column gap-2">
        <Upload {...uploadPictureProps}>
          <div>
            <AiOutlinePlus />
            <div style={{ marginTop: 4, fontSize: '10px' }} title="Required">
              Upload Profile Picture <span style={{ color: 'red', fontSize: '20px' }}>*</span>
            </div>
          </div>
        </Upload>

        <Alert
          message="Please Note"
          description="Name the uploaded document properly. For example, if you are uploading your birth certificate, name the file as 'Birth Certificate'"
          type="info"
          showIcon
        />
        <Dragger {...uploadDocsProps}>
          <Button size="large" type="primary" className="mt-2 align-self-center">
            Click Here to Upload Documents
          </Button>
        </Dragger>
        <Requirements requirements={dummyRequirements} />
        <Button
          size="large"
          type="primary"
          className="mt-2 align-self-center"
          disabled={docsList.length === 0 || pictureList.length === 0}
          onClick={() => setOpenConfirmationModal(true)}
        >
          Submit Application
        </Button>
      </div>
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={handleSubmitApplication}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>
          <div>
            Please note that you will not be able to edit your application after submitting. Are you
            sure you uploaded all required documents?
          </div>
          <div className="font-weight-bolder mt-1">
            Note: You documents are saved automatically. You can come back and change them later.
          </div>
        </div>
      </CustomModal>
    </DashboardContentLayout>
  );
};
export default UploadDocuments;
