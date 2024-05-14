import { RenderPosition, render } from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyElement from '../view/event-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem, sortPointDay, sortPointPrice, sortPointTime } from '../utils.js';
import { SortType } from '../const.js';


export default class BoardPresenter {
  #ponintListComponent = new EventsListView();
  #container = null;
  #pointsModel = null;
  #sortComponent;
  #noTaskComponent = new EventEmptyElement();
  #pointPresenters = new Map();
  #currentSort = SortType.DAY;

  #boardPoints = [];

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    this.#boardPoints = sortPointDay([...this.#pointsModel.points]);

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
    this.#sortComponent = new SortView({
      currentSort: this.#currentSort,
      onSortTypeChange: this.#onSortTypeChange,
    });
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #onSortTypeChange = (sortType) => {
    if (this.#currentSort === sortType) {
      return;
    }

    this.#sortPoints(sortType);

    this.#clearPointsList();
    this.#boardPoints.forEach((point) => this.#renderPoints(point));
  };

  #sortPoints = (sortType) => {
    switch(sortType) {
      case SortType.DAY:
        this.#boardPoints = sortPointDay([...this.#boardPoints]);
        break;
      case SortType.TIME:
        this.#boardPoints = sortPointTime([...this.#boardPoints]);
        break;
      case SortType.PRICE:
        this.#boardPoints = sortPointPrice([...this.#boardPoints]);
        break;
    }

    this.#currentSort = sortType;
  };

  #clearPointsList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };


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
