import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';
import { timeDurationDays, timeDurationHours, timeDurationMinutes } from '../utils';

function createNewPointOfferTemplate(offers, currentOffers) {
  return (
    `<ul class="event__selected-offers">
    ${currentOffers.reduce((acc, { id, title, price }) =>
      (acc += offers.includes(id) ? `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>` : ''), '')}
  </ul>`
  );
}

function createEventElement(point, allOffers, destinations) {
  const { type, basePrice, dateFrom, dateTo, destination, offers, isFavorite } = point;
  const currentOffers = allOffers.find((offer) => offer.type === type).offers;

  const currentDestination = destinations.find((dest) => dest.id === destination);
  const { name } = currentDestination;

  const days = timeDurationDays(dateFrom, dateTo);
  const hours = timeDurationHours(dateFrom, dateTo);
  const minutes = timeDurationMinutes(dateFrom, dateTo);

  const eventFavorite = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
            <div class="event">
                <time class="event__date" datetime="${dateFrom}">${dayjs(dateFrom).format('MMM DD')}</time>
                <div class="event__type">
                    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${name}</h3>
                <div class="event__schedule">
                    <p class="event__time">
                        <time class="event__start-time" datetime="${dateFrom}">${dayjs(dateFrom).format('HH:mm')}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${dateTo}">${dayjs(dateTo).format('HH:mm')}</time>
                    </p>
                    <p class="event__duration">${days} ${hours} ${minutes}</p>
                </div>
                <p class="event__price">
                    &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>

                ${createNewPointOfferTemplate(offers, currentOffers)}

                <button class="event__favorite-btn ${eventFavorite}" type="button">
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

export default class eventElementView extends AbstractView {
  #point = null;
  #onEditClick = null;
  #onFavoriteClick = null;
  #offers = null;
  #destinations = null;

  constructor({ point, offers, destinations, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.#offers = offers;
    this.#destinations = destinations;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClcikHandler);

    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventElement(this.#point, this.#offers, this.#destinations);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };

  #editClcikHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };
}
