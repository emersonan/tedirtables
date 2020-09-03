// LIB FOR BOOTSTRAP5
import { version } from '../package.json';
import { isArray, isJson, isset, closest, on, empty, utils, parseDate, each, extend, isObject, classList, createElement } from './utils.js';
import Cell from './cell.js';
import Row from './row.js';
import Table from './table.js';
import Pager from './pager.js';
import Columns from './columns.js';
import Rows from './rows.js';
import defaultConfig from './bootstrap5-config.js';

export class DataTable {
    constructor(table, config) {
        console.log('version ' + version);
        this.config = extend(defaultConfig, config);

		if (this.config.ajax) {
		    let that = this, ajax = this.config.ajax;

			this.request = new XMLHttpRequest();

			on(this.request, "load", function(xhr) {
				if (that.request.readyState === 4) {
					if (that.request.status === 200) {
						let obj = {};
						obj.data = ajax.load ? ajax.load.call(that, that.request) : that.request.responseText;

						obj.type = "json";

						if (ajax.content && ajax.content.type) {
							obj.type = ajax.content.type;
							obj = extend(obj, ajax.content);
						}

						that.table = new Table(table, obj.data, that);

						that.init();
					}
				}
		    });

			this.request.open("GET", typeof ajax === "string" ? that.config.ajax : that.config.ajax.url);
			this.request.send();
	    } else {
			if (this.config.data) {
				this.table = new Table(table, this.config.data, this);
			} else {
				this.table = new Table(table, false, this);
			}

			this.init();
		}
    }
        
    init() {

		if (this.initialised) return;

		let that = this, o = that.config;
			
		that.sortable = o.sortable;
		that.searchable = o.searchable;

		that.currentPage = 1;
		that.onFirstPage = true;
		that.onLastPage = false;

		that.rows().paginate();
		that.totalPages = that.pages.length;

		that.render();

		if (o.fixedColumns) {
		    that.columns().fix();
		}

		that.extend();

		if (o.plugins) {
		    each(o.plugins, function(options, plugin) {
			    if (that[plugin] !== undefined && typeof that[plugin] === "function") {
					that[plugin] = that[plugin](that, options, utils);

					// Init plugin
				    if (options.enabled && that[plugin].init && typeof that[plugin].init === "function") {
						that[plugin].init();
					}
			    }
			});
		}

		// Check for the columns option
		if (o.columns) {
			let selectedColumns = [];
			let columnRenderers = [];

			each(o.columns, function(data) {
				// convert single column selection to array
				if (!isArray(data.select)) {
					data.select = [data.select];
				}

				if (isset(data, "render") && typeof data.render === "function") {
					selectedColumns = selectedColumns.concat(data.select);

					columnRenderers.push({
						columns: data.select,
						renderer: data.render
					});
				}

				// Add the data attributes to the th elements
				if (that.table.hasHeader) {
					each(data.select, function(column) {
						var cell = that.table.header.cells[column];

						if (data.type) {
							cell.node.setAttribute("data-type", data.type);
						}
						if (data.format) {
							cell.node.setAttribute("data-format", data.format);
						}
						if (isset(data, "sortable")) {
							cell.node.setAttribute("data-sortable", data.sortable);

							if (data.sortable === false) {
								classList.remove(cell.node, o.classes.sorter);
							}
						}

						if (isset(data, "hidden")) {
							if (data.hidden !== false) {
								that.columns().hide(column);
							}
						}

						if (isset(data, "sort") && data.select.length === 1) {
							that.columns().sort(data.select[0], data.sort);
						}
					});
				}
			});

			if (selectedColumns.length) {
				each(that.table.rows, function(row) {
					each(row.cells, function(cell) {
						if (selectedColumns.indexOf(cell.index) >= 0) {
							each(columnRenderers, function(obj) {
								if (obj.columns.indexOf(cell.index) >= 0) {
									cell.setContent(obj.renderer.call(that, cell.content, cell, row));
								}
							});
						}
					});
				});
			}
		}

		that.rows().render();

		that.bindEvents();
			
		that.setClasses();

		that.initialised = true;

		setTimeout(function() {
			that.emit("init");
		}, 10);
	}
		
	setClasses() {
		classList.toggle(this.wrapper, "tedirtable-sortable", this.sortable);
		classList.toggle(this.wrapper, "tedirtable-searchable", this.searchable);
	}

	extend() {
		let that = this;
        if(that.config.plugins) {
			each(that.config.plugins, function(ext) {
				if (that[ext] !== undefined && typeof that[ext] === "function") {
					that[ext] = that[ext](that, that.config[ext], utils);

					// Init extension
					if (that[ext].init && typeof that[ext].init === "function") {
						that[ext].init();
					}
				}
			});
		}
	}

	bindEvents() {
		let that = this, o = that.config;

		on(that.wrapper, "mousedown", function(e) {
			if (e.which === 1 && that.sortable && e.target.nodeName === "TH") {
				classList.add(e.target, "loading");
			}
		});

		on(that.wrapper, "click", function(e) {
			let node = e.target;

			if (node.hasAttribute("data-page")) {
				e.preventDefault();
				that.page(parseInt(node.getAttribute("data-page"), 10));
			}

			if (that.sortable && node.nodeName === "TH" && classList.contains(node, o.classes.sorter)) {
				if (node.hasAttribute("data-sortable") && node.getAttribute("data-sortable") === "false") return false;

				e.preventDefault();
				that.columns().sort(node.dataIndex, classList.contains(node, "asc") ? "desc" : "asc");
			}
		});

		if (o.perPageSelect) {
			on(that.wrapper, "change", function(e) {
				let node = e.target;
				if (node.nodeName === "SELECT" && classList.contains(node, o.classes.selector)) {
					e.preventDefault();
					that.setPerPage(node.value);
				}
			});
		}

		if (that.searchable) {
			on(that.wrapper, "keyup", function(e) {
			    if (e.target.nodeName === "INPUT" && classList.contains(e.target, o.classes.input)) {
					e.preventDefault();
				    that.search(e.target.value);
				}
			});
		}

		if (that.sortable) {
			on(that.wrapper, "mousedown", function(e) {
				if (e.target.nodeName === "TH") {
					e.preventDefault();
				}
			});
		}
		
	}

	render() {

		if (this.rendered) return;

		let that = this, o = that.config;

		if (this.table.hasHeader && o.fixedColumns && o.header) {
			this.columnWidths = this.table.header.cells.map(function(cell) {
				return cell.node.offsetWidth;
			});
		}

		// Build
		that.wrapper = createElement("div", {
			class: o.classes.wrapper
		});

		// Template for custom layouts
		let inner = [
			"<div class='", o.classes.topbar, " ", o.classes.grid, "'>", "<div class=", o.classes.gridStart,">", o.layout.topLeft, "</div>", "<div class=", o.classes.gridEnd,">", o.layout.topRight, "</div>", "</div>",
			"<div class='", o.classes.container, "'></div>",
			"<div class='", o.classes.bottombar, " ", o.classes.grid, "'>", "<div class=", o.classes.gridStart,">", o.layout.bottomLeft, "</div>", "<div class=", o.classes.gridEnd,">", o.layout.bottomRight, "</div>", "</div>"
		].join("");
		
		// Button placement
		if(o.buttons != null && Array.isArray(o.buttons)) {
		    if(o.buttons.length > 0) {
		        const btn = [];
		        each(o.buttons, button => {
		            const btnname = (button.name) ? button.name : '';
		            const btnclass = (button.class) ? button.class : '';
		            const btnstyle = (button.style) ? button.style : '';
		            const btntext = (button.text) ? button.text : '';
		            btn.push('<button type="button" id="'+btnname+'" name="'+btnname+'" class="'+btnclass+'" style="'+btnstyle+'">'+btntext+'</button>');
		        });
		        inner = inner.replace(
			        "{buttons}",
			        btn.join("")
		        );
		    }
		}

		// Toolbar placement
		if(o.toolbar != null) {
		    inner = inner.replace(
			    "{toolbar}",
			    document.querySelector(o.toolbar).outerHTML
		    );
		    document.querySelectorAll(o.toolbar)[0].style.display = "none";
		}

		// Info placement
		inner = inner.replace(
			"{info}",
			"<div class='" + o.classes.info + " mt-1'></div>"
		);

		// Per Page Select
		if (o.perPageSelect) {
			let wrap = [
				"<div class='", o.classes.dropdown, "'>",
				"<label class='", o.classes.selectLabel, "'>", o.labels.perPage, "</label>",
				"</div>"
			].join("");

			// Create the select
			let select = createElement("select", {
				class: o.classes.selector
			});

			// Create the options
			each(o.perPageSelect, function(val) {
				let selected = val === o.perPage;
				let option = new Option(val, val, selected, selected);
				select.add(option);
			});

			// Custom label
			wrap = wrap.replace("{select}", select.outerHTML);

			// Selector placement
			inner = inner.replace(/\{select\}/g, wrap);
		} else {
			inner = inner.replace(/\{select\}/g, "");
		}

		// Searchable
		if (that.searchable) {
			let form = [
				"<div class='", o.classes.search, "'>",
				"<input class='", o.classes.input, "' placeholder='", o.labels.placeholder, "' type='text'>",
				"</div>"
			].join("");

			// Search input placement
			inner = inner.replace(/\{search\}/g, form);
		} else {
			inner = inner.replace(/\{search\}/g, "");
		}

		// Add table class
		that.table.node.classList.add(o.classes.table);

		// Pagers
		each(inner.match(/\{pager\}/g), function(pager, i) {
			inner = inner.replace(
				"{pager}",
				createElement("div", {
					class: o.classes.pagination
				}).outerHTML
			);
		});

		that.wrapper.innerHTML = inner;

		that.pagers = [].slice.call(
			that.wrapper.querySelectorAll("." + o.classes.pagination)
		);

		each(that.pagers, function(pager, i) {
			that.pagers[i] = new Pager(that, pager);
		});

		that.container = that.wrapper.querySelector("." + o.classes.container);

		that.labels = that.wrapper.querySelectorAll("." + o.classes.info);
		that.inputs = that.wrapper.querySelectorAll("." + o.classes.input);

		that.selectors = that.wrapper.querySelectorAll("." + o.classes.selector);

		// Insert in to DOM tree
		that.table.node.parentNode.replaceChild(that.wrapper, that.table.node);
		that.container.appendChild(that.table.node);

		// Store the table dimensions
		that.rect = that.table.node.getBoundingClientRect();

		that.rendered = true;
	}

	update() {
		this.rows().paginate();
		this.rows().render();

		this.emit("update");
	}
		
	fixHeight() {
		this.container.style.height = null;
		if (this.config.fixedHeight != false) {
			this.rect = this.container.getBoundingClientRect();
			this.container.style.height = this.rect.height + "px";
		}			
	}	

	getInfo() {
		// Update the info
		let current = 0,
			f = 0,
			t = 0,
			items;

		if (this.totalPages) {
			current = this.currentPage - 1;
			f = current * this.config.perPage;
			t = f + this.pages[current].length;
			f = f + 1;
			items = !!this.searching ? this.searchData.length : this.rows().count();
		}

		if (this.labels.length && this.config.labels.info.length) {
			// CUSTOM LABELS
			let string = this.config.labels.info
				.replace("{start}", f)
				.replace("{end}", t)
				.replace("{page}", this.currentPage)
				.replace("{pages}", this.totalPages)
				.replace("{rows}", items);

			each([].slice.call(this.labels), function(label) {
				label.innerHTML = items ? string : "";
			});
		}
	}
	
	search(query, column) {
		let that = this;

		query = query.toLowerCase();

		that.currentPage = 1;
		that.searching = true;
		that.searchData = [];

		if (!query.length) {
			that.searching = false;
			classList.remove(that.wrapper, "search-results");
			that.update();

			return false;
		}

		each(that.table.rows, function(row) {
			let inArray = that.searchData.indexOf(row) >= 0;

			// Filter column
			if (column !== undefined) {
				each(row.cells, function(cell) {
					if (column !== undefined && cell.index == column && !inArray) {
						if (cell.content.toLowerCase().indexOf(query) >= 0) {
							that.searchData.push(row);
						}
					}
				});
			} else {
				// https://github.com/Mobius1/Vanilla-TedirTables/issues/12
				let match = query.split(" ").reduce(function(bool, word) {
					let includes = false;

					for (let x = 0; x < row.cells.length; x++) {
						if (row.cells[x].content.toLowerCase().indexOf(word) >= 0) {
							if (!row.cells[x].hidden || (row.cells[x].hidden && that.config.search.includeHiddenColumns)) {
								includes = true;
						    }
							break;
						}
					}

					return bool && includes;
				}, true);

				if (match && !inArray) {
					that.searchData.push(row);
				}
			}
		});

		classList.add(that.wrapper, "search-results");

		if (!that.searchData.length) {
			classList.remove(that.wrapper, "search-results");

			that.setMessage(that.config.labels.noRows);
		} else {
			that.update();
		}

		this.emit("search", query, this.searchData);
	}

	page(page) {
		// We don't want to load the current page again.
		if (page == this.currentPage) {
			return false;
		}

		if (!isNaN(page)) {
			this.currentPage = parseInt(page, 10);
		}

		this.onFirstPage = this.currentPage === 1;
		this.onLastPage = this.currentPage === this.totalPages;

		if (page > this.totalPages || page < 0) {
			return false;
		}

		this.rows().render(parseInt(page, 10));

		this.emit("page", page);
	}
		
	reset() {
		let that = this;
			
		if ( this.searching ) {
			this.searching = this.searchData = false;
			classList.remove(this.wrapper, "search-results");
		}
			
		each([].slice.call(this.inputs), function(input) {
			input.value = null;
			input.blur();
		});	
			
		this.update();
			
		this.emit("reset");
	}
		
	set(prop, val) {
		if ( this.hasOwnProperty(prop) ) {
			this[prop] = val;
				
			classList.toggle(this.wrapper, "tedirtable-" + prop, this[prop]);
				
			this.update();
		}
	}
		
	setPerPage(value) {
		if ( !isNaN(value) ) {
			value = parseInt(value, 10);
				
			this.config.perPage = value;
				
			this.fixHeight();

			if ( this.config.perPageSelect.indexOf(value) >= 0 ) {
				each([].slice.call(this.selectors), function(select) {
					select.value = value;
				});
			}

			this.update();
				
			this.emit("perpage", value);
		}
	}

	import(options) {
		let that = this, obj = false;
		let defaults = {
			// csv
			lineDelimiter: "\n",
			columnDelimiter: ","
		};

		// Check for the options object
		if (!isObject(options)) {
			return false;
		}

		options = extend(defaults, options);

		if (options.data.length || isObject(options.data)) {
			// Import CSV
			if (options.type === "csv") {
				obj = {
					data: []
				};

				// Split the string into rows
				let rows = options.data.split(options.lineDelimiter);

				if (rows.length) {

				    if (options.headings) {
					    obj.headings = rows[0].split(options.columnDelimiter);

					    rows.shift();
				    }

				    each(rows, function(row, i) {
				        obj.data[i] = [];

					    // Split the rows into values
					    let values = row.split(options.columnDelimiter);

					    if (values.length) {
						    each(values, function(value) {
							    obj.data[i].push(value);
						    });
					    }
				    });
			    }
		    } else if (options.type === "json") {
			    let json = isJson(options.data);

			    // Valid JSON string
			    if (json) {
				    obj = {
					    headings: [],
					    data: []
				    };

				    each(json, function(data, i) {
					    obj.data[i] = [];
					    each(data, function(value, column) {
						    if (obj.headings.indexOf(column) < 0) {
							    obj.headings.push(column);
						    }

						    obj.data[i].push(value);
					    });
				    });
		        } else {
				    throw new Error("That's not valid JSON!");
			    }
		    }

		    if (isObject(options.data)) {
			    obj = options.data;
		    }

		    if (obj) {
			    each(obj.headings, function(heading, i) {
				    that.table.header.cells[i].setContent(heading);
			    });

			    this.rows().add(obj.data);
		    }
		}

		return false;
	}

	setMessage(message) {
		let colspan = 1;

		if (this.rows().count()) {
			colspan = this.columns().count();
		}

		let node = createElement("tr", {
			html: '<td class="tedirtable-empty" colspan="' +
				colspan +
				'">' +
				message +
				"</td>"
		});

		empty(this.table.body);

		this.table.body.appendChild(node);
	}

	columns(select) {
		return new Columns(this, select);
	}

	rows(select) {
		return new Rows(this, select);
	}

	on(event, callback) {
		this.events = this.events || {};
		this.events[event] = this.events[event] || [];
		this.events[event].push(callback);
	}

	off(event, callback) {
		this.events = this.events || {};
		if (event in this.events === false) return;
		this.events[event].splice(this.events[event].indexOf(callback), 1);
	}

	emit(event) {
		this.events = this.events || {};
		if (event in this.events === false) return;
		for (var i = 0; i < this.events[event].length; i++) {
			this.events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}

	destroy() {
        let that = this, o = that.config, table = that.table;

		classList.remove(table.node, o.classes.table);

		each(table.header.cells, function(cell) {
			cell.node.style.width = "";
			classList.remove(cell.node, o.classes.sorter);
		});

		let frag = document.createDocumentFragment();
		empty(table.body);

		each(table.rows, function(row) {
			frag.appendChild(row.node);
		});

		table.body.appendChild(frag);

		this.wrapper.parentNode.replaceChild(table.node, this.wrapper);

		this.rendered = false;
		this.initialised = false;
			
		if(this.config.plugins) {
		    each(this.config.plugins, function(ext) {
				if (that[ext] !== undefined && typeof that[ext] === "function") {
				    if (that[ext].destroy && typeof that[ext].destroy === "function") {
						that[ext].destroy();
					}
				}
			});
		}			
	}
}
