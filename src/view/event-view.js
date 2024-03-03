import { createElement } from '../render.js';
import { humanizeTaskDueDate, timeDurationHours, timeDurationMinutes } from '../utils.js';
import { DATE_FORMAT_POINT_DAY, DATE_FORMAT_POINT_HOURS } from '../const.js';

function createEventElement(point) {
  const {type, dateStart, dateEnd, destination, cost, offerTitle, offerCost } = point;

  const hours = timeDurationHours(dateStart, dateEnd) === 0 ? '' : `${timeDurationHours(dateStart, dateEnd)}H`;
  const minutes = timeDurationMinutes(dateStart, dateEnd) === 0 ? '' : `${timeDurationMinutes(dateStart, dateEnd)}H`;
  let sum = 0;
  for (let i = 0; i < offerCost.length; i++) {
    sum += offerCost[i];
  }

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateStart}">${humanizeTaskDueDate(dateStart, DATE_FORMAT_POINT_DAY)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateStart}">${humanizeTaskDueDate(dateStart, DATE_FORMAT_POINT_HOURS)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateEnd}">${humanizeTaskDueDate(dateEnd, DATE_FORMAT_POINT_HOURS)}</time>
          </p>
          <p class="event__duration">${hours} ${minutes}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${cost}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">${offerTitle}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${sum}</span>
          </li>
        </ul>
        <button class="event__favorite-btn event__favorite-btn--active" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
}

export default class eventElementView {
  constructor({point}){
    this.point = point;
  }

  getTemplate() {
    return createEventElement(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
