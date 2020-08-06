// Filterable
class Filter {
    /**
	* Default config
	* @type {Object}
	*/
	defaults = {
		classes: {
			filter: "tedirtable-filter",
			filterable: "tedirtable-filterable",
		}
	};
		
	/**
	* Get the closest matching ancestor
	* @param  {Object}   el         The starting node.
	* @param  {Function} fn         Callback to find matching ancestor.
	* @return {Object|Boolean}      Returns the matching ancestor or false in not found.
	*/
	closest = (el, fn) => el && el !== document.body && (fn(el) ? el : closest(el.parentNode, fn));

    constructor(instance, options, utils, config) {
        this.instance = instance;
        this.options = options;
        this.utils = utils;
        this.config = utils.extend(this.defaults, config);
    }
    
    /**
	* Init instance
	* @return {Void}
	*/
	init() {
		if ( this.initialised ) return;
			
		let that = this, o = that.config;
			
		that.inputs = [];
		that.row = that.utils.createElement("tr");
			
		that.utils.each(that.instance.table.header.cells, function(cell) {
		    that.add({
			    index: cell.index
			});
		});
			
		that.row.addEventListener("input", function(e) {
		    let input = that.closest(e.target, function(el) {
				return el.nodeName === "INPUT";
			});
				
			if ( input ) {
				that.instance.columns().search(input.parentNode.cellIndex, input.value);
			}
		});
			
		that.instance.table.head.appendChild(that.row);
			
		that.instance.on("reset", function(columns) {
			that.utils.each(that.inputs, function(input) {
				input.value = null;
			});
		});			
			
		that.instance.on("columns.hide", function(columns) {
			that.utils.each(columns, function(column) {
				that.row.cells[column].style.display = "none";
			});
		});
			
		that.instance.on("columns.show", function(columns) {
			that.utils.each(columns, function(column) {
				that.row.cells[column].style.display = "";
			});
		});	
			
		that.instance.on("columns.order", function(order) {
			let inputs = [], cells = [];
			that.utils.each(order, function(i) {
				inputs[i] = that.inputs[i];
				cells.push(that.row.cells[i]);
			});
				
			that.utils.each(cells, function(cell) {
				that.row.appendChild(cell);
			});
				
			that.inputs = inputs;				
		});					
			
		that.instance.on("columns.add", function() {
			that.add();
		});			
			
		that.instance.on("columns.remove", function(column) {
			that.row.removeChild(that.row.cells[column]);
				
			that.inputs.splice(column, 1);
		});
			
		this.initialised = true;
	}
		
	add(config) {
		let that = this, o = that.config;
			
		let index = config && config.index !== undefined ? config.index : that.instance.columns().count() - 1;
			
		let options = that.utils.extend({
			placeholder: o.placeholders && o.placeholders[index] ? o.placeholders[index] : "Search " + that.instance.table.header.cells[index].content
		}, config);
			
		let td = that.utils.createElement("td", {
			class: o.classes.filterable
		});
		let input = that.utils.createElement("input", {
			type: "text",
			class: o.classes.filter,
			placeholder: options.placeholder || ""
		});

		if ( that.instance.config.fixedColumns ) {
			td.style.width = ((that.instance.columnWidths[index] / that.instance.rect.width) * 100) + "%";
		}

		td.appendChild(input)
		that.row.appendChild(td);

		that.inputs.push(input);
	}
		
	destroy() {
		this.instance.table.head.removeChild(this.row);
			
		this.initialised = false;
	}
}

// Register the filterable
if (window.TedirTable) {
	TedirTable.extend("filterable", function(instance, options, utils) {
        return new Filter(instance, options, utils, options);
	});
}
