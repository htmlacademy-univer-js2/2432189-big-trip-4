import dayjs from 'dayjs';
import { FilterType } from './const';

const isEscKey = (evt) => evt.key === 'Escape';

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
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isEventPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isEventPast(point.dateTo)),
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
  sortPointPrice,
  isEscKey
};
