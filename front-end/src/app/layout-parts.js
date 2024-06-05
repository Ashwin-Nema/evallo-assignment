'use client';
import { usePromiseTracker } from 'react-promise-tracker';
import './loader-styles.css';
import { CircularProgress } from '@nextui-org/progress';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  clearTokenDataAndRedirectToLogin,
  getOfflineData,
} from './_utils/offline-services';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from '@nextui-org/react';
import { HTTP_METHODS, invokeApi } from './_utils/http-service';
import { REST_URLS } from './_utils/endpoints';

export const LayoutParts = ({ children }) => {
  const { promiseInProgress } = usePromiseTracker();
  const pathname = usePathname();
  const router = useRouter();
  const [loginUser, setLoginUser] = useState(null);
  useEffect(() => {
    const user = getOfflineData('user', window.localStorage);

    setLoginUser(user);
    if (!user && pathname !== '/login') {
      router.push('/login');
      return;
    }
    if (pathname == '/login' && user) {
      router.push('/');
    }
  }, [pathname]);

  const logout = () => {
    const tokens = getOfflineData('tokens', localStorage);
    const accessToken = tokens?.access?.token;
    const refreshToken = tokens?.refresh?.token;

    invokeApi(
      HTTP_METHODS.POST,
      REST_URLS.LOGOUT,
      {
        accessToken,
        refreshToken,
      },
      null,
      localStorage
    ).finally(() => {
      clearTokenDataAndRedirectToLogin(router, localStorage);
    });
  };

  return (
    <>
      {promiseInProgress && (
        <div className="loading-indicator">
          <div className="spinner-container ">
            <CircularProgress />
          </div>
        </div>
      )}
      <ToastContainer autoClose={2000} />
      {loginUser && (
        <div className="flex justify-end">
          <Dropdown>
            <DropdownTrigger>
              <User
                as="button"
                className="transition-transform"
                name={loginUser?.name}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-bold">Signed in as</p>
                <p className="font-bold">{loginUser?.name}</p>
              </DropdownItem>
              <DropdownItem onPress={logout} key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
      {children}
    </>
  );
};
