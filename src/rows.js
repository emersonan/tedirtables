// ROWS
import { isArray, empty, each, createElement, classList } from './utils.js';
import Cell from './cell.js';
import Row from './row.js';
import Table from './table.js';
import Pager from './pager.js';

export default class Rows {
    constructor(instance, select) {
        this.instance = instance;
		
		if ( select !== undefined ) {
			if ( !isNaN(select) ) {
				this.select = [select];
			} else if ( isArray(select) ) {
				this.select = select;
			}
		} else {
			this.select = instance.table.rows.map(function(row) {
				return row.index;
			});
		}
    }
        
    init() {}

	count() {
		return this.instance.table.rows.length;
	}

	render(page) {
		let that = this,
			dt = that.instance;
			page = page || dt.currentPage;

		empty(dt.table.body);

		if (page < 1 || page > dt.totalPages) return;

		let head = dt.table.header, fragment = document.createDocumentFragment();

		if (dt.table.hasHeader) {
			empty(head.node);
			each(head.cells, function(cell) {
				if (!cell.hidden) {
					head.node.appendChild(cell.node);
				}
			});
		}

		if (dt.pages.length) {
			each(dt.pages[page - 1], function(row) {
				empty(row.node);

				each(row.cells, function(cell) {
					if (!cell.hidden) {
						row.node.appendChild(cell.node);
					}
				});

				fragment.append(row.node);
			});
		}

		dt.table.body.appendChild(fragment);

		each(dt.pagers, function(pager) {
			pager.render();
		});

		dt.getInfo();
			
		if (dt.currentPage == 1) {
		    dt.fixHeight();
		}			

		dt.emit("rows.render");
	}

	paginate() {
		var o = this.instance.config,
			rows = this.instance.table.rows,
			dt = this.instance;

		if (dt.searching && dt.searchData) {
			rows = dt.searchData;
		}

		dt.pages = rows.map((tr, i) => {
			return i % o.perPage === 0 ? rows.slice(i, i + o.perPage) : null;
		}).filter(page => {
			return page;
		});

		dt.totalPages = dt.pages.length;

		// Current page maybe outside the range
		if (dt.currentPage > dt.totalPages) {
			dt.currentPage = dt.totalPages;
		}
	}

	add(row, at) {
		if (isArray(row)) {
			at = at || 0;
			if (isArray(row[0])) {
				each(row, function(tr) {
					tr = this.instance.table.addRow(new Row(tr, this.instance.columns().count() + 1), at);
				}, this);
				// only update after adding multiple rows
				// to keep performance hit to a minimum
				this.instance.table.update();
			} else {
				row = this.instance.table.addRow(new Row(row, this.instance.columns().count() + 1), at, true);
			}

			this.instance.update();

			return row;
		}
	}

	remove(obj) {
		let row = false, dt = this.instance;

		if (isArray(obj)) {
			// reverse order or there'll be shit to pay
			for (var i = obj.length - 1; i >= 0; i--) {
				dt.table.removeRow(this.get(obj[i]));
			}
			dt.table.update();
			dt.update();
		} else {
			row = this.get(obj);
			if (row) {
				dt.table.removeRow(row, true);
				dt.update();

				return row;
			}
		}
	}
		
	cells() {
		let that = this, rows = [];
			
		if ( this.select.length == 1 ) {
			this.select = this.select[0];
		}
			
		each(this.instance.table.rows, function(row) {
			if ( (isArray(that.select) && that.select.indexOf(row.index) >= 0) || that.select == row.index ) {
				rows.push(row.cells);
			}
		});
			
		return rows;
	}		

	get(row) {
		let rows = this.instance.table.rows;
		if (row instanceof Row || row instanceof Element) {
			for (var n = 0; n < rows.length; n++) {
				if (rows[n].node === row || rows[n] === row) {
					row = rows[n];
					break;
				}
			}
		} else {
			row = rows[row];
		}

		return row;
	}
}
