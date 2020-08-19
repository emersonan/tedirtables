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
		
	paginationTheme: {
		list: "tedirtable-pagination-list",
		item: "tedirtable-pagination-item",
		link: "tedirtable-pagination-link"
	},

	search: {
		includeHiddenColumns: false
	},

	classes: {
		top: "tedirtable-top",
		info: "tedirtable-info",
		input: "tedirtable-input",
		table: "tedirtable-table",
		bottom: "tedirtable-bottom",
		search: "tedirtable-search",
		sorter: "tedirtable-sorter",
		wrapper: "tedirtable-wrapper",
		dropdown: "tedirtable-dropdown",
		ellipsis: "tedirtable-ellipsis",
		selector: "tedirtable-selector",
		selectLabel: "tedirtable-select-label",
		container: "tedirtable-container",
		pagination: "tedirtable-pagination",
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
		top: "{select}{search}",
		bottom: "{info}{pager}"
	}
}
