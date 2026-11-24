import * as migration_20261123_052321_initial from './20261123_052321_initial';
import * as migration_20261123_075914_category_visibility from './20261123_075914_category_visibility';
import * as migration_20261124_143800_numeric_price from './20261124_143800_numeric_price';

export const migrations = [
  {
    up: migration_20261123_052321_initial.up,
    down: migration_20261123_052321_initial.down,
    name: '20261123_052321_initial',
  },
  {
    up: migration_20261123_075914_category_visibility.up,
    down: migration_20261123_075914_category_visibility.down,
    name: '20261123_075914_category_visibility'
  },
  {
    up: migration_20261124_143800_numeric_price.up,
    down: migration_20261124_143800_numeric_price.down,
    name: '20261124_143800_numeric_price',
  },
];
