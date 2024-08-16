import { NavigateFunction } from 'react-router-dom';
import { StoreApi, create } from 'zustand';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { SuccessResponse } from '@customTypes/general';
import { StudentProfile, UserRole } from '@customTypes/user';
import { LoginDetails } from '@pages/Login/Login';
import { paths } from '@routes/paths';
import { isApplicationInProgress } from '@utils/helpers';
import { HttpErrorStatusCode, getAxiosError } from '@utils/http';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem
} from '@utils/localStorage';

export type LoggedInUser = Pick<
  StudentProfile,
  'userId' | 'firstName' | 'lastName' | 'email' | 'role' | 'admissionStatus'
>;

type LoginResponse = {
  data: LoggedInUser;
  token: string;
};

interface AuthStore {
  user: LoggedInUser | null;
  login: (UserDetails: LoginDetails, navigateFn: NavigateFunction) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  isLoading: boolean;
  updateUser: (data: Partial<LoggedInUser>) => void;
  validateAuth: () => void;
}

const localStorageUser = getLocalStorageItem('user');

export const getLoginPath = (user: LoggedInUser) =>
  user.role === UserRole.staff || user.role === UserRole.admin
    ? paths.pendingAdmissions
    : isApplicationInProgress(user)
      ? paths.applicationProcess
      : paths.dashboardHome;

const handleLogin = async (
  loginDetails: LoginDetails,
  navigateFn: NavigateFunction,
  set: StoreApi<AuthStore>['setState']
) => {
  try {
    set({ isLoading: true });
    const { data: responseData } = await apiClient.post<LoginResponse>(
      endpoints.login,
      loginDetails
    );
    setLocalStorageItem('token', responseData.token);
    setLocalStorageItem('user', JSON.stringify(responseData.data));
    const currentUser = responseData.data;
    set({ user: currentUser, isAuthenticated: true, isLoading: false, error: null });
    navigateFn(getLoginPath(currentUser));
  } catch (err) {
    const { statusCode } = getAxiosError(err);
    const errorMessage =
      statusCode === HttpErrorStatusCode.BAD_REQUEST ||
        statusCode === HttpErrorStatusCode.UNPROCESSABLE_ENTITY
        ? 'Invalid login credentials'
        : 'Something went wrong';
    set({ error: errorMessage, isLoading: false });
  }
};

const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: localStorageUser ? JSON.parse(localStorageUser) : null,
  error: null,
  setError: (error) => set({ error }),
  isLoading: false,
  login: async (loginDetails, navigateFn) => handleLogin(loginDetails, navigateFn, set),
  logout: () => {
    removeLocalStorageItem('token');
    removeLocalStorageItem('user');
    set({ user: null, isAuthenticated: false });
  },
  updateUser: (data) => {
    const { user } = get();
    const updatedUser = { ...user, ...data } as LoggedInUser;
    setLocalStorageItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser || null });
  },
  validateAuth: async () => {
    const token = getLocalStorageItem('token');
    const chatUser = getLocalStorageItem('chatUser');
    if (!token || chatUser) {
      set({ isAuthenticated: false });
      return;
    }
    if (chatUser) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const response = await apiClient.get<SuccessResponse<LoggedInUser>>(endpoints.validateAuth);
      set({ isAuthenticated: true, user: response.data.data });
    } catch {
      set({ isAuthenticated: false });
    }
  }
}));

export default useAuthStore;
