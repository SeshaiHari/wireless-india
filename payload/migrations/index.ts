import * as migration_20261123_052321_initial from './20261123_052321_initial';

export const migrations = [
  {
    up: migration_20261123_052321_initial.up,
    down: migration_20261123_052321_initial.down,
    name: '20261123_052321_initial'
  },
];
