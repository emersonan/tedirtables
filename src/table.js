// Table
import { each, createElement, classList } from './utilities.js';
import Cell from './cell.js';
import Row from './row.js';

export default class Table {
	constructor(table, data, dt) {
	    this.node = table;

		if (typeof table === "string") {
			this.node = document.querySelector(table);
		}

		if (data) {
			this.build(data);
		}

		this.rows = [].slice.call(this.node.rows).map(function(row, i) {
			return new Row(row, i, this);
		}, this);

		this.body = this.node.tBodies[0];

		if (!this.body) {
			this.body = createElement("tbody");
			this.node.appendChild(this.body);
		}

		if (this.rows.length) {
			if (this.rows[0].isHeader) {
				this.hasHeader = true;

				this.header = this.rows[0];

				this.head = this.header.node.parentNode;

				this.rows.shift();

				if (dt.config.sortable) {
					each(this.header.cells, function(cell) {
						classList.add(cell.node, dt.config.classes.sorter);
				    });
				}
			} else {
				this.addHeader();
			}
		}

		if (!dt.config.header) {
			this.head.removeChild(this.header.node);
		}

		if (dt.config.footer) {
			this.hasFooter = true;
			this.footer = new Row(this.header.node.cloneNode(true));

			let foot = createElement("tfoot");
			foot.appendChild(this.footer.node);

			each(this.footer.cells, function(cell) {
				classList.remove(cell.node, dt.config.classes.sorter);
			});

			this.node.insertBefore(foot, this.body);
		}
    }
	    
	build(data) {
		let thead = false, tbody = false;

		if (data.headings) {
			thead = createElement("thead");
			let tr = createElement("tr");
			each(data.headings, function(col) {
				let td = createElement("th", {
					html: col
				});
				tr.appendChild(td);
			});

			thead.appendChild(tr);
		}

		if (data.data && data.data.length) {
			tbody = createElement("tbody");
			each(data.data, function(rows) {
				let tr = createElement("tr");
				each(rows, function(value) {
					let td = createElement("td", {
						html: value
					});
					tr.appendChild(td);
				});
				tbody.appendChild(tr);
			});
		}

		if (thead) {
			if (this.node.tHead !== null) {
				this.node.removeChild(this.node.tHead);
			}
			this.node.appendChild(thead);
		}

		if (tbody) {
			if (this.node.tBodies.length) {
				this.node.removeChild(this.node.tBodies[0]);
			}
			this.node.appendChild(tbody);
		}
	}

	addHeader() {
		let th = createElement("thead"), tr = createElement("tr");

		each(this.rows[0].cells, function(cell) {
			tr.appendChild(createElement("td"));
		});

		th.appendChild(tr);

		this.head = th;
		this.header = new Row(tr, 1);
		this.hasHeader = true;
	}

	addRow(row, at, update) {
		if (row instanceof Row) {
			this.rows.splice(at || 0, 0, row);

			// We may have a table without a header
			if (!this.hasHeader) {
				this.addHeader();
			}

			if (update) {
				this.update();
			}

			return row;
		}
	}

	removeRow(row, update) {
		if (row instanceof Row) {
			this.rows.splice(this.rows.indexOf(row), 1);

			if (update) {
				this.update();
			}
		}
	}

	update(all) {
		each(this.rows, function(row, i) {
			row.index = row.node.dataIndex = i;
		});
	}
}
