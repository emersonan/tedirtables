import { version } from '../package.json';
import { isArray, isJson, isset, closest, on, empty, utils, parseDate, each, extend, isObject, classList, createElement } from './utilities.js';
import Cell from './cell.js';
import Row from './row.js';

export default function () {
  console.log('version ' + version);
}
