import dayjs from 'dayjs';

function getRandomElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInteger(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function timeDurationHours(start, end) {
  return dayjs(end).diff(start, 'hour');
}

function timeDurationMinutes(start, end) {
  return dayjs(end).diff(start, 'minute') % 60;
}

export {getRandomElement, getRandomInteger, timeDurationHours, timeDurationMinutes};
