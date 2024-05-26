import { remove, render, RenderPosition } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType } from '../const.js';

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

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EventEditView({
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
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

  #handleFormSubmit = (point) => {
    this.#onDataChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
