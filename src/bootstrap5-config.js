export default {
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
		placeholder: "Search...", // The search input placeholder
		perPage: "{select} entries per page", // per-page dropdown label
		noRows: "No entries found", // Message shown when there are no search results
		info: "Showing {start} to {end} of {rows} entries" //
	},

	// Customise the layout
	layout: {
		topLeft: "{select}",
		topRight: "{search}",
		bottomLeft: "{info}",
		bottomRight: "{pager}"
	}
}
