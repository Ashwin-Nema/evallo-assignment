'use client';
import { useEffect, useState } from 'react';
import { Modal, Button, useDisclosure } from '@nextui-org/react';
import { getOfflineData } from '../_utils/offline-services';
import { setCalendarValues } from './calendar-utils';
import { GoogleLogin } from '../login/page';
import CalendarModalContent from './calendar-components/modal-content';
import { defaultCalendarModalDetails } from '../_utils/constants';
import { setFormConfig } from '../_utils';

export const CalendarModal = ({ homeConfig, configHandler, getEvents }) => {
  const [user, setUser] = useState(null);
  const [getUser, refreshGetUser] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);
  useEffect(() => {
    setUser(getOfflineData('user', window.localStorage));
  }, [getUser]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formDetails, setFormDetails] = useState(defaultCalendarModalDetails);

  const setProperty = setCalendarValues(formDetails, setFormDetails);
  const multiPropSetter = setFormConfig(setFormDetails)();

  useEffect(() => {
    if (homeConfig.triggerModal) {
      onOpen();
    }
  }, [homeConfig.triggerModal]);

  useEffect(() => {
    if (homeConfig.modalDetails) {
      // For setting start date and end date
      multiPropSetter(homeConfig.modalDetails, true);
    }
  }, [homeConfig.modalDetails]);

  const closeModal = (reloadData) => {
    configHandler(
      {
        triggerModal: false,
        modalDetails: null,
      },
      true
    );

    if (reloadData) {
      getEvents()
    }

    onClose();
    setFormDetails(defaultCalendarModalDetails);
  };

  return (
    <>
      {pageLoaded && !user?.isGoogleAuthorized && (
        <GoogleLogin
          reauthorize={true}
          refreshGetUser={refreshGetUser}
          customSvgClass="transform scale-50"
          buttonSize="sm"
        />
      )}
      {user?.isGoogleAuthorized && (
        <>
          <Button onPress={onOpen}>Create Calendar</Button>
          <Modal onClose={closeModal} size="xl" isOpen={isOpen}>
            <CalendarModalContent
              formDetails={formDetails}
              setProperty={setProperty}
              refreshGetUser={refreshGetUser}
              setFormDetails={setFormDetails}
              user={user}
              onClose={closeModal}
            />
          </Modal>
        </>
      )}
    </>
  );
};
