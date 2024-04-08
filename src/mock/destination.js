import { DESCRIPTION, DESTINATION } from '../const';
import { getRandomInteger } from '../utils';


const IMGES = {
  MAX: 5,
  MIN: 1
};

const BORDER = 10;

function getRandomDescription(ID) {
  return {
    id: ID,
    city: DESTINATION.get(ID),
    description: DESCRIPTION.get(ID),
    img:  Array.from({length: getRandomInteger(IMGES.MAX, IMGES.MIN)}, () => [`https://loremflickr.com/248/152?random=${Math.floor(Math.random() * BORDER)}`])
  };
}

export { getRandomDescription };
