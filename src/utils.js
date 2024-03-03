import dayjs from 'dayjs';

function getRandomElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizeTaskDueDate(dueDate, format) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}


function timeDurationHours(start, end) {
  return dayjs(end).diff(start, 'hour');
}

function timeDurationMinutes(start, end) {
  return dayjs(end).diff(start, 'minute') % 60;
}

export {getRandomElement, humanizeTaskDueDate, timeDurationHours, timeDurationMinutes};
