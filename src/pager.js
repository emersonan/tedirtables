// PAGER
import { empty, each, createElement, classList } from './utils.js';
import Cell from './cell.js';
import Row from './row.js';
import Table from './table.js';

export default class Pager {
    constructor(instance, parent) {
        this.instance = instance;
		this.parent = parent;
    }
        
    render(pages) {
	    let that = this, dt = that.instance, o = dt.config;

		pages = pages || dt.totalPages;

		empty(that.parent);

		// No need for pager if we only have one page
		if (pages > 1) {
		    let c = "pager",
				ul = createElement("ul"),
				prev = dt.onFirstPage ? 1 : dt.currentPage - 1,
				next = dt.onlastPage ? pages : dt.currentPage + 1;

	        // first button
		    if (o.firstLast) {
			    ul.appendChild(that.button(o.classes.paginationItem, 1, o.firstText));
		    }

		    // prev button
		    if (o.nextPrev) {
			    ul.appendChild(that.button(o.classes.paginationItem, prev, o.prevText));
		    }

		    var pager = that.truncate();
		    // append the links
		    each(pager, function(btn) {
			    ul.appendChild(btn);
		    });

		    // next button
		    if (o.nextPrev) {
			    ul.appendChild(that.button(o.classes.paginationItem, next, o.nextText));
		    }

		    // first button
		    if (o.firstLast) {
		        ul.appendChild(that.button(o.classes.paginationItem, pages, o.lastText));
		    }
				    
		    ul.classList.add(o.classes.paginationList);

		    that.parent.appendChild(ul);
        }
	}

	truncate() {
	    let that = this,
			o = that.instance.config,
			delta = o.pagerDelta * 2,
			page = that.instance.currentPage,
			left = page - o.pagerDelta,
			right = page + o.pagerDelta,
			pages = that.instance.totalPages,
			range = [],
			pager = [],
			n;

		// No need to truncate if it's disabled
		if (!o.truncatePager) {
			each(pages, function(index) {
				pager.push(that.button(index == page ? o.classes.paginationItem +" active" : o.classes.paginationItem, index, index));
			});
		} else {
			if (page < 4 - o.pagerDelta + delta) {
				right = 3 + delta;
			} else if (page > pages - (3 - o.pagerDelta + delta)) {
				left = pages - (2 + delta);
			}

			// Get the links that will be visible
			for (var i = 1; i <= pages; i++) {
				if (i == 1 || i == pages || (i >= left && i <= right)) {
					range.push(i);
				}
			}

			each(range, function(index) {
				if (n) {
					if (index - n == 2) {
						pager.push(that.button(o.classes.paginationItem, n + 1, n + 1));
					} else if (index - n != 1) {
						// Create ellipsis node
						pager.push(that.button(o.classes.ellipsis, 0, o.ellipsisText, true));
					}
				}

				pager.push(that.button(index == page ? o.classes.paginationItem +" active" : o.classes.paginationItem, index, index));
				n = index;
			});
		}

		return pager;
	}

	button(className, pageNum, content, ellipsis) {
		return createElement("li", {
			class: className,
			html: !ellipsis ? '<a href="#" class="'+this.instance.config.classes.paginationLink+'" data-page="' + pageNum + '">' + content + "</a>" : '<span>' + content + "</span>"
		});
	}
}
