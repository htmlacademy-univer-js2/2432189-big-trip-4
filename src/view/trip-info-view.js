import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';

function createTripInfoElement(points, destinations) {
  const cost = points.reduce((summary, point) => summary + point.basePrice, 0);
  const destination = destinations.map((dest) => dest.name).join(' &mdash; ');
  const startDate = dayjs(points[0].dateFrom).format('MMM D');
  const endDate = dayjs(points[points.length - 1].dateTo).format('MMM D');

  return `
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${destination}</h1>

          <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
        </p>
      </section>`;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;

  constructor(points, destinations) {
    super();
    this.#points = points;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoElement(this.#points, this.#destinations);
  }
}
