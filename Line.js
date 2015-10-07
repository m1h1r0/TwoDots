function Line(start, end) {
    this.Start = start;
    this.End = end;
    this.UIElem = null;
    //this.update.bind(this);
    //this.complete.bind(this);
}

Line.prototype.draw = function (canvas) {
    var start = this.Start;
    var x = renderCX(start), y = renderCY(start);
    this.UIElem = canvas
        .append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x)
        .attr("y2", y)
        .style("stroke", start.Color)
        .on('mouseup', function () { this.complete(canvas); }.bind(this));
    var update = this.update.bind(this);
    canvas.on("mousemove", function () { update(this); });
};

Line.prototype.update = function (mouseEvent) {
    var m = d3.mouse(mouseEvent);
    this.UIElem
        .attr("x2", m[0])
        .attr("y2", m[1]);
};

Line.prototype.close = function (canvas) {
    canvas.on("mousemove", null);
    if (this.End) {
        var endX = renderCX(this.End), endY = renderCY(this.End);
        this.UIElem
            .attr("x2", endX)
            .attr("y2", endY);
    }
};

Line.prototype.complete = function (canvas) {
    canvas.on("mousemove", null);
    amplify.publish('LineCompleted');
};

Line.prototype.remove = function () {
    this.UIElem
        .remove();
};