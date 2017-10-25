'use strict';

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last + " took " + (stop-startTime));
        }, 0);
    }
}

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

class Store {
    constructor() {
        this.data = [];
        this.backup = null;
        this.selected = null;
        this.id = 1;
    }
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }
    updateData(mod = 10) {
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
            // this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label +' !!!'});
        }
    }
    delete(id) {
        const idx = this.data.findIndex(d => d.id==id);
        this.data = this.data.filter((e,i) => i!=idx);
        return this;
    }
    run() {
        this.data = this.buildData();
        this.selected = null;
    }
    add() {
        this.data = this.data.concat(this.buildData(1000));
        this.selected = null;
    }
    update() {
        this.updateData();
        this.selected = null;
    }
    select(id) {
        this.selected = id;
    }
    hideAll() {
        this.backup = this.data;
        this.data = [];
        this.selected = null;
    }
    showAll() {
        this.data = this.backup;
        this.backup = null;
        this.selected = null;
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = null;
    }
    clear() {
        this.data = [];
        this.selected = null;
    }
    swapRows() {
        if(this.data.length > 10) {
            var a = this.data[4];
            this.data[4] = this.data[9];
            this.data[9] = a;
        }
    }
}

var getParentId = function(elem) {
    while (elem) {
        if (elem.tagName==="TR") {
            return elem.data_id;
        }
        elem = elem.parentNode;
    }
    return undefined;
}

class Main {
    constructor(props) {
        this.store = new Store();
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.selectedRow = undefined;

        opr.Toolkit.render('table', document.getElementById('container')).then(table => {
          this.table = table;
        });

        document.getElementById("main").addEventListener('click', e => {
            //console.log("listener",e);
            if (e.target.matches('#add')) {
                e.preventDefault();
                //console.log("add");
                this.add();
            }
            else if (e.target.matches('#run')) {
                e.preventDefault();
                //console.log("run");
                this.run();
            }
            else if (e.target.matches('#update')) {
                e.preventDefault();
                //console.log("update");
                this.update();
            }
            else if (e.target.matches('#hideall')) {
                e.preventDefault();
                //console.log("hideAll");
                this.hideAll();
            }
            else if (e.target.matches('#showall')) {
                e.preventDefault();
                //console.log("showAll");
                this.showAll();
            }
            else if (e.target.matches('#runlots')) {
                e.preventDefault();
                //console.log("runLots");
                this.runLots();
            }
            else if (e.target.matches('#clear')) {
                e.preventDefault();
                //console.log("clear");
                this.clear();
            }
            else if (e.target.matches('#swaprows')) {
                e.preventDefault();
                //console.log("swapRows");
                this.swapRows();
            }
            else if (e.target.matches('.remove')) {
                e.preventDefault();
                let id = getParentId(e.target);
                let idx = this.findIdx(id);
                //console.log("delete",idx);
                this.delete(idx);
            }
            else if (e.target.matches('.lbl')) {
                e.preventDefault();
                let id = getParentId(e.target);
                let idx = this.findIdx(id);
                //console.log("select",idx);
                this.select(idx);
            }
        });
        this.tbody = document.getElementById("tbody");
        this.container = document.getElementById('container');
    }
    findIdx(id) {
        for (let i=0;i<this.store.data.length;i++){
            if (this.store.data[i].id === id) return i;
        }
        return undefined;
    }
    printDuration() {
        stopMeasure();
    }
    async run() {
        startMeasure("run");
        this.store.clear();
        this.store.run();
        this.table.commands.setRows(this.store.data);
        stopMeasure();
    }
    add() {
        startMeasure("add");
        this.store.add();
        this.table.commands.setRows(this.store.data);
        stopMeasure();
    }
    update() {
        startMeasure("update");
        this.store.update();
        this.table.commands.setRows(this.store.data);
        stopMeasure();
    }
    unselect() {
        if (this.selectedRow !== undefined) {
            this.selectedRow.className = "";
            this.selectedRow = undefined;
        }
    }
    select(idx) {
        startMeasure("select");
        this.unselect();
        this.store.select(this.store.data[idx].id);
        this.table.commands.selectRow(idx);
        stopMeasure();
    }
    recreateSelection() {
        let old_selection = this.store.selected;
        let sel_idx = this.store.data.findIndex(d => d.id === old_selection);
        if (sel_idx >= 0) {
            this.store.select(this.data[sel_idx].id);
            this.selectedRow = this.rows[sel_idx];
            this.selectedRow.className = "danger";
        }
    }
    delete(idx) {
        startMeasure("delete");
        this.store.delete(this.store.data[idx].id);
        this.table.commands.setRows(this.store.data);
        stopMeasure();
    }
    runLots() {
        startMeasure("runLots");
        this.store.clear();
        this.store.runLots();
        this.table.commands.setRows(this.store.data);
        stopMeasure();
    }
    clear() {
        startMeasure("clear");
        this.store.clear();
        this.table.commands.setRows([]);
        requestAnimationFrame(() => {
            stopMeasure();
        });
    }    
    swapRows() {
        startMeasure("swapRows");
        if (this.store.data.length>10) {
            this.store.swapRows();
            this.table.commands.setRows(this.store.data);
        }
        stopMeasure();
    }
}

new Main();
