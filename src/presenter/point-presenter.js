import { remove, render, replace } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';
import { UserAction, UpdateType } from '../const.js';
import { isEscKey } from '../utils.js';
import dayjs from 'dayjs';


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

  init(point, offers, destinations) {
    this.#point = point;

    const prevPointComponent = this.#componentEvent;
    const prevPointEditComponent = this.#componentEventEdit;

    this.#componentEvent = new EventView({
      point: this.#point,
      offers,
      destinations,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#componentEventEdit = new EventEditView({
      point: this.#point,
      offers,
      destinations,
      onResetClick: this.#handleResetClick,
      onSubmitClick: this.#handleSubmitClick,
      onDeleteClick: this.#handleDeleteClick,
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

  setSaving() {
    if (this.#mode === MODE.EDITING) {
      this.#componentEventEdit.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === MODE.EDITING) {
      this.#componentEventEdit.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === MODE.DEFAULT) {
      this.#componentEvent.shake();
      return;
    }

    const resetFormState = () => {
      this.#componentEventEdit.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#componentEventEdit.shake(resetFormState);
  }

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
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleSubmitClick = (update) => {
    const isMinorUpdate = dayjs(update.dateFrom).isSame(this.#point.dateFrom)
    || dayjs(update.dateTo).isSame(this.#point.dateTo)
    || update.price === this.#point.price;

    this.#onDataChange(
      UserAction.UPDATE_TASK,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  };

  #handleDeleteClick = (point) => {
    this.#onDataChange(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      point,
    );
  };

  #handleResetClick = (point) => {
    this.#replaceFormToPoint();
    this.#handleSubmitClick(point);
  };

  #handleFavoriteClick = () => {
    this.#onDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
