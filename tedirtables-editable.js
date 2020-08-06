// Editable
class Editor {
    /**
    * Default config
    * @type {Object}
    */
    defaults = {
        classes: {
            row: "tedirtable-editor-row",
            form: "tedirtable-editor-form",
            item: "tedirtable-editor-item",
            menu: "tedirtable-editor-menu",
            save: "tedirtable-editor-save",
            block: "tedirtable-editor-block",
            close: "tedirtable-editor-close",
            inner: "tedirtable-editor-inner",
            input: "tedirtable-editor-input",
            label: "tedirtable-editor-label",
            modal: "tedirtable-editor-modal",
            action: "tedirtable-editor-action",
            header: "tedirtable-editor-header",
            wrapper: "tedirtable-editor-wrapper",
			editable: "tedirtable-editor-editable",
            container: "tedirtable-editor-container",
            separator: "tedirtable-editor-separator"
        },

        // include hidden columns in the editor
        hiddenColumns: false,

        // enable th context menu
        contextMenu: true,
					
		clickEvent: "dblclick",

        // set the context menu items
        menuItems: [
            {
                text: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"/><path fill-rule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .5.5H6v-1.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H3z"/></svg> Edit Column',
                action: function(e) {
                    this.editCell();
                }
            },
            {
                text: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg> Edit Row',
                action: function(e) {
                    this.editRow();
                }
            },
            {
                separator: true
            },
            {
                text: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg> Remove Row',
                action: function(e) {
                    if (confirm("Are you sure?")) {
                        this.removeRow();
                    }
                }
            }
        ]
    }

    /**
    * Add event listener to target
    * @param  {Object} el
    * @param  {String} e
    * @param  {Function} fn
    */
    on = (el, e, fn) => el.addEventListener(e, fn, false);

    /**
    * Remove event listener from target
    * @param  {Object} el
    * @param  {String} e
    * @param  {Function} fn
    */
    off = (el, e, fn) => el.removeEventListener(e, fn);

    /**
    * Get the closest matching ancestor
    * @param  {Object}   el         The starting node.
    * @param  {Function} fn         Callback to find matching ancestor.
    * @return {Object|Boolean}      Returns the matching ancestor or false in not found.
    */
    closest = (el, fn) => el && el !== document.body && (fn(el) ? el : this.closest(el.parentNode, fn));

    /**
    * Returns a function, that, as long as it continues to be invoked, will not be triggered.
    * @param  {Function} fn
    * @param  {Number} wait
    * @param  {Boolean} now
    * @return {Function}
    */
    debounce = function(n, t, u) {
        let e;
        return function() {
           let i = this, o = arguments, a = u && !e;
            clearTimeout(e), (e = setTimeout(function() {
                (e = null), u || n.apply(i, o);
            }, t)),
            a && n.apply(i, o);
        }
    }

    constructor(instance, options, utils, target, config) {
        this.instance = instance;
        this.options = options;
        this.utils = utils;
        this.target = target;
        this.config = utils.extend(this.defaults, config);
    }
    
    init() {
	    if ( this.initialised ) return;
					
        let that = this, o = that.config;

        that.utils.classList.add(that.instance.wrapper, o.classes.editable);

        if (o.contextMenu) {

            that.container = that.utils.createElement("div", {
                id: o.classes.container
            });

            that.wrapper = that.utils.createElement("div", {
                class: o.classes.wrapper
            });

            that.menu = that.utils.createElement("ul", {
                class: o.classes.menu
            });

            if (o.menuItems && o.menuItems.length) {
                o.menuItems.forEach(function(item) {
                    let li = that.utils.createElement("li", {
                        class: item.separator ? o.classes.separator : o.classes.item
                    });

                    if (!item.separator) {
                    let a = that.utils.createElement("a", {
                        class: o.classes.action,
                            href: item.url || "#",
                            html: item.text
                        });

                        li.appendChild(a);

                        if (item.action && typeof item.action === "function") {
                            that.on(a, "click", function(e) {
                                e.preventDefault();
                                item.action.call(that, e);
                            });
                        }
                    }

                    that.menu.appendChild(li);
                });
            }

            that.wrapper.appendChild(that.menu);
            that.container.appendChild(that.wrapper);

            that.update();
        }

        that.data = {};
        that.closed = true;
        that.editing = false;
        that.editingRow = false;
        that.editingCell = false;

        that.bindEvents();

        setTimeout(function() {
		    that.initialised = true;
            that.instance.emit("editable.init");
        }, 10);
    }

    /**
    * Bind events to DOM
    * @return {Void}
    */
    bindEvents() {
        var that = this;

        this.events = {
            context: this.context.bind(this),
            update: this.update.bind(this),
            dismiss: this.dismiss.bind(this),
            keydown: this.keydown.bind(this),
            click: this.click.bind(this)
        };

        // listen for click / double-click
        this.on(this.target, this.config.clickEvent, this.events.click);

        // listen for click anywhere but the menu
        this.on(document, "click", this.events.dismiss);

        // listen for right-click
        this.on(document, "keydown", this.events.keydown);

        if (this.config.contextMenu) {
            // listen for right-click
            this.on(this.target, "contextmenu", this.events.context);

            // reset
            this.events.reset = that.debounce(this.events.update, 50);
            that.on(window, "resize", this.events.reset);
            that.on(window, "scroll", this.events.reset);
        }
    }

    /**
    * contextmenu listener
    * @param  {Object} e Event
    * @return {Void}
    */
    context(e) {
        this.event = e;

        let valid = this.target.contains(e.target);

        if (this.config.contextMenu && !this.disabled && valid) {
            e.preventDefault();

            // get the mouse position
            let x = e.pageX;
            let y = e.pageY;

            // check if we're near the right edge of window
            if (x > this.limits.x) {
                x -= this.rect.width;
            }

            // check if we're near the bottom edge of window
            if (y > this.limits.y) {
                y -= this.rect.height;
            }

            this.wrapper.style.top = y + "px";
            this.wrapper.style.left = x + "px";

            this.openMenu();
            this.update();
        }
    }

    /**
    * dblclick listener
    * @param  {Object} e Event
    * @return {Void}
    */
    click(e) {
        if (!this.editing) {
            let cell = this.closest(e.target, function(el) {
                return el.nodeName === "TD";
            });
            if (cell) {
                this.editCell(cell);
                e.preventDefault();
            }
        }
    }

    /**
    * keydown listener
    * @param  {Object} e Event
    * @return {Void}
    */
    keydown(e) {
        if (this.editing && this.data) {
            if (e.keyCode === 13) {
                // Enter key saves
                if (this.editingCell) {
                    this.saveCell();
                } else if (this.editingRow) {
                    this.saveRow();
                }
            } else if (e.keyCode === 27) {
                // Escape key reverts
                this.saveCell(this.data.content);
            }
        }
    }

    /**
    * Edit cell
    * @param  {Object} cell    The HTMLTableCellElement
    * @return {Void}
    */
    editCell(cell) {
        cell = cell || this.closest(this.event.target, function(el) {
            return el.nodeName === "TD";
        });

        if (cell.nodeName !== "TD" || this.editing) return;

        let that = this;
					
		let row = that.instance.table.rows[cell.parentNode.dataIndex];
					
		cell = row.cells[cell.dataIndex];

        that.data = {
            cell: cell,
			content: cell.content,
            input: that.utils.createElement("input", {
                type: "text",
				value: cell.content,
                class: that.config.classes.input,
            })
        }

        cell.node.innerHTML = "";
        cell.node.appendChild(that.data.input);

        setTimeout(function() {
            that.data.input.focus();
            that.data.input.selectionStart = that.data.input.selectionEnd = that.data.input.value.length;
            that.editing = true;
            that.editingCell = true;

            that.closeMenu();
        }, 10);
    }

    /**
    * Save edited cell
    * @param  {Object} row    The HTMLTableCellElement
    * @param  {String} value   Cell content
    * @return {Void}
    */
    saveCell(value, cell) {
        cell = cell || this.data.cell;
        value = value || this.data.input.value;

        let oldData = cell.content;

        // Set the cell content
        cell.setContent(value.trim());

        this.data = {};
        this.editing = this.editingCell = false;

        this.instance.emit("editable.save.cell", value, oldData);
    }

    /**
    * Edit row
    * @param  {Object} cell    The HTMLTableRowElement
    * @return {Void}
    */
    editRow(erow) {
        erow = erow || this.closest(this.event.target, function(el) {
            return el.nodeName === "TR";
        });

        if (erow.nodeName !== "TR" || this.editing) return;

        let that = this, o = that.config, row = that.instance.table.rows[erow.dataIndex];

        let template = [
            "<div class='" + o.classes.inner + "'>",
                "<div class='" + o.classes.header + "'>",
                    "<h4>Editing row</h4>",
                    "<button class='" + o.classes.close + "' type='button' data-editor-close>×</button>",
                " </div>",
                "<div class='" + o.classes.block + "'>",
                    "<form class='" + o.classes.form + "'>",
                        "<div class='" + o.classes.row + "'>",
                            "<button class='" + o.classes.save + "' type='button' data-editor-save>Save</button>",
                        "</div>",
                    "</form>",
                "</div>",
            "</div>",
        ].join("");

        let modal = that.utils.createElement("div", {
            class: o.classes.modal,
            html: template
        });

        let inner = modal.firstElementChild;
        let form = inner.lastElementChild.firstElementChild;

        // Add the inputs for each cell
        [].slice.call(row.cells).forEach(function(cell, i) {
		    if ( !cell.hidden || (cell.hidden && o.hiddenColumns) ) {
				form.insertBefore(that.utils.createElement("div", {
				    class: o.classes.row,
					html: [
						"<div class='tedirtable-editor-row'>",
							"<label class='" + o.classes.label + "'>" + that.instance.table.header.cells[i].content + "</label>",
							"<input class='" + o.classes.input + "' value='" + cell.content + "' type='text'>",
				        "</div>"
					].join("")
				}), form.lastElementChild);
			}
        });

        this.modal = modal;

        this.openModal();

        // Grab the inputs
        var inputs = [].slice.call(form.elements);

        // Remove save button
        inputs.pop();

        that.data = {
            row: row,
            inputs: inputs
        };

        this.editing = true;
        this.editingRow = true;

        // Close / save
        modal.addEventListener("click", function(e) {
            let node = e.target;
            if (node.hasAttribute("data-editor-close")) { // close button
                that.closeModal();
            } else if (node.hasAttribute("data-editor-save")) { // save button
                // Save
                that.saveRow();
            }
        });

        that.closeMenu();
    }

    /**
    * Save edited row
    * @param  {Object} row    The HTMLTableRowElement
    * @param  {Array} data   Cell data
    * @return {Void}
    */
    saveRow(data, row) {
        let that = this, o = that.config;

        data = data || that.data.inputs.map(function(input) {
            return input.value.trim();
        });
        row = row || that.data.row;

        // Store the old data for the emitter
        let oldData = row.cells.map(function(cell) {
            return cell.content;
        });

        row.cells.forEach(function(cell, i) {
            cell.setContent(data[i]);
        });

        this.closeModal();

        that.instance.emit("editable.save.row", data, oldData);
    }

    /**
    * Open the row editor modal
    * @return {Void}
    */
    openModal() {
        if (!this.editing && this.modal) {
            document.body.appendChild(this.modal);
        }
    }

    /**
    * Close the row editor modal
    * @return {Void}
    */
    closeModal() {
        if (this.editing && this.modal) {
            document.body.removeChild(this.modal);
            this.modal = this.editing = this.editingRow = false;
        }
    }

    /**
    * Remove a row
    * @param  {Number|Object} row The HTMLTableRowElement or dataIndex property
    * @return {Void}
    */
    removeRow(row) {
        if (!row) {
            let row = this.closest(this.event.target, function(node) {
                return node.nodeName === "TR";
            });

            if (row && row.dataIndex !== undefined) {
                this.instance.rows().remove(row.dataIndex);
                this.closeMenu();
            }
        } else {
            // User passed a HTMLTableRowElement
            if (row instanceof Element && row.nodeName === "TR" && row.dataIndex !== undefined) {
                row = row.dataIndex;
            }

            this.instance.rows().remove(row);

            this.closeMenu();
        }
    }

    /**
    * Update context menu position
    * @return {Void}
    */
    update() {
        let scrollX = window.scrollX || window.pageXOffset;
        let scrollY = window.scrollY || window.pageYOffset;

        this.rect = this.wrapper.getBoundingClientRect();

        this.limits = {
            x: window.innerWidth + scrollX - this.rect.width,
            y: window.innerHeight + scrollY - this.rect.height
        }
    }

    /**
    * Dismiss the context menu
    * @param  {Object} e Event
    * @return {Void}
    */
    dismiss(e) {
        let valid = true;

        if (this.config.contextMenu) {
            valid = !this.wrapper.contains(e.target);
            if (this.editing) {
                valid = !this.wrapper.contains(e.target) && e.target !== this.data.input;
            }
        }

        if (valid) {
            if (this.editingCell) {
                // Revert
                this.saveCell(this.data.cell.content);
            }
            this.closeMenu();
        }
    }

    /**
    * Open the context menu
    * @return {Void}
    */
    openMenu() {
        if (this.config.contextMenu) {
            document.body.appendChild(this.container);
            this.closed = false;

            this.instance.emit("editable.context.open");
        }
    }

    /**
    * Close the context menu
    * @return {Void}
    */
    closeMenu() {
        if (this.config.contextMenu && !this.closed) {
            this.closed = true;
            document.body.removeChild(this.container);

            this.instance.emit("editable.context.close");
        }
    }

    /**
    * Destroy the instance
    * @return {Void}
    */
    destroy() {
        off(this.target, this.config.clickEvent, this.events.click);
        off(this.target, "contextmenu", this.events.context);

        off(document, "click", this.events.dismiss);
        off(document, "keydown", this.events.keydown);

        off(window, "resize", this.events.reset);
        off(window, "scroll", this.events.reset);
					
		if ( document.body.contains(this.container) ) {
			document.body.removeChild(this.container);
		}
					
		this.initialised = false;
    }

}

// Register the editable
if (window.TedirTable) {
    TedirTable.extend("editable", function(instance, options, utils) {
        return new Editor(instance, options, utils, this.table.body, options);
    });
}
