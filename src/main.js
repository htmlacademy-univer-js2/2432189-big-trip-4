import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic hS2nfS15aal1sa2b';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const siteMainContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const offersModel = new OffersModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const destinationsModel = new DestinationsModel(
  new PointsApiService(END_POINT, AUTHORIZATION)
);
const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
  offersModel,
  destinationsModel,
});
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  siteMainContainer,
  pointsModel,
  filterModel,
  offersModel,
  destinationsModel,
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

pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, siteMainContainer);
  });

filterPresenter.init();
boardPresenter.init();
