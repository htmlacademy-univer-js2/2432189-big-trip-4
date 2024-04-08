import { getRandomElement, getRandomInteger } from '../utils';
import { DESTINATION, DATE, POINT_TYPES, OFFER } from '../const';
import { getRandomDescription } from './destination';

const BORDER = 5;

function getRandomPoint() {
  const ID = Math.floor(Math.random() * DESTINATION.size);
  const offerCount = Math.floor(Math.random() * BORDER + 1);

  const PRICE = {
    MAX: 2500,
    MIN: 20
  };

  return {
    id: ID,
    price: getRandomInteger(PRICE.MIN, PRICE.MAX),
    date: getRandomElement(DATE),
    destination: getRandomDescription(ID),
    isFavorite: Math.floor(Math.random() * 2),
    offer: Array.from({length: offerCount}, () => getRandomElement(OFFER)),
    type: getRandomElement(POINT_TYPES)
  };
}

export { getRandomPoint };
