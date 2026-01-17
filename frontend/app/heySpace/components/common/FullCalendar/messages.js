import { i18n } from 'i18n'

export default function getMessages(msgs) {
  const defaultMessages = {
    date: i18n.t('Date'),
    time: i18n.t('Time'),
    event: i18n.t('Event'),
    allDay: i18n.t('All Day'),
    week: i18n.t('Week'),
    work_week: i18n.t('Work Week'),
    day: i18n.t('Day'),
    month: i18n.t('Month'),
    previous: i18n.t('Back'),
    next: i18n.t('Next'),
    yesterday: i18n.t('Yesterday'),
    tomorrow: i18n.t('Tomorrow'),
    today: i18n.t('Today'),
    agenda: i18n.t('Agenda'),

    noEventsInRange: i18n.t('There are no events in this range.'),

    showMore: total => i18n.t(`+{{total}} more`, { total }),
  }

  return {
    ...defaultMessages,
    ...msgs,
  }
}
