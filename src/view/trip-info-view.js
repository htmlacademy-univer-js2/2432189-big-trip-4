import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';

function createTripInfoElement(points) {
  const cost = points.reduce((summary, point) => summary + point.price, 0);
  const destinations = points.map((point) => point.destination.city).join(' &mdash; ');
  const startDate = dayjs(points[0].date.dateStart).format('MMM D');
  const endDate = dayjs(points[points.length - 1].date.dateEnd).format('MMM D');

  return `
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${destinations}</h1>

          <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
        </p>
      </section>`;
}

export default class TripInfoView extends AbstractView {
  #points = null;

  constructor(points, ) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripInfoElement(this.#points);
  }
}
