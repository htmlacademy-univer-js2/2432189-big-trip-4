const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const DESTINATION = new Map([
  [0, 'Amsterdam'],
  [1, 'Geneva'],
  [2, 'Chamonix'],
  [3, 'Baku'],
  [4, 'Ekaterinburg']
]);

const OFFER = [
  ['Order baklava', 20],
  ['Order Uber', 10],
  ['Order Pizza', 5],
  ['Add luggage', 15],
  ['Switch to PREMIUM', 100],
  ['Rent a car', 100],
  ['Lunch in city', 100]
];

const DATE = [
  {
    dateStart: '2024-04-21T10:00:00',
    dateEnd: '2024-04-21T19:30:00'
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

export { POINT_TYPES, DATE, DESTINATION, OFFER, DESCRIPTION, FilterType };
