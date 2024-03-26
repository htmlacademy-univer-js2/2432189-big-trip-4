import { getRandomPoint } from '../mock/points';

const POINT_COUNT = 5;

export default class PointsModel{
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);

  get points(){
    return this.#points;
  }
}

