import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { History, MissionVision, StrategicOutlook } from '@pages/AboutEua';
import { ChangePassword, Documents, Edit, Profile, Transcript } from '@pages/Account';
import {
  AdmissionRequirement,
  ApplicationProcess,
  Apply,
  CourseDetail,
  CoursesFaculties,
  Fees
} from '@pages/Admission';
import { EditNotification, NewNotification, Notifications } from '@pages/Announcement';
import { Blogs, Categories, EditBlog, EditCategory, NewBlog, NewCategory } from '@pages/Blog';
import BlogList from '@pages/Blog/BlogList';
import SingleBlog from '@pages/Blog/SingleBlog';
import { ContactUs } from '@pages/Contact';
import { CourseHistory, Enrolments, PreRegistration } from '@pages/Courses';
import { Dashboard, DashboardHome } from '@pages/Dashboard';
import { NotFound } from '@pages/Errors';
import { EditEvent, Events, NewEvent } from '@pages/Event';
import { AccountStatement, ConfirmPayment, MakePayment } from '@pages/Finance';
import { Landing, LandingPageOutlet } from '@pages/Landing';
import { CookiePolicy, PrivacyPolicy, TermOfUse } from '@pages/LegalDocs';
import LiveChat from '@pages/LiveChatPage/LiveChat';
import { ForgotPassword, Login, ResetPassword } from '@pages/Login';
import {
  AdmissionDetails,
  CourseList,
  CreateProgramme,
  EditCourse,
  EditFaculty,
  EditProgramme,
  EditStaff,
  Faculties,
  NewFaculty,
  NewStaff,
  PendingAdmissions,
  Programmes,
  ProgrammesCourses,
  Staff,
  ViewProgramme
} from '@pages/Staff';
import NewCourse from '@pages/Staff/Courses/NewCourse';
import { AdminTicketList, EditTicket, NewTicket, Tickets } from '@pages/Ticket';
import ViewTicket from '@pages/Ticket/ViewTicket';
import { paths } from '@routes/paths';
import { PrivateRoute } from './PrivateRoute';

export const AppRoutes = () => (
  <Routes>
    <Route path={paths.index} element={<LandingPageOutlet />}>
      <Route path={paths.index} element={<Landing />} />
      <Route path={paths.vision} element={<MissionVision />} />
      <Route path={paths.strategicOutlook} element={<StrategicOutlook />} />
      <Route path={paths.history} element={<History />} />
      <Route path={paths.facultiesAndCourses} element={<CoursesFaculties />} />
      <Route path={`${paths.courseDetails}/:programmeId`} element={<CourseDetail />} />
      <Route path={paths.fees} element={<Fees />} />
      <Route path={paths.admissionRequirements} element={<AdmissionRequirement />} />
      <Route path={paths.apply} element={<Apply />} />
      <Route path={paths.contactUs} element={<ContactUs />} />
      <Route path={paths.login} element={<Login />} />
      <Route path={paths.resetPassword} element={<ResetPassword />} />
      <Route path={paths.forgotPassword} element={<ForgotPassword />} />
      <Route path={paths.privacyPolicy} element={<PrivacyPolicy />} />
      <Route path={paths.cookiePolicy} element={<CookiePolicy />} />
      <Route path={paths.termsOfUse} element={<TermOfUse />} />
      <Route path={paths.blogs} element={<Blogs />} />
      <Route path={`${paths.blogs}/:slug`} element={<SingleBlog />} />
    </Route>
    <Route path={paths.dashboard} element={<PrivateRoute />}>
      <Route path={paths.dashboard} element={<Dashboard />}>
        <Route path={paths.dashboardHome} element={<DashboardHome />} />
        <Route path={paths.dashboardIndex} element={<DashboardHome />} />
        <Route path={paths.preRegistration} element={<PreRegistration />} />
        <Route path={paths.enrolments} element={<Enrolments />} />
        <Route path={paths.courseHistory} element={<CourseHistory />} />
        <Route path={paths.profile} element={<Profile />} />
        <Route path={paths.changePassword} element={<ChangePassword />} />
        <Route path={paths.documents} element={<Documents />} />
        <Route path={paths.makePayment} element={<MakePayment />} />
        <Route path={paths.accountStatement} element={<AccountStatement />} />
        <Route path={paths.applicationProcess} element={<ApplicationProcess />} />
        <Route path={paths.transcript} element={<Transcript />} />
        <Route path={paths.editProfile} element={<Edit />} />
        <Route path={paths.pendingAdmissions} element={<PendingAdmissions />} />
        <Route path={`${paths.admissionDetails}/:userId`} element={<AdmissionDetails />} />
        <Route path={paths.confirmPayment} element={<ConfirmPayment />} />
        <Route path={paths.staffs} element={<Staff />} />
        <Route path={paths.newStaff} element={<NewStaff />} />
        <Route path={`${paths.editStaff}/:userId`} element={<EditStaff />} />
        <Route path={paths.programmesAndCourses} element={<ProgrammesCourses />} />
        <Route path={paths.courses} element={<CourseList />} />
        <Route path={paths.newCourse} element={<NewCourse />} />
        <Route path={paths.faculties} element={<Faculties />} />
        <Route path={paths.newFaculty} element={<NewFaculty />} />
        <Route path={`${paths.editFaculty}/:id`} element={<EditFaculty />} />
        <Route path={paths.programmes} element={<Programmes />} />
        <Route path={`${paths.viewProgramme}/:id`} element={<ViewProgramme />} />
        <Route path={paths.createProgramme} element={<CreateProgramme />} />
        <Route path={`${paths.editProgramme}/:id`} element={<EditProgramme />} />
        <Route path={paths.programmesAndCourses} element={<ProgrammesCourses />} />
        <Route path={`${paths.courses}/:id`} element={<CourseList />} />
        <Route path={paths.newCourse} element={<NewCourse />} />
        <Route path={`${paths.editCourse}/:id`} element={<EditCourse />} />
        <Route path={paths.events} element={<Events />} />
        <Route path={paths.newEvent} element={<NewEvent />} />
        <Route path={`${paths.editEvent}/:id`} element={<EditEvent />} />
        <Route path={paths.notifications} element={<Notifications />} />
        <Route path={paths.newNotification} element={<NewNotification />} />
        <Route path={`${paths.editNotification}/:id`} element={<EditNotification />} />
        <Route path={paths.tickets} element={<Tickets />} />
        <Route path={paths.ticketsList} element={<AdminTicketList />} />
        <Route path={`${paths.tickets}/:id`} element={<ViewTicket />} />
        <Route path={paths.newTicket} element={<NewTicket />} />
        <Route path={`${paths.editTicket}/:id`} element={<EditTicket />} />
        <Route path={paths.newBlog} element={<NewBlog />} />
        <Route path={paths.blogList} element={<BlogList />} />
        <Route path={`${paths.editBlog}/:slug`} element={<EditBlog />} />
        <Route path={paths.categories} element={<Categories />} />
        <Route path={paths.newCategory} element={<NewCategory />} />
        <Route path={`${paths.editCategory}/:id`} element={<EditCategory />} />
        <Route path={paths.liveChat} element={<LiveChat />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);
