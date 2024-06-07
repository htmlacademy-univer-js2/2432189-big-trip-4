import { RenderPosition, render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripInfoView from '../view/trip-info-view.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyElement from '../view/event-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import { sortPointDay, sortPointPrice, sortPointTime } from '../utils.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { filter } from '../utils.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #pointListComponent = new EventsListView();
  #tripInfoComponent = null;
  #container = null;
  #siteMainContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #sortComponent = null;
  #noTaskComponent = null;
  #loadingComponent = new LoadingView();
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSort = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ container, siteMainContainer, pointsModel, filterModel, offersModel, destinationsModel, onNewPointDestroy }) {
    this.#container = container;
    this.#siteMainContainer = siteMainContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointsListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
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

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  init() {
    this.#renderBoard();
  }

  createTask() {
    this.#currentSort = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.offers, this.destinations);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_TASK:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_TASK:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderLoading() {
    render(this.#loadingComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

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
    pointPresenter.init(point, this.offers, this.destinations);
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

    remove(this.#tripInfoComponent);
    remove(this.#sortComponent);
    remove(this.#noTaskComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSort = SortType.DAY;
    }
  }

  #renderBoard() {
    const points = this.points;
    const pointCount = points.length;
    const destinations = this.destinations;

    render(this.#pointListComponent, this.#container);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (pointCount === 0) {
      this.#renderEmptyElement();
      return;
    }

    this.#tripInfoComponent = new TripInfoView(points, destinations);
    render(this.#tripInfoComponent, this.#siteMainContainer, RenderPosition.AFTERBEGIN);
    this.#renderSort();
    render(this.#pointListComponent, this.#container);
    this.#renderPoints(points);
  }
}
