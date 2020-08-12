// Cell
export default class Cell {
    constructor(cell, index) {
	    this.node = cell;
		this.content = this.originalContent = cell.innerHTML;
		this.hidden = false;
		this.index = this.node.dataIndex = index;
		this.originalContent = this.content;
	}
	    
	setContent(content) {
	    this.content = this.node.innerHTML = content;
	}
}
