import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class PointsModel extends Observable{
  #pointsApiService = null;
  #points = [];
  #offersModel = null;
  #destinationsModel = null;

  constructor({pointsApiService, offersModel, destinationsModel}) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  get points(){
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      this.#points = points.map(this.#adaptToClient);
      window.console.log(this.#points);
      window.console.log(this.#destinationsModel.destinations);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        update,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  addPoint(updatePoint, update) {
    this.#points = [
      update,
      ...this.#points
    ];

    this._notify(updatePoint, update);
  }

  deletePoint(updatePoint, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updatePoint);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
