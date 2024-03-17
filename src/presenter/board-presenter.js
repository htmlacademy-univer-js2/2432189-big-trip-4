import { render } from '../render.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';


export default class BoardPresenter {

  eventsListComponent = new EventsListView();

  constructor({container, pointsModel}) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];

    render(new SortView(), this.container);
    render(this.eventsListComponent, this.container);
    render(new EventEditView({point: this.boardPoints[0]}), this.eventsListComponent.getElement());

    for (let i = 0; i < this.boardPoints.length; i++) {
      render(new EventView({point: this.boardPoints[i]}), this.eventsListComponent.getElement());
    }
  }
}
