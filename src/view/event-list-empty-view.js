import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const';

const NoPointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no past events now',
  [FilterType.PAST]: 'There are no present events now',
};

function createEventEmptyElement(filterType) {
  const NoPointTextValue = NoPointTextType[filterType];
  return `<p class="trip-events__msg">${NoPointTextValue}</p>`;
}

export default class eventEmptyElement extends AbstractView{
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template(){
    return createEventEmptyElement(this.#filterType);
  }
}
