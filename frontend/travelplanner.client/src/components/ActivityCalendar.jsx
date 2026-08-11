import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { srLatn } from 'date-fns/locale';
import { ACTIVITY_STATUSES } from '../models/Activity';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'sr-Latn': srLatn };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Prevod poruka kalendara na srpski.
const messages = {
  date: 'Datum',
  time: 'Vreme',
  event: 'Aktivnost',
  allDay: 'Ceo dan',
  week: 'Nedelja',
  work_week: 'Radna nedelja',
  day: 'Dan',
  month: 'Mesec',
  previous: 'Prethodni',
  next: 'Sledeći',
  yesterday: 'Juče',
  tomorrow: 'Sutra',
  today: 'Danas',
  agenda: 'Agenda',
  noEventsInRange: 'Nema aktivnosti u ovom periodu.',
  showMore: (total) => `+ još ${total}`,
};

export default function ActivityCalendar({ activities, defaultDate, onSelectActivity, onSelectSlot }) {
  const [date, setDate] = useState(defaultDate ?? new Date());
  const [view, setView] = useState('month');
  // Aktivnost -> kalendarski dogadjaj
  const events = activities.map((a) => {
    const start = buildDateTime(a.date, a.time);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // podrazumevano 1h
    return {
      id: a.id,
      title: a.name,
      start,
      end,
      resource: a,
    };
  });

  // Boja dogadjaja prema statusu.
  function eventStyleGetter(event) {
    const status = ACTIVITY_STATUSES.find((s) => s.value === event.resource.status);
    return {
      style: {
        backgroundColor: status?.color ?? '#2563eb',
        border: 'none',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '0.8rem',
      },
    };
  }

  return (
    <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        view={view}
        onView={(newView) => setView(newView)}
        views={['month', 'week', 'day', 'agenda']}
        culture="sr-Latn"
        messages={messages}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => onSelectActivity(event.resource)}
        onSelectSlot={(slot) => onSelectSlot(slot.start)}
        selectable
        style={{ height: 600 }}
      />
    </div>
  );
}

// Spaja datum i (opciono) vreme aktivnosti u jedan Date objekat.
function buildDateTime(date, time) {
  const d = new Date(date);
  if (time) {
    const [h, m] = time.slice(0, 5).split(':').map(Number);
    d.setHours(h, m, 0, 0);
  }
  return d;
}