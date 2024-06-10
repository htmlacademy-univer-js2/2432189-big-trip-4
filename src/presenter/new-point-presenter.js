import { remove, render, RenderPosition } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import { UserAction, UpdateType } from '../const.js';
import { isEscKey } from '../utils.js';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #onDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({pointsListContainer, onDataChange, onDestroy}) {
    this.#pointsListContainer = pointsListContainer;
    this.#onDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(offers, destinations) {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EventEditView({
      onSubmitClick: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      isCreating: true,
      offers,
      destinations
    });

    render(this.#pointEditComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (update) => {
    this.#onDataChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      update,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
