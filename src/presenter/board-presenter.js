import { render } from '../render.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';

const EVENT_COUNT = 3;

export default class BoardPresenter {
  
  eventsListComponent = new EventsListView();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(new SortView(), this.container);
    render(this.eventsListComponent, this.container);
    render(new EventEditView(), this.eventsListComponent.getElement());
    
    for (let i = 0; i < EVENT_COUNT; i++) {
      render(new EventView(), this.eventsListComponent.getElement());
    }
  }
}