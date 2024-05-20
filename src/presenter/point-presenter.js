import {remove, render, replace} from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';
import { OFFER, DESTINATION } from '../const.js';
import { getRandomDescription } from '../mock/destination.js';

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #onDataChange = null;

  #componentEvent = null;
  #componentEventEdit = null;

  #point = null;

  #onModeChange = null;
  #mode = MODE.DEFAULT;

  constructor({ pointListContainer, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#componentEvent;
    const prevPointEditComponent = this.#componentEventEdit;

    this.#componentEvent = new EventView({
      point: this.#point,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick,
    });

    this.#componentEventEdit = new EventEditView({
      point: this.#point,
      onResetClick: this.#onResetClick,
      onSubmiClick: this.#onSubmiClick,
      onEditCheckedPoint: this.#onEditCheckedPoint,
      onEditInputDestination: this.#onEditInputDestination,
      onEditPointType: this.#onEditPointType,
    });

    if (!prevPointComponent || !prevPointEditComponent) {
      render(this.#componentEvent, this.#pointListContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#componentEvent, prevPointComponent);
    }

    if (this.#mode === MODE.EDITING) {
      replace(this.#componentEventEdit, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== MODE.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    remove(this.#componentEvent);
    remove(this.#componentEventEdit);
  };

  #replacePointToForm() {
    replace(this.#componentEventEdit, this.#componentEvent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = MODE.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#componentEvent, this.#componentEventEdit);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = MODE.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #onEditClick = () => {
    this.#replacePointToForm();
  };

  #onSubmiClick = () => {
    this.#replaceFormToPoint();
  };

  #onResetClick = () => {
    this.#replaceFormToPoint();
  };

  #onFavoriteClick = () => {
    this.#onDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #onEditInputDestination = (currentCity) => {
    const id = Array.from(DESTINATION.values()).indexOf(currentCity);
    this.#onDataChange({
      ...this.#point,
      city: currentCity,
      destination: getRandomDescription(id),
    });
  };

  #onEditCheckedPoint = (offer, checkedOffer) => {
    const cleanCheckedOffer = checkedOffer.split('-')[2];
    const id = offer.findIndex((item) => item[0] === cleanCheckedOffer);
    offer[id][2] = !offer[id][2];
    this.#onDataChange({
      ...this.#point,
      offer,
    });
  };

  #onEditPointType = (typePoint) => {
    const offer = OFFER.get(typePoint);
    const newOffer = offer.map((item) => {
      item[2] = false;
      return item;
    });
    this.#onDataChange({
      ...this.#point,
      type: typePoint,
      offer: newOffer,
    });
  };
}
