import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';

function createTripInfoElement(points, offers, destinations) {
  const sortedPoints = points.sort((firstPoint, secondPoint) => new Date(firstPoint.dateFrom) - new Date(secondPoint.dateFrom));
  const destinationNames = sortedPoints.map((point) => destinations.find((destination) => destination.id === point.destination).name);
  let totalCost = 0;

  points.forEach((point) => {
    const currentOffers = offers.find((offer) => offer.type === point.type).offers;
    currentOffers.forEach((offer) => {
      if (point.offers.includes(offer.id)) {
        totalCost += offer.price;
      }});
  });
  totalCost += points.reduce((summary, point) => summary + point.basePrice, 0);
  let displayedDestinations;
  if (destinationNames.length > 3) {
    displayedDestinations = `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`;
  } else {
    displayedDestinations = destinationNames.join(' &mdash; ');
  }

  const startDate = dayjs(Math.min(...points.map((point) => new Date(point.dateFrom)))).format('MMM D');
  const endDate = dayjs(Math.max(...points.map((point) => new Date(point.dateTo)))).format('MMM D');

  return `
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${displayedDestinations}</h1>

          <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
        </p>
      </section>`;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor(points, offers, destinations) {
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoElement(this.#points, this.#offers, this.#destinations);
  }
}
