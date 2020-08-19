/**
* Check is item is object
* @return {Boolean}
*/
const isObject = val => Object.prototype.toString.call(val) === "[object Object]";

/**
* Check is item is array
* @return {Boolean}
*/
const isArray = val => Array.isArray(val);

/**
* Check for valid JSON string
* @param  {String}   str
* @return {Boolean|Array|Object}
*/
const isJson = str => {
    var t = !1;
    try {
		t = JSON.parse(str);
	} catch (e) {
		return !1;
	}
	return !(null === t || (!isArray(t) && !isObject(t))) && t;
};

const isset = (obj, prop) => obj.hasOwnProperty(prop);

/**
* Merge objects (reccursive)
* @param  {Object} r
* @param  {Object} t
* @return {Object}
*/
const extend = (src, props) => {
	for (var prop in props) {
		if (props.hasOwnProperty(prop)) {
			var val = props[prop];
			if (val && isObject(val)) {
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
const each = (arr, fn, scope) => {
	var n;
	if (isObject(arr)) {
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
const createElement = (type, options) => {
    var node = doc.createElement(type);
    if (options && "object" == typeof options) {
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
* Get the closest matching ancestor
* @param  {Object}   el         The starting node.
* @param  {Function} fn         Callback to find matching ancestor.
* @return {Object|Boolean}      Returns the matching ancestor or false in not found.
*/
const closest = (el, fn) => el && el !== body && (fn(el) ? el : closest(el.parentNode, fn));

/**
* Add event listener to target
* @param  {Object} el
* @param  {String} e
* @param  {Function} fn
*/
const on = (el, e, fn) => el.addEventListener(e, fn, false);

/**
* Empty a node
* @param  {Object} el HTMLElement
*/
const empty = el => {
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
const classList = {
	add: (s, a) => {
		if (supports) {
			s.classList.add(a);
		} else {
			if (!classList.contains(s, a)) {
				s.className = s.className.trim() + " " + a;
			}
		}
	},
	remove: (s, a) => {
		if (supports) {
			s.classList.remove(a);
		} else {
			if (classList.contains(s, a)) {
				s.className = s.className.replace(new RegExp("(^|\\s)" + a.split(" ").join("|") + "(\\s|$)", "gi"), " ");
			}
		}
	},
	contains: (s, a) => supports ? s.classList.contains(a) : !!s.className && !!s.className.match(new RegExp("(\\s|^)" + a + "(\\s|$)")),
	toggle: function(t, n, force) {
		n += "";
		let i = this.contains(t, n), o = i ? true !== force && "remove" : false !== force && "add";
		return o && this[o](t, n), true === force || false === force ? force : !i;
	}
};
	
/**
* Utils
* @type {Object}
*/		
const utils = {
	each: each,
	extend: extend,
	isObject: isObject,
	classList: classList,
	createElement: createElement
};

/**
* Parse cell contents for sorting
* @param  {String} content     The datetime string to parse
* @param  {String} format      The format for moment to use
* @return {String|Boolean}     Datatime string or false
*/
const parseDate = (content, format, cell, row) => {
	let date = false;

	if (format && win.moment) {

		// moment() throws a fit if the string isn't a valid datetime string
		// so we need to supply the format to the constructor (https://momentjs.com/docs/#/parsing/string-format/)

		// Converting to YYYYMMDD ensures we can accurately sort the column numerically                 

		switch (format) {
			case "ISO_8601":
				date = moment(content, moment.ISO_8601).format("YYYYMMDD");
				break;
			case "RFC_2822":
				date = moment(content, "ddd, DD MMM YYYY HH:mm:ss ZZ").format("YYYYMMDD");
				break;
			case "MYSQL":
				date = moment(content, "YYYY-MM-DD hh:mm:ss").format("YYYYMMDD");
				break;
			case "UNIX":
				date = moment(parseInt(content, 10)).unix();
				break;
				// User defined format using the data-format attribute or columns[n].format option
			default:
				date = moment(content, format).format("YYYYMMDD");
				break;
		}
	} else {
		date = new Date(content).getTime();
	}

	return date;
};

export {
    isArray,
    isJson,
    isset,
    closest,
    on,
    empty,
    utils,
    parseDate,
    each,
	extend,
	isObject,
	classList,
	createElement
}
	
