var GameBoard = {
    Dimension: 8,
    Colors: ['red', 'blue', 'green', 'purple', 'orange'],
    Dots: [],
    Lines: [],
    Canvas: null,
    CurrentDot: null,
    CurrentLine: null
};

GameBoard.init = function () {
    GameBoard.Canvas = d3.select('svg');
    GameBoard.createDots();

    amplify.subscribe("InitDotSelected", GameBoard.initLine);
    amplify.subscribe("InitDotSelected", GameBoard.activateNeighbors);

    amplify.subscribe("DotEntered", GameBoard.closeCurrentLine);
    amplify.subscribe("DotEntered", GameBoard.deactivateOldDots);
    amplify.subscribe("DotEntered", GameBoard.initLine);
    amplify.subscribe("DotEntered", GameBoard.activateNeighbors);

    amplify.subscribe("LineCompleted", GameBoard.deactivateOldDots);
    amplify.subscribe("LineCompleted", GameBoard.removeDots);
    amplify.subscribe("LineCompleted", GameBoard.removeLines);
    amplify.subscribe("LineCompleted", GameBoard.createDots);
    amplify.subscribe("LineCompleted", GameBoard.update);

};

GameBoard.createDots = function () {
    var dots = GameBoard.Dots;
    var newDotsCountByCol = [];
    for (var i = 0; i < GameBoard.Dimension; i++) {
        newDotsCountByCol[i] = 0;
    }
    for (var i = 0; i < GameBoard.Dimension; i++) {
        if (!dots[i]) {
            dots[i] = [];
        }
        for (var j = 0; j < GameBoard.Dimension; j++) {
            if (!dots[i][j]) {
                newDotsCountByCol[j]++;
            }
        }
    }
    for (var i = 0; i < GameBoard.Dimension; i++) {
        for (var c = 0; c < newDotsCountByCol[i]; c++) {
            GameBoard.newDot(-c - 1, i);
        }
    }
    GameBoard.draw();
    GameBoard.update();
};

GameBoard.newDot = function (row, col) {
    if (!GameBoard.Dots[row]) {
        GameBoard.Dots[row] = [];
    }
    var rnd = Math.floor(Math.random() * GameBoard.Colors.length);
    var newDot = new Dot(row, col, GameBoard.Colors[rnd]);
    GameBoard.Dots[row][col] = newDot;
};

GameBoard.removeDots = function () {
    if (GameBoard.Lines.length == 0) {
        return;
    }
    if (GameBoard.Lines[0].Start == GameBoard.Lines[GameBoard.Lines.length - 1].End) {
        GameBoard.removeAllDots(GameBoard.CurrentDot.Color);
    }
    GameBoard.Lines.forEach(function (line) {
        GameBoard.removeDot(line.Start);
        GameBoard.removeDot(line.End);
    });
};

GameBoard.removeAllDots = function (color) {
    for (var i = 0; i < GameBoard.Dimension; i++) {
        for (var j = 0; j < GameBoard.Dimension; j++) {
            if (GameBoard.Dots[i][j].Color == color) {
                GameBoard.removeDot(GameBoard.Dots[i][j]);
            }
        }
    }
};

GameBoard.removeDot = function (dot) {
    GameBoard.Dots[dot.Row][dot.Col] = null;
    dot.remove();
};

GameBoard.removeLines = function () {
    GameBoard.CurrentLine.remove();
    GameBoard.CurrentLine = null;
    GameBoard.Lines.forEach(function (line) {
        line.remove();
    });
    GameBoard.Lines = [];
};

GameBoard.initLine = function (dot) {
    GameBoard.CurrentDot = dot;
    GameBoard.CurrentLine = new Line(dot, null);
    GameBoard.CurrentLine.draw(GameBoard.Canvas);
};

GameBoard.closeCurrentLine = function (dot) {
    GameBoard.CurrentLine.End = dot;
    GameBoard.CurrentLine.close(GameBoard.Canvas);
    GameBoard.Lines.push(GameBoard.CurrentLine);
};

GameBoard.activateNeighbors = function (dot) {
    var delta = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }];
    delta.forEach(function (d) {
        var row = dot.Row + d.dx, col = dot.Col + d.dy;
        if (row >= 0 && row < GameBoard.Dimension && col >= 0 && col < GameBoard.Dimension
            && (GameBoard.Lines.length == 0 || GameBoard.Dots[row][col] != GameBoard.Lines[GameBoard.Lines.length - 1].Start)
            && GameBoard.Dots[row][col].Color == dot.Color) {
            GameBoard.Dots[row][col].activate();
        }
    });
};

GameBoard.deactivateOldDots = function () {
    GameBoard.Dots.forEach(function (dots) {
        dots.forEach(function (dot) {
            dot.deactivate();
        });
    });
};

GameBoard.draw = function () {
    var dots = Array.prototype.concat.apply([], _.values(GameBoard.Dots));
    dots.forEach(function (d) {
        if (d) {
            d.draw(GameBoard.Canvas);
        }
    });
};

GameBoard.update = function () {
    var dots = GameBoard.Dots;
    for (var i = GameBoard.Dimension - 1; i >= 0; i--) {
        for (var j = GameBoard.Dimension - 1; j >= 0; j--) {
            if (!dots[i][j]) {
                var k = i - 1;
                while (!dots[k][j]) {
                    k--;
                }
                var dot = dots[k][j];
                dot.Row = i;
                dots[i][j] = dot;
                dots[k][j] = null;
                dot.move();
            }
        }
    }
};

window.GameBoard = GameBoard;