// Bootstrap 5 plugin
class Checkable {

    defaults = {
        classes: {
            checkbox: 'tedirtable-checkbox',
            checked: 'tedirtable-checked',
            checkall: 'tedirtable-checkall',
        }
    }
    
    constructor(instance, options, utils) {
        this.instance = instance;
        this.utils = utils;
        this.config = utils.extend(this.defaults, options);
    }
    
    init() {
        if ( this.initialised ) return;
        
        let that = this, o = that.config;
        
        let inputs;
	    let btn = document.getElementById("bulk-delete");

	    let change = function(e) {
		    let input = e.target;

		    if (input.classList.contains(o.classes.checkall)) {
			    for (n = 0; n < inputs.length; n++) {
				    inputs[n].checked = input.checked;

				    inputs[n].parentNode.parentNode.classList.toggle(o.classes.checked, input.checked);
			    }
		    } else {
			    input.parentNode.parentNode.classList.toggle(o.classes.checked, input.checked);
		    }

		    let checked = [].slice.call(that.instance.container.querySelectorAll('input[type=checkbox]'));
		    let count = false;

		    for (n = 0; n < checked.length; n++) {
			    if (checked[n].checked) {
				    count = true;
				    break;
			    }
		    }
            
            if(btn) {
		        btn.classList.toggle("tedirtable-invisible", !count);
		    }
	    };

	    // Remove selected rows
	    let remove = function(e) {
		    let indexes = [];
		    let checked = that.instance.container.querySelectorAll('input[type=checkbox]:checked');

		    if (checked.length) {
			    checked.forEach(function(el, i) {
				    indexes[i] = el.parentNode.parentNode.dataIndex;
			    });
			
			    that.instance.rows().remove(indexes);
                
                if(btn) {
			        btn.classList.add("tedirtable-invisible");
			    }

			    update();
		    }
	    };

	    // Update
	    let update = function() {
		    checkall.checked = false;
		    inputs = [].slice.call(that.instance.container.getElementsByClassName(o.classes.checkbox));
	    };

	    // Check all checkbox
	    let checkall = document.createElement("input");
	    checkall.type = "checkbox";
	    checkall.classList.add(o.classes.checkall)

	    let data = {
		    sortable: false,
		    filterable: false,
		    preheading: checkall.outerHTML,
		    predata: []
	    };

	    // Add a checkbox to each cell
	    for (var n = 0; n < that.instance.table.rows.length; n++) {
		    data.predata[n] = '<input type="checkbox" class="'+o.classes.checkbox+'">';
	    }

	    // Add the new column
	    that.instance.columns().add(data);

	    update();

	    // Remove button
	    if(btn) {
	        btn.addEventListener("click", remove);
	    }

	    // Checkboxes
	    that.instance.container.addEventListener("change", change);

	    // Update
	    that.instance.on("tedirtable.page", update);
	    that.instance.on("tedirtable.perpage", update);
	    that.instance.on("tedirtable.sort", update);
        
        this.initialised = true;
    }
    
    destroy() {
        if ( this.initialised ) {
            this.initialised = false;
        }
    }
}

// Register the checkable plugin
if (window.TedirTable) {
    TedirTable.extend("checkable", function(instance, options, utils) {
        return new Checkable(instance, options, utils);
    });
}

