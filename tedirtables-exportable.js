// Exportable
class Exporter {
    /**
    * Default configuration
    * @type {Object}
    */
    defaultConfig = {
        download: true,
        skipColumns: [],

        // csv
        lineDelimiter: "\n",
        columnDelimiter: ",",

        // sql
        tableName: "table",

        // json
        replacer: null,
        space: 4,

        // print
        modal: true
    }

    constructor(instance, options, utils, config) {
        this.instance = instance;
        this.options = options;
        this.utils = utils;
        this.config = utils.extend(this.defaultConfig, config);
    }
    
    /**
    * Initialise instance of Exporter
    * @return {[type]} [description]
    */
    init() {
        if ( !this.initialised ) {
            this.initialised = true;
        }
    }

    /**
    * Export with options
    * @param  {Object} config Export options
    * @return {[type]}        [description]
    */
    export(config) {
        if (config && this.utils.isObject(config)) {
            this.config = this.utils.extend(this.config, config);
        }
        switch (this.config.type.toLowerCase()) {
            case "json":
                this.toJSON();
                break;
            case "sql":
                this.toSQL();
                break;
            case "csv":
                this.toCSV();
                break;
        }
    }

    /**
    * Export to json
    * @param  {Object} config JSON options
    * @return {String}        JSON string
    */
    toJSON(config) {
        if (config && this.utils.isObject(config)) {
            this.config = this.utils.extend(this.config, config);
        }

        this.config.type = "json";

        let str = "", data = [], o = this.config, table = this.instance.table;

        this.utils.each(table.rows, function(row, n) {
            data[n] = data[n] || {};

            this.utils.each(row.cells, function(cell, i) {
                if (!cell.hidden && o.skipColumns.indexOf(cell.index) < 0) {
                    data[n][table.header.cells[cell.index].content] = table.rows[n].cells[cell.index].content;
                }
            })
        });

        // Convert the array of objects to JSON string
        str = JSON.stringify(data, o.replacer, o.space);

        if (o.download) {
            this.string = "data:application/json;charset=utf-8," + str;
            this.download();
        }

        return str;
    }

    /**
    * Export to csv
    * @param  {Object} config CSV options
    * @return {String}        CSV string
    */
    toCSV(config) {
        if (config && this.utils.isObject(config)) {
            this.config = this.utils.extend(this.config, config);
        }

        this.config.type = "csv";

        let str = "", data = [], o = this.config, table = this.instance.table;

        this.utils.each(table.rows, function(row, n) {
            data[n] = data[n] || {};

            this.utils.each(row.cells, function(cell, i) {
                if (!cell.hidden && o.skipColumns.indexOf(cell.index) < 0) {
                    str += cell.content + o.columnDelimiter;
                }
            });

            // Remove trailing column delimiter
            str = str.trim().substring(0, str.length - 1);

            // Apply line delimiter
            str += o.lineDelimiter;
        });

        // Remove trailing line delimiter
        str = str.trim().substring(0, str.length - 1);

        if (o.download) {
            this.string = "data:text/csv;charset=utf-8," + str;
            this.download();
        }

        return str;
    }

    /**
    * Export to sql
    * @param  {Object} config SQL options
    * @return {String}        SQL string
    */
    toSQL(config) {
        if (config && this.utils.isObject(config)) {
            this.config = this.utils.extend(this.config, config);
        }

        this.config.type = "sql";

        let o = this.config, table = this.instance.table;

        // Begin INSERT statement
        var str = "INSERT INTO `" + o.tableName + "` (";

        // Convert table headings to column names
        this.utils.each(table.header.cells, function(cell) {
            if (!cell.hidden && o.skipColumns.indexOf(cell.index) < 0) {
                str += "`" + cell.content + "`,";
            }
        });

        // Remove trailing comma
        str = str.trim().substring(0, str.length - 1);

        // Begin VALUES
        str += ") VALUES ";

        // Iterate rows and convert cell data to column values
        this.utils.each(table.rows, function(row) {
            str += "(";

            this.utils.each(row.cells, function(cell) {
                if (!cell.hidden && o.skipColumns.indexOf(cell.index) < 0) {
                    str += "`" + cell.content + "`,";
                }
            });

            // Remove trailing comma
            str = str.trim().substring(0, str.length - 1);

            // end VALUES
            str += "),";
        });

        // Remove trailing comma
        str = str.trim().substring(0, str.length - 1);

        // Add trailing colon
        str += ";";

        if (o.download) {
            this.string = "data:application/sql;charset=utf-8," + str;
            this.download();
        }

        return str;
    }

    /**
    * Trigger download
    * @param  {String} str The formatted file contents
    * @return {Void}
    */
    download(str) {
        // Download
        if (this.string) {
            // Filename
            let filename = this.config.filename || "TedirTable_export";
            filename += "." + this.config.type;

            this.string = encodeURI(this.string);

            // Create a link to trigger the download
            var link = document.createElement("a");
            link.href = this.string;
            link.download = filename;

            // Append the link
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Remove the link
            document.body.removeChild(link);
        }
    }

    /**
    * Print table
    * @return {Void}
    */
    print(config) {
        if (config && this.utils.isObject(config)) {
            this.config = this.utils.extend(this.config, config);
        }

        let table = document.createElement("table"), thead = document.createElement("thead"), tbody = document.createElement("tbody");

        table.appendChild(thead);
        table.appendChild(tbody);

        this.utils.each(this.instance.table.header.cells, function(cell) {
            thead.appendChild(cell.node.cloneNode(true));
        });

        this.utils.each(this.instance.table.rows, function(row) {
            tbody.appendChild(row.node.cloneNode(true));
        });

        // Open new window
        let w = window.open();

        // Append the table to the body
        w.document.body.appendChild(table);

        if ( this.config.modal ) {
            // Print
            w.focus(); // IE
            w.print();
        }
    }
			
    /**
    * Destroy instance of Exporter
    * @return {[type]} [description]
    */
    destroy() {
        if ( this.initialised ) {
            this.initialised = false;
        }
    }			
}

// Register the exportable
if (window.TedirTable) {
    TedirTable.extend("exportable", function(instance, options, utils) {
        return new Exporter(instance, options, utils, options);
    });
}
