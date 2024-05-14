import { RenderPosition, render } from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyElement from '../view/event-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';


export default class BoardPresenter {
  #ponintListComponent = new EventsListView();
  #container = null;
  #pointsModel = null;
  #sortComponent = new SortView();
  #noTaskComponent = new EventEmptyElement();
  #pointPresenters = new Map();

  #boardPoints = [];

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    this.#boardPoints = [...this.#pointsModel.points];

    if (this.#boardPoints.length === 0) {
      this.#renderEmptyElement();
      return;
    }

    this.#renderSort();
    render(this.#ponintListComponent, this.#container);
    this.#boardPoints.forEach((point) => this.#renderPoints(point));
  }

  #onDataChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderSort() {
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderEmptyElement() {
    render(this.#noTaskComponent, this.#container);
  }

  #renderPoints(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#ponintListComponent.element,
      onDataChange: this.#onDataChange,
      onModeChange: this.#onModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #onModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
