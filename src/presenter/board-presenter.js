import { render, replace } from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';
import EventEmptyElement from '../view/event-list-empty-view.js';


export default class BoardPresenter {
  #eventsListComponent = new EventsListView();
  #container = null;
  #pointsModel = null;
  #sortComponent = new SortView();
  #boardPoints = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];

    if (this.#boardPoints.length === 0){
      render(new EventEmptyElement(), this.#container);
      return;
    }

    render(this.#sortComponent, this.#container);
    render(this.#eventsListComponent, this.#container);

    this.#boardPoints.forEach((point) => this.#renderPoints(point));
  }

  #renderPoints(point) {
    const componentEvent = new EventView({
      point,
      onEditClick,
    });

    const componentEventEdit = new EventEditView({
      point,
      onResetClick,
      onSubmiClick,
    });

    const escKeydown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replace(componentEvent, componentEventEdit);
        document.removeEventListener('keydown', escKeydown);
      }
    };

    function onEditClick() {
      replace(componentEventEdit, componentEvent);
      document.addEventListener('keydown', escKeydown);
    }

    function onSubmiClick() {
      replace(componentEvent, componentEventEdit);
      document.removeEventListener('keydown', escKeydown);
    }

    function onResetClick() {
      replace(componentEvent, componentEventEdit);
      document.removeEventListener('keydown', escKeydown);
    }

    render(componentEvent, this.#eventsListComponent.element);
  }
}
