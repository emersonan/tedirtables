// Row
import { isArray, each, createElement } from './utils.js';
import Cell from './cell.js';

export default class Row {
    constructor(row, index) {
	    if (isArray(row)) {
		    this.node = createElement("tr");

			each(row, function(val, i) {
				this.node.appendChild(createElement("td", {
					html: val
				}));
			}, this);
		} else {
			this.node = row;
			if (index !== undefined) {
				this.isHeader = row.parentNode.nodeName === "THEAD";
			}
		}

		if (!this.isHeader && index !== undefined) {
			this.index = this.node.dataIndex = index - 1;
		}

		this.cells = [].slice.call(this.node.cells).map(function(cell, i) {
		    return new Cell(cell, i, this);
		}, this);
	}
}
