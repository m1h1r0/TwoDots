function Dot(row, col, color) {
    this.Row = row;
    this.Col = col;
    this.Color = color;
    this.UIElem = null;
}

Dot.prototype.mousedown = function () {
    amplify.publish("InitDotSelected", this);

};

Dot.prototype.activate = function () {
    this.UIElem
        .on('mouseenter', this.mouseenter.bind(this));
};

Dot.prototype.deactivate = function () {
    this.UIElem
        .on('mouseenter', null);
};

Dot.prototype.mouseenter = function () {
    amplify.publish("DotEntered", this);
};

Dot.prototype.draw = function (canvas) {
    if (!this.UIElem) {
        var uiDot = canvas
            .append("circle")
            .datum(this)
            .attr('cx', renderCX)
            .attr('cy', renderCY)
            .attr('r', 10)
            .style('fill', function (d) { return d.Color; })
            .on('mousedown', this.mousedown.bind(this));
        this.UIElem = uiDot;
    }
};

Dot.prototype.move = function () {
    this.UIElem
        .transition()
        .duration(1000)
        .attr('cy', renderCY)
};

Dot.prototype.remove = function (canvas) {
    this.UIElem
        .remove();
};