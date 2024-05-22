import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import { render, RenderPosition } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import { generateFilter } from './mock/filter.js';

const siteMainContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();

const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  pointsModel,
});

const filters = generateFilter(pointsModel.points);

render(new TripInfoView(pointsModel.points), siteMainContainer, RenderPosition.AFTERBEGIN);
render(new FilterView({filters}), filterContainer);

boardPresenter.init();
