// Filterable
if (window.TedirTable) {
	TedirTable.extend("filterable", function(instance, options, utils) {

		/**
		 * Default config
		 * @type {Object}
		 */
		var defaults = {
			classes: {
				filter: "dt-filter",
				filterable: "dt-filterable",
			}
		};
		
		/**
		 * Get the closest matching ancestor
		 * @param  {Object}   el         The starting node.
		 * @param  {Function} fn         Callback to find matching ancestor.
		 * @return {Object|Boolean}      Returns the matching ancestor or false in not found.
		 */
		var closest = function(el, fn) {
				return el && el !== document.body && (fn(el) ? el : closest(el.parentNode, fn));
		};		

		/**
		 * Main lib
		 * @param {Object} config User config
		 */
		var Filter = function(config) {
			this.config = utils.extend(defaults, config);
		}

		/**
		 * Init instance
		 * @return {Void}
		 */
		Filter.prototype.init = function() {
			
			if ( this.initialised ) return;
			
			var that = this, o = that.config;
			
			that.inputs = [];
			that.row = utils.createElement("tr");
			
			utils.each(instance.table.header.cells, function(cell) {
				that.add({
					index: cell.index
				});
			});
			
			that.row.addEventListener("input", function(e) {
				var input = closest(e.target, function(el) {
					return el.nodeName === "INPUT";
				});
				
				if ( input ) {
					instance.columns().search(input.parentNode.cellIndex, input.value);
				}
			});
			
			instance.table.head.appendChild(that.row);
			
			instance.on("reset", function(columns) {
				utils.each(that.inputs, function(input) {
					input.value = null;
				});
			});			
			
			instance.on("columns.hide", function(columns) {
				utils.each(columns, function(column) {
					that.row.cells[column].style.display = "none";
				});
			});
			
			instance.on("columns.show", function(columns) {
				utils.each(columns, function(column) {
					that.row.cells[column].style.display = "";
				});
			});	
			
			instance.on("columns.order", function(order) {
				var inputs = [], cells = [];
				utils.each(order, function(i) {
					inputs[i] = that.inputs[i];
					cells.push(that.row.cells[i]);
				});
				
				utils.each(cells, function(cell) {
					that.row.appendChild(cell);
				});
				
				that.inputs = inputs;				
			});					
			
			instance.on("columns.add", function() {
				that.add();
			});			
			
			instance.on("columns.remove", function(column) {
				that.row.removeChild(that.row.cells[column]);
				
				that.inputs.splice(column, 1);
			});
			
			this.initialised = true;
		};
		
		Filter.prototype.add = function(config) {
			
			var that = this, o = that.config;
			
			var index = config && config.index !== undefined ? config.index : instance.columns().count() - 1;
			
			var options = utils.extend({
				placeholder: o.placeholders && o.placeholders[index] ? o.placeholders[index] : "Search " + instance.table.header.cells[index].content
			}, config);
			
			
			var td = utils.createElement("td", {
				class: o.classes.filterable
			});
			var input = utils.createElement("input", {
				type: "text",
				class: o.classes.filter,
				placeholder: options.placeholder || ""
			});

			if ( instance.config.fixedColumns ) {
				td.style.width = ((instance.columnWidths[index] / instance.rect.width) * 100) + "%";
			}

			td.appendChild(input)
			that.row.appendChild(td);

			that.inputs.push(input);
		};
		
		Filter.prototype.destroy = function() {
			instance.table.head.removeChild(this.row);
			
			this.initialised = false;
		};

		return new Filter(options);
	});
}
