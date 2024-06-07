import dayjs from 'dayjs';
import { FilterType } from './const';

function timeDurationDays(dateFrom, dateTo) {
  const days = dayjs(dateTo).diff(dayjs(dateFrom), 'day');
  return days !== 0 ? `${days}D` : '';
}

function timeDurationHours(dateFrom, dateTo) {
  const hours = dayjs(dateTo).diff(dayjs(dateFrom), 'hour') % 24;
  return hours !== 0 ? `${hours}H` : '';
}

function timeDurationMinutes(dateFrom, dateTo) {
  const minutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute') % 60;
  return minutes !== 0 ? `${minutes}M` : '';
}

function isEventFuture(dateFrom) {
  return dateFrom && dayjs().isBefore(dateFrom, 'D');
}

function isEventPresent(dateFrom, dateTo) {
  return dateFrom && dateTo && dayjs(dateFrom).isSame(dayjs(), 'D');
}

function isEventPast(dateTo) {
  return dateTo && dayjs().isAfter(dateTo, 'D');
}

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.date)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event.date)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.date)),
};

function sortPointDay(points) {
  return points.sort((firstPoint, secondPoint) => new Date(firstPoint.dateFrom) - new Date(secondPoint.dateFrom));
}

function sortPointTime(points) {
  return points.sort((firstPoint, secondPoint) =>
    dayjs(firstPoint.dateFrom).diff(dayjs(firstPoint.dateTo), 'minutes') -
    dayjs(secondPoint.dateFrom).diff(dayjs(secondPoint.dateTo), 'minutes'));
}

function sortPointPrice(points) {
  return points.sort((firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice);
}

export {
  timeDurationHours,
  timeDurationMinutes,
  timeDurationDays,
  isEventFuture,
  isEventPresent,
  isEventPast,
  filter,
  sortPointDay,
  sortPointTime,
  sortPointPrice
};
