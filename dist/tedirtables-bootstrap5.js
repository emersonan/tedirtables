(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Tedir = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var version = "0.0.1-development-1";

  /**
  * Check is item is object
  * @return {Boolean}
  */
  var isObject$1 = function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
  };
  /**
  * Check is item is array
  * @return {Boolean}
  */


  var isArray = function isArray(val) {
    return Array.isArray(val);
  };
  /**
  * Check for valid JSON string
  * @param  {String}   str
  * @return {Boolean|Array|Object}
  */


  var isJson = function isJson(str) {
    var t = !1;

    try {
      t = JSON.parse(str);
    } catch (e) {
      return !1;
    }

    return !(null === t || !isArray(t) && !isObject$1(t)) && t;
  };

  var isset$1 = function isset(obj, prop) {
    return obj.hasOwnProperty(prop);
  };
  /**
  * Merge objects (reccursive)
  * @param  {Object} r
  * @param  {Object} t
  * @return {Object}
  */


  var extend = function extend(src, props) {
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        var val = props[prop];

        if (val && isObject$1(val)) {
          src[prop] = src[prop] || {};
          extend(src[prop], val);
        } else {
          src[prop] = val;
        }
      }
    }

    return src;
  };
  /**
  * Iterator helper
  * @param  {(Array|Object|Number)}   arr     Any number, object, array or array-like collection.
  * @param  {Function}         fn             Callback
  * @param  {Object}           scope          Change the value of this
  * @return {Void}
  */


  var each = function each(arr, fn, scope) {
    var n;

    if (isObject$1(arr)) {
      for (n in arr) {
        if (Object.prototype.hasOwnProperty.call(arr, n)) {
          fn.call(scope, arr[n], n);
        }
      }
    } else if (isArray(arr)) {
      for (n = 0; n < arr.length; n++) {
        fn.call(scope, arr[n], n);
      }
    } else {
      for (n = 0; n < arr; n++) {
        fn.call(scope, n + 1, n);
      }
    }
  };
  /**
  * Create DOM element node
  * @param  {String}   a nodeName
  * @param  {Object}   b properties and attributes
  * @return {Object}
  */


  var createElement = function createElement(type, options) {
    var node = document.createElement(type);

    if (options && "object" == _typeof(options)) {
      var prop;

      for (prop in options) {
        if ("html" === prop) {
          node.innerHTML = options[prop];
        } else {
          if (prop in node) {
            node[prop] = options[prop];
          } else {
            node.setAttribute(prop, options[prop]);
          }
        }
      }
    }

    return node;
  };
  /**
  * Add event listener to target
  * @param  {Object} el
  * @param  {String} e
  * @param  {Function} fn
  */


  var on = function on(el, e, fn) {
    return el.addEventListener(e, fn, false);
  };
  /**
  * Empty a node
  * @param  {Object} el HTMLElement
  */


  var empty = function empty(el) {
    var IE = !!/(msie|trident)/i.test(navigator.userAgent);

    if (IE) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    } else {
      el.innerHTML = "";
    }
  };
  /**
  * classList shim
  * @type {Object}
  */


  var classList = {
    add: function add(s, a) {
      if ("classList" in document.body) {
        s.classList.add(a);
      } else {
        if (!classList.contains(s, a)) {
          s.className = s.className.trim() + " " + a;
        }
      }
    },
    remove: function remove(s, a) {
      if ("classList" in document.body) {
        s.classList.remove(a);
      } else {
        if (classList.contains(s, a)) {
          s.className = s.className.replace(new RegExp("(^|\\s)" + a.split(" ").join("|") + "(\\s|$)", "gi"), " ");
        }
      }
    },
    contains: function contains(s, a) {
      return "classList" in document.body ? s.classList.contains(a) : !!s.className && !!s.className.match(new RegExp("(\\s|^)" + a + "(\\s|$)"));
    },
    toggle: function toggle(t, n, force) {
      n += "";
      var i = this.contains(t, n),
          o = i ? true !== force && "remove" : false !== force && "add";
      return o && this[o](t, n), true === force || false === force ? force : !i;
    }
  };
  /**
  * Utils
  * @type {Object}
  */

  var utils = {
    each: each,
    extend: extend,
    isObject: isObject$1,
    classList: classList,
    createElement: createElement
  };

  // Cell
  var Cell = /*#__PURE__*/function () {
    function Cell(cell, index) {
      _classCallCheck(this, Cell);

      this.node = cell;
      this.content = this.originalContent = cell.innerHTML;
      this.hidden = false;
      this.index = this.node.dataIndex = index;
      this.originalContent = this.content;
    }

    _createClass(Cell, [{
      key: "setContent",
      value: function setContent(content) {
        this.content = this.node.innerHTML = content;
      }
    }]);

    return Cell;
  }();

  var Row = function Row(row, index) {
    _classCallCheck(this, Row);

    if (isArray(row)) {
      this.node = createElement("tr");
      each(row, function (val, i) {
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

    this.cells = [].slice.call(this.node.cells).map(function (cell, i) {
      return new Cell(cell, i, this);
    }, this);
  };

  var Table = /*#__PURE__*/function () {
    function Table(table, data, dt) {
      _classCallCheck(this, Table);

      this.node = table;

      if (typeof table === "string") {
        this.node = document.querySelector(table);
      }

      if (data) {
        this.build(data);
      }

      this.rows = [].slice.call(this.node.rows).map(function (row, i) {
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
            each(this.header.cells, function (cell) {
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
        var foot = createElement("tfoot");
        foot.appendChild(this.footer.node);
        each(this.footer.cells, function (cell) {
          classList.remove(cell.node, dt.config.classes.sorter);
        });
        this.node.insertBefore(foot, this.body);
      }
    }

    _createClass(Table, [{
      key: "build",
      value: function build(data) {
        var thead = false,
            tbody = false;

        if (data.headings) {
          thead = createElement("thead");
          var tr = createElement("tr");
          each(data.headings, function (col) {
            var td = createElement("th", {
              html: col
            });
            tr.appendChild(td);
          });
          thead.appendChild(tr);
        }

        if (data.data && data.data.length) {
          tbody = createElement("tbody");
          each(data.data, function (rows) {
            var tr = createElement("tr");
            each(rows, function (value) {
              var td = createElement("td", {
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
    }, {
      key: "addHeader",
      value: function addHeader() {
        var th = createElement("thead"),
            tr = createElement("tr");
        each(this.rows[0].cells, function (cell) {
          tr.appendChild(createElement("td"));
        });
        th.appendChild(tr);
        this.head = th;
        this.header = new Row(tr, 1);
        this.hasHeader = true;
      }
    }, {
      key: "addRow",
      value: function addRow(row, at, update) {
        if (row instanceof Row) {
          this.rows.splice(at || 0, 0, row); // We may have a table without a header

          if (!this.hasHeader) {
            this.addHeader();
          }

          if (update) {
            this.update();
          }

          return row;
        }
      }
    }, {
      key: "removeRow",
      value: function removeRow(row, update) {
        if (row instanceof Row) {
          this.rows.splice(this.rows.indexOf(row), 1);

          if (update) {
            this.update();
          }
        }
      }
    }, {
      key: "update",
      value: function update(all) {
        each(this.rows, function (row, i) {
          row.index = row.node.dataIndex = i;
        });
      }
    }]);

    return Table;
  }();

  var Pager = /*#__PURE__*/function () {
    function Pager(instance, parent) {
      _classCallCheck(this, Pager);

      this.instance = instance;
      this.parent = parent;
    }

    _createClass(Pager, [{
      key: "render",
      value: function render(pages) {
        var that = this,
            dt = that.instance,
            o = dt.config;
        pages = pages || dt.totalPages;
        empty(that.parent); // No need for pager if we only have one page

        if (pages > 1) {
          var ul = createElement("ul"),
              prev = dt.onFirstPage ? 1 : dt.currentPage - 1,
              next = dt.onlastPage ? pages : dt.currentPage + 1; // first button

          if (o.firstLast) {
            ul.appendChild(that.button(o.classes.paginationItem, 1, o.firstText));
          } // prev button


          if (o.nextPrev) {
            ul.appendChild(that.button(o.classes.paginationItem, prev, o.prevText));
          }

          var pager = that.truncate(); // append the links

          each(pager, function (btn) {
            ul.appendChild(btn);
          }); // next button

          if (o.nextPrev) {
            ul.appendChild(that.button(o.classes.paginationItem, next, o.nextText));
          } // first button


          if (o.firstLast) {
            ul.appendChild(that.button(o.classes.paginationItem, pages, o.lastText));
          }

          ul.classList.add(o.classes.paginationList);
          that.parent.appendChild(ul);
        }
      }
    }, {
      key: "truncate",
      value: function truncate() {
        var that = this,
            o = that.instance.config,
            delta = o.pagerDelta * 2,
            page = that.instance.currentPage,
            left = page - o.pagerDelta,
            right = page + o.pagerDelta,
            pages = that.instance.totalPages,
            range = [],
            pager = [],
            n; // No need to truncate if it's disabled

        if (!o.truncatePager) {
          each(pages, function (index) {
            pager.push(that.button(index == page ? o.classes.paginationItem + " active" : o.classes.paginationItem, index, index));
          });
        } else {
          if (page < 4 - o.pagerDelta + delta) {
            right = 3 + delta;
          } else if (page > pages - (3 - o.pagerDelta + delta)) {
            left = pages - (2 + delta);
          } // Get the links that will be visible


          for (var i = 1; i <= pages; i++) {
            if (i == 1 || i == pages || i >= left && i <= right) {
              range.push(i);
            }
          }

          each(range, function (index) {
            if (n) {
              if (index - n == 2) {
                pager.push(that.button(o.classes.paginationItem, n + 1, n + 1));
              } else if (index - n != 1) {
                // Create ellipsis node
                pager.push(that.button(o.classes.ellipsis, 0, o.ellipsisText, true));
              }
            }

            pager.push(that.button(index == page ? o.classes.paginationItem + " active" : o.classes.paginationItem, index, index));
            n = index;
          });
        }

        return pager;
      }
    }, {
      key: "button",
      value: function button(className, pageNum, content, ellipsis) {
        return createElement("li", {
          "class": className,
          html: !ellipsis ? '<a href="#" class="' + this.instance.config.classes.paginationLink + '" data-page="' + pageNum + '">' + content + "</a>" : '<span>' + content + "</span>"
        });
      }
    }]);

    return Pager;
  }();

  var Columns = /*#__PURE__*/function () {
    function Columns(instance, select) {
      _classCallCheck(this, Columns);

      this.instance = instance;

      if (select !== undefined) {
        if (!isNaN(select)) {
          this.select = [select];
        } else if (isArray(select)) {
          this.select = select;
        }
      } else {
        this.select = instance.table.header.cells.map(function (cell) {
          return cell.index;
        });
      }
    }

    _createClass(Columns, [{
      key: "init",
      value: function init() {}
    }, {
      key: "count",
      value: function count() {
        return this.instance.table.header.cells.length;
      }
    }, {
      key: "sort",
      value: function sort(column, direction) {
        var dt = this.instance;
        column = column || 0;
        direction = direction || (dt.lastDirection && "asc" === dt.lastDirection ? direction = "desc" : direction = "asc");

        if (column < 0 || column > dt.table.header.cells.length - 1) {
          return false;
        }

        var node = dt.table.header.cells[column].node,
            rows = dt.table.rows;

        if (dt.searching && dt.searchData) {
          rows = dt.searchData;
        } // Remove class from previus column


        if (dt.lastHeading) {
          classList.remove(dt.lastHeading, dt.lastDirection);
        }

        if (dt.lastDirection) {
          classList.remove(node, dt.lastDirection);
        }

        classList.add(node, direction);
        var format, datetime;

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

        rows.sort(function (a, b) {
          var ca = a.cells[column].content;
          var cb = b.cells[column].content;

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
    }, {
      key: "search",
      value: function search(column, query) {
        this.instance.search(query, column);
      }
    }, {
      key: "order",
      value: function order(_order) {
        var dt = this.instance;

        if (isArray(_order)) {
          // Check for erroneous indexes
          for (var n = 0; n < _order.length; n++) {
            if (_order[n] >= dt.columns().count()) {
              throw new Error("Column index " + _order[n] + " is outside the range of columns.");
            }
          }

          var reorder = function reorder(node) {
            var arr = [];
            each(_order, function (column, i) {
              arr[i] = node.cells[column];
              arr[i].index = arr[i].node.dataIndex = i;
              node.node.appendChild(arr[i].node);
            });
            node.cells = arr;
          }; // Reorder the header


          if (dt.table.hasHeader) {
            reorder(dt.table.header);
          } // Reorder the footer


          if (dt.table.hasFooter) {
            reorder(dt.table.footer);
          } // Reorder the rows


          each(dt.table.rows, function (row) {
            reorder(row);
          });
          dt.update();
          dt.emit("columns.order", _order);
        }
      }
    }, {
      key: "hide",
      value: function hide() {
        var dt = this.instance,
            head = dt.table.header,
            rows = dt.table.rows;
        each(this.select, function (column) {
          each(head.cells, function (cell) {
            if (column == cell.index) {
              cell.hidden = true;
            }
          });
          each(rows, function (row) {
            each(row.cells, function (cell) {
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
    }, {
      key: "show",
      value: function show() {
        var dt = this.instance,
            head = dt.table.header,
            rows = dt.table.rows;
        each(this.select, function (column) {
          each(head.cells, function (cell) {
            if (column == cell.index) {
              cell.hidden = false;
            }
          });
          each(rows, function (row) {
            each(row.cells, function (cell) {
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
    }, {
      key: "visible",
      value: function visible() {
        var dt = this.instance,
            head = dt.table.header,
            cols = [];
        each(this.select, function (column) {
          cols.push(!head.cells[column].hidden);
        });
        return cols;
      }
    }, {
      key: "add",
      value: function add(obj) {
        var dt = this.instance;

        if (isObject(obj)) {
          if (isset(obj, "heading")) {
            var cell = new Cell(createElement("th"), dt.columns().count());
            cell.setContent(obj.heading);
            dt.table.header.node.appendChild(cell.node);
            dt.table.header.cells.push(cell);
          }

          if (isset(obj, "data") && isArray(obj.data)) {
            each(dt.table.rows, function (row, i) {
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
            each(dt.table.rows, function (row, i) {
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
    }, {
      key: "remove",
      value: function remove(select, hold) {
        var dt = this.instance,
            table = dt.table,
            head = table.header;

        if (isArray(select)) {
          // Remove in reverse otherwise the indexes will be incorrect
          select.sort(function (a, b) {
            return b - a;
          });
          each(select, function (column, i) {
            this.remove(column, i < select.length - 1);
          }, this);
          return;
        } else {
          head.node.removeChild(head.cells[select].node);
          head.cells.splice(select, 1);
          each(table.rows, function (row) {
            row.node.removeChild(row.cells[select].node);
            row.cells.splice(select, 1);
          });
        }

        if (!hold) {
          each(head.cells, function (cell, i) {
            cell.index = cell.node.dataIndex = i;
          });
          each(table.rows, function (row) {
            each(row.cells, function (cell, i) {
              cell.index = cell.node.dataIndex = i;
            });
          });
          this.fix(true);
          dt.update();
        }

        dt.emit("columns.remove", select);
      }
    }, {
      key: "fix",
      value: function fix(update) {
        var dt = this.instance,
            table = dt.table,
            head = table.header;

        if (update) {
          if (table.hasHeader && dt.config.fixedColumns) {
            dt.columnWidths = head.cells.map(function (cell) {
              return cell.node.offsetWidth;
            });
          }
        }

        each(dt.columnWidths, function (size, cell) {
          head.cells[cell].node.style.width = size / dt.rect.width * 100 + "%";
        });
      }
    }, {
      key: "cells",
      value: function cells() {
        var that = this,
            columns = [];

        if (this.select.length == 1) {
          this.select = this.select[0];
        }

        each(this.instance.table.rows, function (row, i) {
          if (isArray(that.select)) {
            columns[i] = [];
          }

          each(row.cells, function (cell) {
            if (isArray(that.select) && that.select.indexOf(cell.index) >= 0) {
              columns[i].push(cell);
            } else if (that.select == cell.index) {
              columns.push(cell);
            }
          });
        });
        return columns;
      }
    }]);

    return Columns;
  }();

  var Rows = /*#__PURE__*/function () {
    function Rows(instance, select) {
      _classCallCheck(this, Rows);

      this.instance = instance;

      if (select !== undefined) {
        if (!isNaN(select)) {
          this.select = [select];
        } else if (isArray(select)) {
          this.select = select;
        }
      } else {
        this.select = instance.table.rows.map(function (row) {
          return row.index;
        });
      }
    }

    _createClass(Rows, [{
      key: "init",
      value: function init() {}
    }, {
      key: "count",
      value: function count() {
        return this.instance.table.rows.length;
      }
    }, {
      key: "render",
      value: function render(page) {
        var that = this,
            dt = that.instance;
        page = page || dt.currentPage;
        empty(dt.table.body);
        if (page < 1 || page > dt.totalPages) return;
        var head = dt.table.header,
            fragment = document.createDocumentFragment();

        if (dt.table.hasHeader) {
          empty(head.node);
          each(head.cells, function (cell) {
            if (!cell.hidden) {
              head.node.appendChild(cell.node);
            }
          });
        }

        if (dt.pages.length) {
          each(dt.pages[page - 1], function (row) {
            empty(row.node);
            each(row.cells, function (cell) {
              if (!cell.hidden) {
                row.node.appendChild(cell.node);
              }
            });
            fragment.append(row.node);
          });
        }

        dt.table.body.appendChild(fragment);
        each(dt.pagers, function (pager) {
          pager.render();
        });
        dt.getInfo();

        if (dt.currentPage == 1) {
          dt.fixHeight();
        }

        dt.emit("rows.render");
      }
    }, {
      key: "paginate",
      value: function paginate() {
        var o = this.instance.config,
            rows = this.instance.table.rows,
            dt = this.instance;

        if (dt.searching && dt.searchData) {
          rows = dt.searchData;
        }

        dt.pages = rows.map(function (tr, i) {
          return i % o.perPage === 0 ? rows.slice(i, i + o.perPage) : null;
        }).filter(function (page) {
          return page;
        });
        dt.totalPages = dt.pages.length; // Current page maybe outside the range

        if (dt.currentPage > dt.totalPages) {
          dt.currentPage = dt.totalPages;
        }
      }
    }, {
      key: "add",
      value: function add(row, at) {
        if (isArray(row)) {
          at = at || 0;

          if (isArray(row[0])) {
            each(row, function (tr) {
              tr = this.instance.table.addRow(new Row(tr, this.instance.columns().count() + 1), at);
            }, this); // only update after adding multiple rows
            // to keep performance hit to a minimum

            this.instance.table.update();
          } else {
            row = this.instance.table.addRow(new Row(row, this.instance.columns().count() + 1), at, true);
          }

          this.instance.update();
          return row;
        }
      }
    }, {
      key: "remove",
      value: function remove(obj) {
        var row = false,
            dt = this.instance;

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
    }, {
      key: "cells",
      value: function cells() {
        var that = this,
            rows = [];

        if (this.select.length == 1) {
          this.select = this.select[0];
        }

        each(this.instance.table.rows, function (row) {
          if (isArray(that.select) && that.select.indexOf(row.index) >= 0 || that.select == row.index) {
            rows.push(row.cells);
          }
        });
        return rows;
      }
    }, {
      key: "get",
      value: function get(row) {
        var rows = this.instance.table.rows;

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
    }]);

    return Rows;
  }();

  var defaultConfig = {
    perPage: 10,
    perPageSelect: [5, 10, 15, 20, 25],
    sortable: true,
    searchable: true,
    // Pagination
    nextPrev: true,
    firstLast: false,
    prevText: "&lsaquo;",
    nextText: "&rsaquo;",
    firstText: "&laquo;",
    lastText: "&raquo;",
    ellipsisText: "&hellip;",
    truncatePager: true,
    pagerDelta: 2,
    fixedColumns: true,
    fixedHeight: false,
    header: true,
    footer: false,
    search: {
      includeHiddenColumns: false
    },
    toolbar: null,
    statusbar: null,
    classes: {
      topbar: "topbar",
      bottombar: "bottombar",
      grid: "d-flex justify-content-between my-2",
      info: "tedirtable-info",
      input: "tedirtable-input",
      table: "tedirtable-table",
      search: "tedirtable-search",
      sorter: "tedirtable-sorter",
      wrapper: "tedirtable-wrapper",
      dropdown: "tedirtable-dropdown",
      ellipsis: "tedirtable-ellipsis",
      selector: "tedirtable-selector",
      selectLabel: "tedirtable-select-label",
      container: "tedirtable-container",
      pagination: "pager",
      paginationList: "pagination",
      paginationItem: "page-item",
      paginationLink: "page-link"
    },
    // Customise the display text
    labels: {
      placeholder: "Search...",
      // The search input placeholder
      perPage: "{select} entries per page",
      // per-page dropdown label
      noRows: "No entries found",
      // Message shown when there are no search results
      info: "Showing {start} to {end} of {rows} entries" //

    },
    // Customise the layout
    layout: {
      topLeft: "{select}",
      topRight: "{search}",
      bottomLeft: "{info}",
      bottomRight: "{pager}"
    }
  };

  var DataTable = /*#__PURE__*/function () {
    function DataTable(table, config) {
      _classCallCheck(this, DataTable);

      console.log('version ' + version);
      this.config = extend(defaultConfig, config);

      if (this.config.ajax) {
        var that = this,
            ajax = this.config.ajax;
        this.request = new XMLHttpRequest();
        on(this.request, "load", function (xhr) {
          if (that.request.readyState === 4) {
            if (that.request.status === 200) {
              var obj = {};
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

    _createClass(DataTable, [{
      key: "init",
      value: function init() {
        if (this.initialised) return;
        var that = this,
            o = that.config;
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
          each(o.plugins, function (options, plugin) {
            if (that[plugin] !== undefined && typeof that[plugin] === "function") {
              that[plugin] = that[plugin](that, options, utils); // Init plugin

              if (options.enabled && that[plugin].init && typeof that[plugin].init === "function") {
                that[plugin].init();
              }
            }
          });
        } // Check for the columns option


        if (o.columns) {
          var selectedColumns = [];
          var columnRenderers = [];
          each(o.columns, function (data) {
            // convert single column selection to array
            if (!isArray(data.select)) {
              data.select = [data.select];
            }

            if (isset$1(data, "render") && typeof data.render === "function") {
              selectedColumns = selectedColumns.concat(data.select);
              columnRenderers.push({
                columns: data.select,
                renderer: data.render
              });
            } // Add the data attributes to the th elements


            if (that.table.hasHeader) {
              each(data.select, function (column) {
                var cell = that.table.header.cells[column];

                if (data.type) {
                  cell.node.setAttribute("data-type", data.type);
                }

                if (data.format) {
                  cell.node.setAttribute("data-format", data.format);
                }

                if (isset$1(data, "sortable")) {
                  cell.node.setAttribute("data-sortable", data.sortable);

                  if (data.sortable === false) {
                    classList.remove(cell.node, o.classes.sorter);
                  }
                }

                if (isset$1(data, "hidden")) {
                  if (data.hidden !== false) {
                    that.columns().hide(column);
                  }
                }

                if (isset$1(data, "sort") && data.select.length === 1) {
                  that.columns().sort(data.select[0], data.sort);
                }
              });
            }
          });

          if (selectedColumns.length) {
            each(that.table.rows, function (row) {
              each(row.cells, function (cell) {
                if (selectedColumns.indexOf(cell.index) >= 0) {
                  each(columnRenderers, function (obj) {
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
        setTimeout(function () {
          that.emit("init");
        }, 10);
      }
    }, {
      key: "setClasses",
      value: function setClasses() {
        classList.toggle(this.wrapper, "tedirtable-sortable", this.sortable);
        classList.toggle(this.wrapper, "tedirtable-searchable", this.searchable);
      }
    }, {
      key: "extend",
      value: function extend() {
        var that = this;

        if (that.config.plugins) {
          each(that.config.plugins, function (ext) {
            if (that[ext] !== undefined && typeof that[ext] === "function") {
              that[ext] = that[ext](that, that.config[ext], utils); // Init extension

              if (that[ext].init && typeof that[ext].init === "function") {
                that[ext].init();
              }
            }
          });
        }
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        var that = this,
            o = that.config;
        on(that.wrapper, "mousedown", function (e) {
          if (e.which === 1 && that.sortable && e.target.nodeName === "TH") {
            classList.add(e.target, "loading");
          }
        });
        on(that.wrapper, "click", function (e) {
          var node = e.target;

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
          on(that.wrapper, "change", function (e) {
            var node = e.target;

            if (node.nodeName === "SELECT" && classList.contains(node, o.classes.selector)) {
              e.preventDefault();
              that.setPerPage(node.value);
            }
          });
        }

        if (that.searchable) {
          on(that.wrapper, "keyup", function (e) {
            if (e.target.nodeName === "INPUT" && classList.contains(e.target, o.classes.input)) {
              e.preventDefault();
              that.search(e.target.value);
            }
          });
        }

        if (that.sortable) {
          on(that.wrapper, "mousedown", function (e) {
            if (e.target.nodeName === "TH") {
              e.preventDefault();
            }
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        if (this.rendered) return;
        var that = this,
            o = that.config;

        if (this.table.hasHeader && o.fixedColumns && o.header) {
          this.columnWidths = this.table.header.cells.map(function (cell) {
            return cell.node.offsetWidth;
          });
        } // Build


        that.wrapper = createElement("div", {
          "class": o.classes.wrapper
        }); // Template for custom layouts

        var inner = ["<div class='", o.classes.topbar, " ", o.classes.grid, "'>", o.layout.topLeft, o.layout.topRight, "</div>", "<div class='", o.classes.container, "'></div>", "<div class='", o.classes.bottombar, " ", o.classes.grid, "'>", o.layout.bottomLeft, o.layout.bottomRight, "</div>"].join(""); // Toolbar placement

        if (o.toolbar != null) {
          inner = inner.replace("{toolbar}", document.querySelector(o.toolbar).outerHTML);
        } // Statusbar placement


        if (o.statusbar != null) {
          inner = inner.replace("{statusbar}", document.querySelector(o.statusbar).outerHTML);
        } // Info placement


        inner = inner.replace("{info}", "<div class='" + o.classes.info + "'></div>"); // Per Page Select

        if (o.perPageSelect) {
          var wrap = ["<div class='", o.classes.dropdown, "'>", "<label class='", o.classes.selectLabel, "'>", o.labels.perPage, "</label>", "</div>"].join(""); // Create the select

          var select = createElement("select", {
            "class": o.classes.selector
          }); // Create the options

          each(o.perPageSelect, function (val) {
            var selected = val === o.perPage;
            var option = new Option(val, val, selected, selected);
            select.add(option);
          }); // Custom label

          wrap = wrap.replace("{select}", select.outerHTML); // Selector placement

          inner = inner.replace(/\{select\}/g, wrap);
        } else {
          inner = inner.replace(/\{select\}/g, "");
        } // Searchable


        if (that.searchable) {
          var form = ["<div class='", o.classes.search, "'>", "<input class='", o.classes.input, "' placeholder='", o.labels.placeholder, "' type='text'>", "</div>"].join(""); // Search input placement

          inner = inner.replace(/\{search\}/g, form);
        } else {
          inner = inner.replace(/\{search\}/g, "");
        } // Add table class


        that.table.node.classList.add(o.classes.table); // Pagers

        each(inner.match(/\{pager\}/g), function (pager, i) {
          inner = inner.replace("{pager}", createElement("div", {
            "class": o.classes.pagination
          }).outerHTML);
        });
        that.wrapper.innerHTML = inner;
        that.pagers = [].slice.call(that.wrapper.querySelectorAll("." + o.classes.pagination));
        each(that.pagers, function (pager, i) {
          that.pagers[i] = new Pager(that, pager);
        });
        that.container = that.wrapper.querySelector("." + o.classes.container);
        that.labels = that.wrapper.querySelectorAll("." + o.classes.info);
        that.inputs = that.wrapper.querySelectorAll("." + o.classes.input);
        that.selectors = that.wrapper.querySelectorAll("." + o.classes.selector); // Insert in to DOM tree

        that.table.node.parentNode.replaceChild(that.wrapper, that.table.node);
        that.container.appendChild(that.table.node); // Store the table dimensions

        that.rect = that.table.node.getBoundingClientRect();
        that.rendered = true;
      }
    }, {
      key: "update",
      value: function update() {
        this.rows().paginate();
        this.rows().render();
        this.emit("update");
      }
    }, {
      key: "fixHeight",
      value: function fixHeight() {
        this.container.style.height = null;

        if (this.config.fixedHeight != false) {
          this.rect = this.container.getBoundingClientRect();
          this.container.style.height = this.rect.height + "px";
        }
      }
    }, {
      key: "getInfo",
      value: function getInfo() {
        // Update the info
        var current = 0,
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
          var string = this.config.labels.info.replace("{start}", f).replace("{end}", t).replace("{page}", this.currentPage).replace("{pages}", this.totalPages).replace("{rows}", items);
          each([].slice.call(this.labels), function (label) {
            label.innerHTML = items ? string : "";
          });
        }
      }
    }, {
      key: "search",
      value: function search(query, column) {
        var that = this;
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

        each(that.table.rows, function (row) {
          var inArray = that.searchData.indexOf(row) >= 0; // Filter column

          if (column !== undefined) {
            each(row.cells, function (cell) {
              if (column !== undefined && cell.index == column && !inArray) {
                if (cell.content.toLowerCase().indexOf(query) >= 0) {
                  that.searchData.push(row);
                }
              }
            });
          } else {
            // https://github.com/Mobius1/Vanilla-TedirTables/issues/12
            var match = query.split(" ").reduce(function (bool, word) {
              var includes = false;

              for (var x = 0; x < row.cells.length; x++) {
                if (row.cells[x].content.toLowerCase().indexOf(word) >= 0) {
                  if (!row.cells[x].hidden || row.cells[x].hidden && that.config.search.includeHiddenColumns) {
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
    }, {
      key: "page",
      value: function page(_page) {
        // We don't want to load the current page again.
        if (_page == this.currentPage) {
          return false;
        }

        if (!isNaN(_page)) {
          this.currentPage = parseInt(_page, 10);
        }

        this.onFirstPage = this.currentPage === 1;
        this.onLastPage = this.currentPage === this.totalPages;

        if (_page > this.totalPages || _page < 0) {
          return false;
        }

        this.rows().render(parseInt(_page, 10));
        this.emit("page", _page);
      }
    }, {
      key: "reset",
      value: function reset() {

        if (this.searching) {
          this.searching = this.searchData = false;
          classList.remove(this.wrapper, "search-results");
        }

        each([].slice.call(this.inputs), function (input) {
          input.value = null;
          input.blur();
        });
        this.update();
        this.emit("reset");
      }
    }, {
      key: "set",
      value: function set(prop, val) {
        if (this.hasOwnProperty(prop)) {
          this[prop] = val;
          classList.toggle(this.wrapper, "tedirtable-" + prop, this[prop]);
          this.update();
        }
      }
    }, {
      key: "setPerPage",
      value: function setPerPage(value) {
        if (!isNaN(value)) {
          value = parseInt(value, 10);
          this.config.perPage = value;
          this.fixHeight();

          if (this.config.perPageSelect.indexOf(value) >= 0) {
            each([].slice.call(this.selectors), function (select) {
              select.value = value;
            });
          }

          this.update();
          this.emit("perpage", value);
        }
      }
    }, {
      key: "import",
      value: function _import(options) {
        var that = this,
            obj = false;
        var defaults = {
          // csv
          lineDelimiter: "\n",
          columnDelimiter: ","
        }; // Check for the options object

        if (!isObject$1(options)) {
          return false;
        }

        options = extend(defaults, options);

        if (options.data.length || isObject$1(options.data)) {
          // Import CSV
          if (options.type === "csv") {
            obj = {
              data: []
            }; // Split the string into rows

            var rows = options.data.split(options.lineDelimiter);

            if (rows.length) {
              if (options.headings) {
                obj.headings = rows[0].split(options.columnDelimiter);
                rows.shift();
              }

              each(rows, function (row, i) {
                obj.data[i] = []; // Split the rows into values

                var values = row.split(options.columnDelimiter);

                if (values.length) {
                  each(values, function (value) {
                    obj.data[i].push(value);
                  });
                }
              });
            }
          } else if (options.type === "json") {
            var json = isJson(options.data); // Valid JSON string

            if (json) {
              obj = {
                headings: [],
                data: []
              };
              each(json, function (data, i) {
                obj.data[i] = [];
                each(data, function (value, column) {
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

          if (isObject$1(options.data)) {
            obj = options.data;
          }

          if (obj) {
            each(obj.headings, function (heading, i) {
              that.table.header.cells[i].setContent(heading);
            });
            this.rows().add(obj.data);
          }
        }

        return false;
      }
    }, {
      key: "setMessage",
      value: function setMessage(message) {
        var colspan = 1;

        if (this.rows().count()) {
          colspan = this.columns().count();
        }

        var node = createElement("tr", {
          html: '<td class="tedirtable-empty" colspan="' + colspan + '">' + message + "</td>"
        });
        empty(this.table.body);
        this.table.body.appendChild(node);
      }
    }, {
      key: "columns",
      value: function columns(select) {
        return new Columns(this, select);
      }
    }, {
      key: "rows",
      value: function rows(select) {
        return new Rows(this, select);
      }
    }, {
      key: "on",
      value: function on(event, callback) {
        this.events = this.events || {};
        this.events[event] = this.events[event] || [];
        this.events[event].push(callback);
      }
    }, {
      key: "off",
      value: function off(event, callback) {
        this.events = this.events || {};
        if (event in this.events === false) return;
        this.events[event].splice(this.events[event].indexOf(callback), 1);
      }
    }, {
      key: "emit",
      value: function emit(event) {
        this.events = this.events || {};
        if (event in this.events === false) return;

        for (var i = 0; i < this.events[event].length; i++) {
          this.events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var that = this,
            o = that.config,
            table = that.table;
        classList.remove(table.node, o.classes.table);
        each(table.header.cells, function (cell) {
          cell.node.style.width = "";
          classList.remove(cell.node, o.classes.sorter);
        });
        var frag = document.createDocumentFragment();
        empty(table.body);
        each(table.rows, function (row) {
          frag.appendChild(row.node);
        });
        table.body.appendChild(frag);
        this.wrapper.parentNode.replaceChild(table.node, this.wrapper);
        this.rendered = false;
        this.initialised = false;

        if (this.config.plugins) {
          each(this.config.plugins, function (ext) {
            if (that[ext] !== undefined && typeof that[ext] === "function") {
              if (that[ext].destroy && typeof that[ext].destroy === "function") {
                that[ext].destroy();
              }
            }
          });
        }
      }
    }]);

    return DataTable;
  }();

  exports.DataTable = DataTable;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
