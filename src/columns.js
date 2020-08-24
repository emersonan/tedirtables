// COLUMNS
import { isArray, empty, each, createElement, classList } from './utils.js';
import Cell from './cell.js';
import Row from './row.js';
import Table from './table.js';
import Pager from './pager.js';

export default class Columns {
    constructor(instance, select) {
        this.instance = instance;
		
		if ( select !== undefined ) {
			if ( !isNaN(select) ) {
				this.select = [select];
			} else if ( isArray(select) ) {
				this.select = select;
			}
		} else {
			this.select = instance.table.header.cells.map(function(cell) {
				return cell.index;
			});
		}
    }
        
    init() {}

	count() {
		return this.instance.table.header.cells.length;
	}

	sort(column, direction) {

	    let dt = this.instance;

		column = column || 0;
		direction = direction || (dt.lastDirection && "asc" === dt.lastDirection ? direction = "desc" : direction = "asc");

		if (column < 0 || column > dt.table.header.cells.length - 1) {
			return false;
		}

		let node = dt.table.header.cells[column].node, rows = dt.table.rows;

		if (dt.searching && dt.searchData) {
			rows = dt.searchData;
		}

		// Remove class from previus column
		if (dt.lastHeading) {
			classList.remove(dt.lastHeading, dt.lastDirection);
		}

		if (dt.lastDirection) {
			classList.remove(node, dt.lastDirection);
		}

		classList.add(node, direction);

		let format, datetime;

		if (node.hasAttribute("data-type")) {
			// Check for date format and moment.js
			if (node.getAttribute("data-type") === "date") {
				format = false;
				datetime = node.hasAttribute("data-format");

				if (datetime) {
					format = node.getAttribute("data-format");
				}
			}
		}

		rows.sort(function(a, b) {
			let ca = a.cells[column].content;
			let cb = b.cells[column].content;

			if (datetime) {
				ca = parseDate(ca, format, a.cells[column], a);
				cb = parseDate(cb, format, b.cells[column], b);
			} else {
				ca = ca.replace(/(\$|\,|\s|%)/g, "");
				cb = cb.replace(/(\$|\,|\s|%)/g, "");
			}

			ca = !isNaN(ca) ? parseInt(ca, 10) : ca;
			cb = !isNaN(cb) ? parseInt(cb, 10) : cb;

			return direction === "asc" ? ca > cb : ca < cb;
		});

		dt.table.update();
		dt.update();

		dt.lastHeading = node;
		dt.lastDirection = direction;

		dt.emit("columns.sort", direction, column, node);

		classList.remove(node, "loading");
	}

	search(column, query) {
		this.instance.search(query, column);
	}

	order(order) {
		let dt = this.instance;

		if (isArray(order)) {
			// Check for erroneous indexes
			for (var n = 0; n < order.length; n++) {
				if (order[n] >= dt.columns().count()) {
					throw new Error("Column index " + order[n] + " is outside the range of columns.");
				}
			}

			let reorder = function(node) {
				let arr = [];
				each(order, function(column, i) {
					arr[i] = node.cells[column];
					arr[i].index = arr[i].node.dataIndex = i;
					node.node.appendChild(arr[i].node);
				});
				node.cells = arr;
			};

			// Reorder the header
			if (dt.table.hasHeader) {
				reorder(dt.table.header);
			}

			// Reorder the footer
			if (dt.table.hasFooter) {
				reorder(dt.table.footer);
			}

			// Reorder the rows
			each(dt.table.rows, function(row) {
				reorder(row);
			});

			dt.update();

			dt.emit("columns.order", order);
		}
	}

	hide() {
		let dt = this.instance,
			head = dt.table.header,
			rows = dt.table.rows;

		each(this.select, function(column) {
			each(head.cells, function(cell) {
				if (column == cell.index) {
					cell.hidden = true;
				}
			});

			each(rows, function(row) {
				each(row.cells, function(cell) {
					if (column == cell.index) {
						cell.hidden = true;
					}
				});
			});
		});

		this.fix(true);
		dt.update();

		dt.emit("columns.hide", this.select);
	}

	show() {
		var dt = this.instance,
			head = dt.table.header,
			rows = dt.table.rows;

		each(this.select, function(column) {
			each(head.cells, function(cell) {
				if (column == cell.index) {
					cell.hidden = false;
				}
			});

			each(rows, function(row) {
				each(row.cells, function(cell) {
					if (column == cell.index) {
						cell.hidden = false;
					}
				});
			});
		});

		this.fix(true);
		dt.update();

		dt.emit("columns.show", this.select);
	}

	visible() {
		var dt = this.instance,
			head = dt.table.header,
			cols = [];

		each(this.select, function(column) {
			cols.push(!head.cells[column].hidden);
		});
			
		return cols;
	}

	add(obj) {
		var dt = this.instance;

		if (isObject(obj)) {
			if (isset(obj, "heading")) {
				var cell = new Cell(createElement("th"), dt.columns().count());
				cell.setContent(obj.heading);

				dt.table.header.node.appendChild(cell.node);
				dt.table.header.cells.push(cell);
			}

			if (isset(obj, "data") && isArray(obj.data)) {
				each(dt.table.rows, function(row, i) {
					var cell = new Cell(createElement("td"), row.cells.length);
					cell.setContent(obj.data[i] || "");

					row.node.appendChild(cell.node);
					row.cells.push(cell);
				});
			}
				
			if (isset(obj, "preheading")) {
				var cell = new Cell(createElement("th"), dt.columns().count());
				cell.setContent(obj.preheading);

				dt.table.header.node.insertBefore(cell.node, dt.table.header.node.firstChild);
				dt.table.header.cells.unshift(cell);
			}

			if (isset(obj, "predata") && isArray(obj.predata)) {
				each(dt.table.rows, function(row, i) {
					var cell = new Cell(createElement("td"), row.cells.length);
					cell.setContent(obj.predata[i] || "");

					row.node.insertBefore(cell.node, row.node.firstChild);
					row.cells.unshift(cell);
				});
			}
		}

		this.fix(true);
		dt.update();

		dt.emit("columns.add");
	}

	remove(select, hold) {
		let dt = this.instance,
			table = dt.table,
			head = table.header;

		if (isArray(select)) {
			// Remove in reverse otherwise the indexes will be incorrect
			select.sort(function(a, b) {
				return b - a;
			});

			each(select, function(column, i) {
				this.remove(column, i < select.length - 1);
			}, this);

			return;
		} else {
			head.node.removeChild(head.cells[select].node);
			head.cells.splice(select, 1);

			each(table.rows, function(row) {
				row.node.removeChild(row.cells[select].node);
				row.cells.splice(select, 1);
			});
		}

		if (!hold) {
			each(head.cells, function(cell, i) {
				cell.index = cell.node.dataIndex = i;
			});

			each(table.rows, function(row) {
				each(row.cells, function(cell, i) {
					cell.index = cell.node.dataIndex = i;
				});
			});

			this.fix(true);
			dt.update();
		}

		dt.emit("columns.remove", select);
	}

	fix(update) {
		var dt = this.instance,
			table = dt.table,
			head = table.header;
		if (update) {
			if (table.hasHeader && dt.config.fixedColumns) {
				dt.columnWidths = head.cells.map(function(cell) {
					return cell.node.offsetWidth;
				});
			}
		}

		each(dt.columnWidths, function(size, cell) {
			head.cells[cell].node.style.width = (size / dt.rect.width * 100) + "%";
		});
	}
		
	cells() {
		let that = this, columns = [];
			
		if ( this.select.length == 1 ) {
			this.select = this.select[0];
		}
			
		each(this.instance.table.rows, function(row, i) {
			if ( isArray(that.select) ) {
			    columns[i] = [];
			}
			each(row.cells, function(cell) {
				if( isArray(that.select) && that.select.indexOf(cell.index) >= 0 ) {
					columns[i].push(cell);
				} else if (that.select == cell.index) {
					columns.push(cell);
				}
			});
		});
			
		return columns;
	}
}
