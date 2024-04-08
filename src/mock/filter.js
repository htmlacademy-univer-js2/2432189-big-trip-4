import { filter } from '../utils';

function generateFilter(events) {
  return Object.entries(filter).map(
    ([filterType, filterEvents]) => ({
      type: filterType,
      count: filterEvents(events).length > 0
    }),
  );
}

export { generateFilter };
