import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import dayjs from 'dayjs';
import { POINT_TYPES, OFFER, DESTINATION } from '../const';
import flatpickr from 'flatpickr';
import { getRandomDescription } from '../mock/destination';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const BLANK_POINT = {
  id: null,
  price: null,
  date: null,
  destination: null,
  isFavorite: false,
  offer: null,
  type: null
};

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

function getOffers(offer) {
  return offer !== null ? (
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
            ${offer.reduce((acc, [title, price, isChecked]) => (`${acc}<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${isChecked ? 'checked' : ''}>
                    <label class="event__offer-label" for="event-offer-${title}-1">
                        <span class="event__offer-title">${title}</span>
                            &plus;&euro;&nbsp;
                        <span class="event__offer-price">${price}</span>
                    </label>
            </div>`), '')}
        </div>
    </section>
`) : '';
}

function getPhotos(img){
  return img !== null ? (
    `<div class="event__photos-container">
        <div class="event__photos-tape">
            ${img.map((path) => `<img class="event__photo" src="${path}" alt="Event photo">`)}
        </div>
    </div>`) : '';
}

function createEventEditElement(point) {
  const { type, price, date, destination, offer } = point;

  const { city, description, img } = destination;

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
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1">
              <datalist id="destination-list-1">
                  <option value="Amsterdam"></option>
                  <option value="Geneva"></option>
                  <option value="Chicago"></option>
                  <option value="Baku"></option>
                  <option value="Ekaterinburg"></option>
              </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${date ? dayjs(date.dateStart).format('DD/MM/YY HH:mm') : ''}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${date ? dayjs(date.dateEnd).format('DD/MM/YY HH:mm') : ''}">
          </div>

          <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price ? he.encode(String(price)) : ''}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
          </button>
      </header>
      <section class="event__details">
          ${getOffers(offer)}

          <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${description}</p>
          </section>

          ${getPhotos(img)}
      </section>
  </form>
</li>`;
}

export default class eventEditView extends AbstractStatefulView {
  #initialValueOfPoint = null;
  #onResetClick = null;
  #onSubmiClick = null;
  #onEditSavePointClick = null;
  #handleDeleteClick = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({point = BLANK_POINT, onResetClick, onSubmiClick, onEditSavePointClick, onDeleteClick }){
    super();
    this._setState(point);
    this.#initialValueOfPoint = JSON.parse(JSON.stringify(point));
    this.#onResetClick = onResetClick;
    this.#onSubmiClick = onSubmiClick;
    this.#onEditSavePointClick = onEditSavePointClick;
    this.#handleDeleteClick = onDeleteClick;

    this.#setFlatpickr();

    this._restoreHandlers();
  }

  get template() {
    return createEventEditElement(this._state);
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetClickHandler);

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#submiClickHandler);

    this.element
      .querySelector('.event__available-offers')
      .addEventListener('change', this.#editCheckedPointHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#editPointInputHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#editPointTypeHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#editDeletePointHandler);
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
        defaultDate: dayjs(this._state.date.dateStart).format('DD/MM/YY HH:mm'),
        onClose: this.#editStartDateChangeHandler,
      }
    );

    this.#datepickerEnd = flatpickr(
      this.element.querySelectorAll('.event__input--time')[1],
      {
        ...commonConfig,
        defaultDate: dayjs(this._state.date.dateEnd).format('DD/MM/YY HH:mm'),
        onClose: this.#editEndDateChangeHandler,
      }
    );
  }

  #editDeletePointHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this._state);
  };

  #editStartDateChangeHandler = ([fullStartDate, fullEndDate]) => {
    const dateStart = dayjs(fullStartDate).format('YYYY-MM-DDTHH:mm');
    const dateEnd = dayjs(fullEndDate).format('YYYY-MM-DDTHH:mm');

    this._setState({
      ...this._state,
      date: {
        dateStart,
        dateEnd
      }
    });
  };

  #editEndDateChangeHandler = ([fullDate]) => {
    const dateEnd = dayjs(fullDate).format('YYYY-MM-DDTHH:mm');
    this._setState({
      ...this._state,
      date: {
        dateStart: this._state.date.dateStart,
        dateEnd
      }
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

  #submiClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditSavePointClick(this._state);
    this.#onSubmiClick();
  };

  #editCheckedPointHandler = (evt) => {
    evt.preventDefault();
    const offer = this._state.offer;
    const checkedOffer = evt.currentTarget.attributes[0].ownerDocument.activeElement.id;
    const cleanCheckedOffer = checkedOffer.split('-')[2];
    const id = offer.findIndex((item) => item[0] === cleanCheckedOffer);
    offer[id][2] = !offer[id][2];
    this._setState({
      ...this._state,
      offer,
    });
  };

  #editPointInputHandler = (evt) => {
    evt.preventDefault();
    const currentCity = evt.currentTarget.value;
    const id = Array.from(DESTINATION.values()).indexOf(currentCity);
    this.updateElement({
      city: currentCity,
      destination: getRandomDescription(id),
    });
  };

  #editPointTypeHandler = (evt) => {
    evt.preventDefault();
    const typePoint = evt.target.value;
    const offer = OFFER.get(typePoint);
    const newOffer = offer.map((item) => {
      item[2] = false;
      return item;
    });
    this.updateElement({
      type: typePoint,
      offer: newOffer,
    });
  };
}
