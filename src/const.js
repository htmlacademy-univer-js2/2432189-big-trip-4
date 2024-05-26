const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const OFFER = new Map([
  ['taxi', [['Order Uber', 10, true], ['Switch to PREMIUM', 100, false], ['Add luggage', 15, true], ['Child seat', 20, false], ['Wi-Fi', 5, true]]],
  ['bus', [['Trip with a cat', 45, true], ['Book tickets', 30, true], ['Add luggage', 85, true], ['Reclining seat', 55, true]]],
  ['train', [['Book tickets', 40, true], ['Add luggage', 25, true], ['Switch to PREMIUM tickets', 100, false], ['Wi-Fi', 5, true], ['Meal service', 35, true]]],
  ['ship', [['Add luggage', 25, true], ['Book tickets', 100, true], ['Guided tour', 75, true], ['Add breakfast', 120, true]]],
  ['drive', [['Rent a car', 100, true], ['GPS', 20, true], ['Child seat', 30, true], ['Add luggage', 40, true]]],
  ['flight', [['Reclining seat', 200, true], ['Add luggage', 150, true], ['Add breakfast', 150, true], ['Switch to PREMIUM', 1000, false], ['Add a transfer', 20, true]]],
  ['check-in', [['Book tickets', 45, true], ['Add condi', 20, true], ['Wi-Fi', 10, true], ['Add breakfast', 110, true], ['Room upgrade', 80, false], ['Switch to PREMIUM', 100, false]]],
  ['sightseeing', [['Lunch in city', 150, true], ['Private guide', 300, false], ['Transportation included', 100, true]]],
  ['restaurant', [['Order baklava', 20, false], ['Order Pizza', 5, true], ['Live music', 75, true]]],
]);

const DESTINATION = new Map([
  [0, 'Amsterdam'],
  [1, 'Geneva'],
  [2, 'Chicago'],
  [3, 'Baku'],
  [4, 'Ekaterinburg'],
]);

const DATE = [
  {
    dateStart: '2024-04-21T10:00:00',
    dateEnd: '2024-04-21T19:30:00'
  },
  {
    dateStart: '2024-04-16T14:20:00',
    dateEnd: '2024-04-16T19:30:00'
  },
  {
    dateStart: '2024-03-31T10:00:00',
    dateEnd: '2024-03-31T12:30:00'
  },
  {
    dateStart: '2024-03-28T12:00:00',
    dateEnd: '2024-03-29T14:00:00',
  },
  {
    dateStart: '2024-03-28T17:00:00',
    dateEnd: '2024-03-29T20:00:00',
  },
  {
    dateStart: '2024-03-29T05:00:00',
    dateEnd: '2024-03-29T20:00:00',
  },
  {
    dateStart: '2024-03-28T19:00:00',
    dateEnd: '2024-03-29T01:30:00',
  }
];

const DESCRIPTION = new Map([
  [0, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.'],
  [1, 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'],
  [2, 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.'],
  [3, 'Sed sed nisi sed augue convallis suscipit in sed felis.'],
  [4, 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.']
]);

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};


export { POINT_TYPES, DATE, DESTINATION, OFFER, DESCRIPTION, FilterType, SortType, UserAction, UpdateType };
