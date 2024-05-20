import { getRandomElement, getRandomInteger } from '../utils';
import { DESTINATION, DATE, POINT_TYPES, OFFER } from '../const';
import { getRandomDescription } from './destination';
import { nanoid } from 'nanoid';

function getRandomPoint() {
  const ID = Math.floor(Math.random() * DESTINATION.size);

  const PRICE = {
    MAX: 2500,
    MIN: 20
  };

  return {
    id: nanoid(),
    price: getRandomInteger(PRICE.MIN, PRICE.MAX),
    date: getRandomElement(DATE),
    destination: getRandomDescription(ID),
    isFavorite: Math.floor(Math.random() * 2),
    offer: OFFER.get(getRandomElement(POINT_TYPES)),
    type: getRandomElement(POINT_TYPES)
  };
}

export { getRandomPoint };
