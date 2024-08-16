import React, { useEffect, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Dropdown, MenuProps, Space } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { CustomModal } from '@components/Modal';
import { AntTable } from '@components/Table';
import { AntTag } from '@components/Tag';
import { Academics, Course, Programme, SemesterCourse } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import { Cohort } from '@customTypes/user';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { DOLLAR_TO_NAIRA } from '@utils/constants';
import { formatNaira, formatUSDollar } from '@utils/currencyFormatter';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { capitalize } from '@utils/letterFormatter';

const Column = [
  {
    title: 'S/NO',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Course Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Course Code',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: 'Credit Unit',
    dataIndex: 'unit',
    key: 'unit'
  },
  {
    title: 'Compulsory',
    dataIndex: 'isCompulsory',
    key: 'isCompulsory'
  },
  {
    title: 'Cost (USD)',
    dataIndex: 'costUsd',
    key: 'costUsd'
  },
  {
    title: 'Cost (NGN)',
    dataIndex: 'costNgn',
    key: 'costNgn'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action'
  }
];

type ProgramDataType = Omit<Programme, 'faculty' | 'objectives' | 'entryRequirements'> & {
  courses: CourseType[];
};

type CourseType = Omit<Course, 'facilitator' | 'details'> &
  Pick<SemesterCourse, 'costUsd' | 'isCompulsory'> &
  Pick<Academics, 'level' | 'cohort' | 'semester'>;

const CourseList = () => {
  const params = useParams();
  const [selectedCohort, setSelectedCohort] = useState<string | ''>('');
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [groupedCourses, setGroupedCourses] = useState<{
    [cohort: string]: {
      [level: string]: {
        [semester: string]: CourseType[];
      };
    };
  }>({});

  const items: MenuProps['items'] = [
    {
      label: 'all',
      key: 'All',
      onClick: () => setSelectedCohort('')
    },
    {
      label: Cohort.DEGREE,
      key: 'Degree',
      onClick: () => setSelectedCohort(Cohort.DEGREE)
    },
    {
      label: Cohort.CERTIFICATE,
      key: 'Certificate',
      onClick: () => setSelectedCohort(Cohort.CERTIFICATE)
    },
    {
      label: Cohort.DIPLOMA,
      key: 'Diploma',
      onClick: () => setSelectedCohort(Cohort.DIPLOMA)
    },
    {
      label: Cohort.POSTGRADUATE,
      key: 'Post-Graduate',
      onClick: () => setSelectedCohort(Cohort.POSTGRADUATE)
    }
  ];
  const clickedCohort = `?cohort=${selectedCohort}`;
  const { data: allCourses, mutate } = useSWR(
    `/programmes/${params.id}/courses${selectedCohort ? clickedCohort : ''}`,
    async (link: string) => {
      const res = await apiClient.get<ProgramDataType>(link);
      return res.data;
    }
  );

  const handleCourseDeletion = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteCourse}/${id}`);
      setMessage({ error: null, success: 'Course deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (allCourses) {
      const sortedCourses: {
        [cohort: string]: {
          [level: string]: {
            [semester: string]: CourseType[];
          };
        };
      } = {};

      allCourses.courses.forEach((course: CourseType) => {
        const { level, semester, cohort } = course;

        if (!sortedCourses[cohort as string]) {
          sortedCourses[cohort as string] = {};
        }

        if (!sortedCourses[cohort as string][level]) {
          sortedCourses[cohort as string][level] = {};
        }

        if (!sortedCourses[cohort as string][level][semester]) {
          sortedCourses[cohort as string][level][semester] = [];
        }

        sortedCourses[cohort as string][level][semester].push(course);
      });

      setGroupedCourses(sortedCourses);
    }
  }, [allCourses]);

  const cohorts = Object.keys(groupedCourses);

  return (
    <DashboardContentLayout title={allCourses?.name}>
      <div className="d-flex justify-content-end mb-1">
        <Dropdown menu={{ items }} trigger={['click']} className="width-25">
          <Button onClick={(e) => e.preventDefault()}>
            <Space>
              Filter by:
              {selectedCohort}
              <RiArrowDropDownLine />
            </Space>
          </Button>
        </Dropdown>
      </div>
      {(message.success || message.error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}

      {cohorts.length === 0 ? (
        <AntTable columns={Column} dataSource={[]} />
      ) : (
        cohorts.map((cohort) => (
          <div key={cohort}>
            <h2 className="text-center font-weight-bold mb-2">{capitalize(cohort)} Courses</h2>
            {Object.keys(groupedCourses[cohort]).map((level) =>
              Object.keys(groupedCourses[cohort][level]).map((semester) => {
                const courses = groupedCourses[cohort][level][semester];

                const data = courses.map((course, index) => ({
                  sn: index + 1,
                  key: course.id,
                  name: course.name,
                  code: course.code,
                  unit: course.unit,
                  costUsd: formatUSDollar.format(course.costUsd),
                  costNgn: formatNaira.format(course.costUsd * DOLLAR_TO_NAIRA),
                  isCompulsory: course.isCompulsory ? (
                    <AntTag text="Yes" color="green" />
                  ) : (
                    <AntTag text="No" color="red" />
                  ),
                  action: (
                    <div className="d-flex align-items-center gap-1">
                      <Button onClick={() => navigate(`${paths.editCourse}/${course.id}`)}>
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteModal(true);
                          setIsDeleting(course.id);
                        }}
                      >
                        <LuTrash2 size={20} color={colorPrimary} />
                      </Button>
                    </div>
                  )
                }));

                return (
                  <div key={`${level}-${semester}`} className="mb-3">
                    <h3 className="text-center font-weight-bold mb-2">
                      {level} ({capitalize(semester)} Semester)
                    </h3>
                    <AntTable columns={Column} dataSource={data} />
                  </div>
                );
              })
            )}
          </div>
        ))
      )}

      <CustomModal
        title="Confirm"
        open={deleteModal}
        onOk={async () => {
          setDeleteModal(false);
          await handleCourseDeletion(isDeleting);
        }}
        onCancel={() => setDeleteModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete this Course?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default CourseList;
