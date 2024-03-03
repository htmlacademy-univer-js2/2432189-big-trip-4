import { getRandomElement } from '../utils';
import { DESTINATION, OFFER_TITLES, OFFER_COST, POINT_TYPES, DESCRIPTION } from '../const';

const mockTasks = [
  {
    type: getRandomElement(POINT_TYPES),
    destination: getRandomElement(DESTINATION),
    dateStart: '2024-02-28T10:00:00',
    dateEnd: '2024-02-29T12:00:00',
    cost: 160,
    offerTitle: Array.from({length: 2}, () => getRandomElement(OFFER_TITLES)),
    offerCost: Array.from({length: 2}, () => getRandomElement(OFFER_COST)),
    description: Array.from({length: 3}, () => getRandomElement(DESCRIPTION)),
    photos: Array.from({length: 2}, () => [`https://loremflickr.com/248/152?random=${Math.floor(Math.random() * 10)}`])
  },
  {
    type: getRandomElement(POINT_TYPES),
    destination: getRandomElement(DESTINATION),
    dateStart: '2024-03-31T10:00:00',
    dateEnd: '2024-03-31T12:30:00',
    cost: 260,
    offerTitle: Array.from({length: 5}, () => getRandomElement(OFFER_TITLES)),
    offerCost: Array.from({length: 5}, () => getRandomElement(OFFER_COST)),
    description: Array.from({length: 3}, () => getRandomElement(DESCRIPTION)),
    photos: Array.from({length: 5}, () => [`https://loremflickr.com/248/152?random=${Math.floor(Math.random() * 10)}`])
  },
  {
    type: getRandomElement(POINT_TYPES),
    destination: getRandomElement(DESTINATION),
    dateStart: '2024-04-21T10:00:00',
    dateEnd: '2024-04-21T19:30:00',
    cost: 130,
    offerTitle: Array.from({length: 3}, () => getRandomElement(OFFER_TITLES)),
    offerCost: Array.from({length: 3}, () => getRandomElement(OFFER_COST)),
    description: Array.from({length: 3}, () => getRandomElement(DESCRIPTION)),
    photos: Array.from({length: 3}, () => [`https://loremflickr.com/248/152?random=${Math.floor(Math.random() * 10)}`])
  }
];

function getRandomPoint(){
  return getRandomElement(mockTasks);
}

export {getRandomPoint};
