import AbstractView from '../framework/view/abstract-view';

function createEventEmptyElement() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class eventEmptyElement extends AbstractView{
  get template(){
    return createEventEmptyElement();
  }
}
