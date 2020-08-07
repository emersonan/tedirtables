// Bootstrap 5 plugin
class Bootstrap {

    defaults = {
        classes: {
            input: 'form-control',
            select: 'form-select',
            selectlabel: 'align-items-center',
            button: 'btn',
            buttonPrimary: 'btn-primary',
            pagination: 'pagination',
            paginationItem: 'page-item',
            paginationLink: 'page-link',
            flexbox: 'd-flex',
            justifyBetween: 'justify-content-between',
            pagination: 'pagination',
            paginationItem: 'page-item',
            paginationLink: 'page-link',
            dropdown: 'dropdown',
            dropdownMenu: 'dropdown-menu',
            dropdownItem: 'dropdown-item',
            dropdownDivider: 'dropdown-divider'
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
        
        let top = this.getEl(".tedirtable-top");
        if(top) {
            top.classList.add(o.classes.flexbox);
        }
        
        let bottom = this.getEl(".tedirtable-bottom");
        if(bottom) {
            bottom.classList.add(o.classes.flexbox);
        }
        
        let select = this.getEl(".tedirtable-selector");
        if(select) {
            select.classList.add(o.classes.select);
            select.classList.add('mr-2');
            select.style.width = '80px';
        }
        
        let selectlabel = this.getEl(".tedirtable-select-label");
        if(selectlabel) {
            selectlabel.classList.add(o.classes.flexbox);
            selectlabel.classList.add(o.classes.selectlabel);
        }
        
        let input = this.getEl(".tedirtable-input");
        if(input) {
            input.classList.add(o.classes.input);
        }
        
        let pager = this.getEl(".tedirtable-pagination");
        if(pager) {
            pager.classList.remove('tedirtable-pagination');
        }
        
        let filter = this.getEl(".tedirtable-filter");
        if(filter) {
            filter.classList.add(o.classes.input);
        }
        
        let editorMenu = this.getEl(".tedirtable-editor-menu");
        if(editorMenu) {
            editorMenu.classList.add(o.classes.dropdownMenu);
            let editorItem = this.getAll("li", editorMenu);
            if(editorItem.length > 0) {
                editorItem.forEach(item => {
                    if(item.classList.contains('tedirtable-editor-separator')) {
                        item.classList.add(o.classes.dropdownDivider);
                    } else {
                        item.classList.add(o.classes.dropdownItem);
                    }
                })
            }
        }
        
        this.initialised = true;
    }
    
    getEl(elem) {
        return document.querySelector(elem);
    }
    
    getAll(elem, docs = document) {
        return [].slice.call(docs.querySelectorAll(elem));
    }
    
    destroy() {
        if ( this.initialised ) {
            this.initialised = false;
        }
    }
}

// Register the bootstrap 5 plugin
if (window.TedirTable) {
    TedirTable.extend("bootstrap", function(instance, options, utils) {
        return new Bootstrap(instance, options, utils);
    });
}

const bootstrapPagination = {
    list: 'pagination',
    item: 'page-item',
    link: 'page-link'
}
