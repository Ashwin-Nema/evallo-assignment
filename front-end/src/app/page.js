'use client';

import { CalendarModal } from './_modals/calendar.modal';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';
import { formatDataForModal, setFormConfig } from './_utils';
import timeGridPlugin from '@fullcalendar/timegrid';
import { getCalendarEvents } from './_apis';

export default function Home() {
  const [homeConfig, setConfig] = useState({
    triggerModal: false,
    modalDetails: null,
    calendarEventList: [],
    startDate: null,
    endDate: null,
  });

  const configHandler = setFormConfig(setConfig);
  function renderEventContent(eventInfo) {
    return <i>{eventInfo.event.title}</i>;
  }
  const handleDateSelect = (selectInfo) => {
    configHandler()(
      {
        triggerModal: true,
        modalDetails: {
          startDate: selectInfo.start,
          endDate: selectInfo.end,
        },
      },
      true
    );
  };

  const handleDatesSet = (arg) => {
    const { start: startDate, end: endDate } = arg;
    getCalendarEvents(startDate, endDate, configHandler('calendarEventList'));
    configHandler()(
      {
        startDate,
        endDate,
      },
      true
    );
  };

  function handleEventClick(clickInfo) {
    const eventData = clickInfo.event._def.extendedProps;
    configHandler()(
      {
        triggerModal: true,
        modalDetails: formatDataForModal(eventData),
      },
      true
    );
  }

  return (
    <main>
      <div className="flex justify-end  gap-4 mr-4 mt-8 mb-4">
        <CalendarModal
          homeConfig={homeConfig}
          configHandler={configHandler()}
          getEvents={() =>
            getCalendarEvents(
              homeConfig.startDate,
              homeConfig.endDate,
              configHandler('calendarEventList')
            )
          }
        />
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        events={homeConfig.calendarEventList}
        datesSet={handleDatesSet}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />
    </main>
  );
}
