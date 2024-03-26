import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import {render, RenderPosition} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';

const siteMainContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();

const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  pointsModel,
});

render(new TripInfoView(), siteMainContainer, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterContainer);

boardPresenter.init();
