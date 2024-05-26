import { RenderPosition, render, remove } from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyElement from '../view/event-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortPointDay, sortPointPrice, sortPointTime } from '../utils.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { filter } from '../utils.js';

export default class BoardPresenter {
  #pointListComponent = new EventsListView();
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  #sortComponent = null;
  #noTaskComponent = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSort = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({ container, pointsModel, filterModel, onNewPointDestroy }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointsListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSort) {
      case SortType.DAY:
        return sortPointDay([...filteredPoints]);
      case SortType.PRICE:
        return sortPointPrice([...filteredPoints]);
      case SortType.TIME:
        return sortPointTime([...filteredPoints]);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createTask() {
    this.#currentSort = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSort === sortType) {
      return;
    }
    this.#currentSort = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    if (this.#sortComponent !== null && this.#sortComponent instanceof SortView) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortView({
      currentSort: this.#currentSort,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderEmptyElement() {
    this.#noTaskComponent = new EventEmptyElement({
      filterType: this.#filterType
    });
    render(this.#noTaskComponent, this.#container);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
    remove(this.#sortComponent);
    remove(this.#noTaskComponent);

    if (resetSortType) {
      this.#currentSort = SortType.DAY;
    }
  }

  #renderBoard() {
    render(this.#pointListComponent, this.#container);

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderEmptyElement();
      return;
    }

    this.#renderSort();
    render(this.#pointListComponent, this.#container);
    this.#renderPoints(points);
  }
}
