import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import dayjs from 'dayjs';
import { BLANK_POINT, POINT_TYPES } from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

function getEditPointTTemplate(currentType) {
  return (
    `<div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${POINT_TYPES.reduce((acc, type) => (`${acc}<div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
          </div>`), '')}
        </fieldset>
      </div>`);
}

function getOffers(offers, currentOffers) {
  return currentOffers.length !== 0 ? (
    `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${currentOffers.reduce((acc, { id, title, price }) => (`${acc}<div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="${title}" type="checkbox" 
          name="event-offer-${title}" ${offers.includes(id) ? 'checked' : ''}>
        <label class="event__offer-label" for="${title}">
          <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`), '')}
    </div>
  </section>
`) : '';
}

function getPhotos(pictures){
  return pictures !== null ? (
    `<div class="event__photos-container">
        <div class="event__photos-tape">
            ${pictures.map(({src}) => `<img class="event__photo" src="${src}" alt="Event photo">`)}
        </div>
    </div>`) : '';
}

function getCityNames(destinations){
  return `
  <datalist id="destination-list-1">
    ${destinations.reduce((acc, {name}) => `${acc}<option value="${name}"></option>`)}
  </datalist>`;
}

function createEventEditElement(point, isCreating, allOffers, destinations) {
  const { type, basePrice, dateFrom, dateTo, destination, offers } = point;
  const currentOffers = allOffers.find((offer) => offer.type === type).offers;

  const currentDestination = destinations.find((dest) => dest.id === destination);
  let name, description, pictures = null;
  if (currentDestination) {
    name = currentDestination.name;
    description = currentDestination.description;
    pictures = currentDestination.pictures;
  }

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
      <header class="event__header">
          <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
              ${getEditPointTTemplate(type)}
          </div>

          <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                  ${type}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name ? name : ''}" list="destination-list-1">
              ${getCityNames(destinations)}
          </div>

          <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom ? dayjs(dateFrom).format('DD/MM/YY HH:mm') : ''}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo ? dayjs(dateTo).format('DD/MM/YY HH:mm') : ''}">
          </div>

          <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice ? (String(basePrice)) : ''}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isCreating ? 'Cancel' : 'Delete'}</button>
          ${!isCreating ? '<button class="event__rollup-btn" type="button">\
              <span class="visually-hidden">Open event</span>\
          </button>' : ''}
      </header>
      <section class="event__details">
          ${getOffers(offers, currentOffers)}

          <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">${description ? 'Destination' : ''}</h3>
              <p class="event__destination-description">${description}</p>
          </section>

          ${getPhotos(pictures)}
      </section>
  </form>
</li>`;
}

export default class eventEditView extends AbstractStatefulView {
  #isCreating;
  #initialValueOfPoint = null;
  #onResetClick = null;
  #onSubmitClick = null;
  #handleDeleteClick = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #offers = null;
  #destinations = null;

  constructor({point = BLANK_POINT, offers, destinations, onResetClick, onSubmitClick, onDeleteClick, isCreating = false }){
    super();
    this._setState(point);
    this.#initialValueOfPoint = JSON.parse(JSON.stringify(point));
    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#isCreating = isCreating;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#setFlatpickr();

    this._restoreHandlers();
  }

  get template() {
    return createEventEditElement(this._state, this.#isCreating, this.#offers, this.#destinations);
  }

  _restoreHandlers() {
    if (!this.#isCreating) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetClickHandler);
    }

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#submitClickHandler);

    if (this.#offers.find((offer) => offer.type === this._state.type).length !== 0) {
      this.element
        .querySelector('.event__available-offers')
        .addEventListener('change', this.#editCheckedPointHandler);
    }

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#editPointInputHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#editPointTypeHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#editDeletePointHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#editPointPriceHandler);
  }

  #setFlatpickr() {
    const commonConfig = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      'time_24hr': true,
      locale: {
        firstDayOfWeek: 1,
      }
    };

    this.#datepickerStart = flatpickr(
      this.element.querySelectorAll('.event__input--time')[0],
      {
        ...commonConfig,
        onClose: this.#editStartDateChangeHandler,
      }
    );

    this.#datepickerEnd = flatpickr(
      this.element.querySelectorAll('.event__input--time')[1],
      {
        ...commonConfig,
        onClose: this.#editEndDateChangeHandler,
      }
    );
  }

  #editDeletePointHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this._state);
  };

  #editStartDateChangeHandler = ([fullStartDate]) => {
    const dateFrom = dayjs(fullStartDate).format('YYYY-MM-DDTHH:mm');

    this._setState({
      ...this._state,
      dateFrom,
      dateTo: this._state.dateTo
    });
  };

  #editEndDateChangeHandler = ([fullDate]) => {
    const dateTo = dayjs(fullDate).format('YYYY-MM-DDTHH:mm');
    this._setState({
      ...this._state,
      dateFrom: this._state.dateFrom,
      dateTo
    });
  };

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick(this.#initialValueOfPoint);
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(this._state);
  };

  #editCheckedPointHandler = (evt) => {
    evt.preventDefault();
    let offers = this._state.offers;
    const currentAllOffers = this.#offers.find((obj) => obj.type === this._state.type).offers;
    const checkedOfferTitle = evt.currentTarget.attributes[0].ownerDocument.activeElement.id;
    const cleanCheckedOfferId = currentAllOffers.find((offer) => offer.title === checkedOfferTitle).id;

    if (offers.includes(cleanCheckedOfferId)) {
      const index = offers.indexOf(cleanCheckedOfferId);
      offers = [
        ...offers.slice(0, index),
        ...offers.slice(index + 1)];
    } else {
      offers.push(cleanCheckedOfferId);
    }

    this._setState({
      ...this._state,
      offers,
    });
  };

  #editPointInputHandler = (evt) => {
    evt.preventDefault();
    const currentCity = evt.currentTarget.value;
    const newDestination = this.#destinations.find((destination) => destination.name === currentCity);
    this.updateElement({
      destination: newDestination ? newDestination.id : null,
    });
  };

  #editPointPriceHandler = (evt) => {
    evt.preventDefault();
    const basePrice = Number(evt.currentTarget.value);
    this.updateElement({
      basePrice
    });
  };

  #editPointTypeHandler = (evt) => {
    evt.preventDefault();
    const typePoint = evt.target.value;
    this.updateElement({
      type: typePoint,
    });
  };
}
