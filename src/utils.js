import dayjs from 'dayjs';
import { FilterType } from './const';

function getRandomElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInteger(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function timeDurationDays(start, end) {
  return dayjs(end).diff(start, 'day');
}

function timeDurationHours(start, end) {
  return dayjs(end).diff(start, 'hour') % 24;
}

function timeDurationMinutes(start, end) {
  return dayjs(end).diff(start, 'minute') % 60;
}

function isEventFuture(event) {
  return dayjs().isBefore(event.start);
}

function isEventPresent(event) {
  return dayjs().isAfter(event.dateFrom) && dayjs().isBefore(event.dateTo);
}

function isEventPast(event) {
  return dayjs().isAfter(event.end);
}

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event)),
};

export { getRandomElement, getRandomInteger, timeDurationHours, timeDurationMinutes, timeDurationDays, isEventFuture, isEventPresent, isEventPast, filter };
