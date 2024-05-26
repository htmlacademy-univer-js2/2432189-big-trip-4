import TripInfoView from './view/trip-info-view.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render, RenderPosition } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const siteMainContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createTask();
  newPointButtonComponent.element.disabled = true;
}

const tripInfoComponent = new TripInfoView(pointsModel.points);

render(tripInfoComponent, siteMainContainer, RenderPosition.AFTERBEGIN);

filterPresenter.init();
boardPresenter.init();
