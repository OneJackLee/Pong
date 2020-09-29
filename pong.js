"use strict";
function pong() {
    separator(0, 10);
    const svg = document.getElementById("canvas"), ball = ballCreate(300, 300, 8, 'gold'), player1 = addMouseControl(paddleCreate(580, 275, 'grey')), autoPlayerPaddle = paddleCreate(10, 275, 'white'), lazyRandom = () => Math.random() * 1, lazyDirectionSelecter = () => [-1, 1][Math.floor(Math.random() * 2)];
    let xDirection = lazyDirectionSelecter(), yDirection = lazyDirectionSelecter() * lazyRandom(), AIScore = 0, UserScore = 0, runGame = false, game = Observable.interval(5);
    ball.observe('mousedown')
        .takeUntil(ball.observe('mouseup'))
        .subscribe(() => { runGame = true; });
    game
        .filter(() => (runGame))
        .filter(() => ((Number(ball.attr('cx'))) >= 0))
        .filter(() => ((Number(ball.attr('cx'))) <= svg.getBoundingClientRect().width))
        .takeWhile(() => (UserScore < 11 && AIScore < 11))
        .subscribe(({}) => (ball.attr('cx', Number(ball.attr('cx')) + xDirection).attr('cy', Number(ball.attr('cy')) + yDirection),
        autoMovePaddle(autoPlayerPaddle, yDirection, 85), scoreBoard(AIScore, UserScore)));
    game
        .filter(() => ((Number(ball.attr('cx'))) >= 0))
        .filter(() => ((Number(ball.attr('cx'))) <= svg.getBoundingClientRect().width))
        .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player1.attr('x'))))
        .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player1.attr('x')) + Number(player1.attr('width'))))
        .filter(() => ((Number(ball.attr('cy')) + Number(ball.attr('r'))) >= Number(player1.attr('y'))))
        .filter(() => ((Number(ball.attr('cy'))) < Number(player1.attr('y')) + Number(player1.attr('height')) * 0.4))
        .subscribe(({}) => {
        xDirection = -xDirection * 1.01;
        yDirection = -Math.abs(xDirection) * lazyRandom();
        ball.attr('fill', 'red');
    });
    game
        .filter(() => (Number(ball.attr('cx')) >= 0))
        .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
        .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player1.attr('x'))))
        .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player1.attr('x')) + Number(player1.attr('width'))))
        .filter(() => ((Number(ball.attr('cy'))) >= Number(player1.attr('y')) + Number(player1.attr('height')) * 0.4))
        .filter(() => ((Number(ball.attr('cy'))) < Number(player1.attr('y')) + Number(player1.attr('height')) * 0.6))
        .subscribe(({}) => {
        xDirection = -xDirection * 1.002;
        yDirection = 0;
        ball.attr('fill', 'red');
    });
    game
        .filter(() => (Number(ball.attr('cx')) >= 0))
        .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
        .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player1.attr('x'))))
        .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player1.attr('x')) + Number(player1.attr('width'))))
        .filter(() => ((Number(ball.attr('cy'))) >= Number(player1.attr('y')) + Number(player1.attr('height')) * 0.6))
        .filter(() => ((Number(ball.attr('cy')) - Number(ball.attr('r'))) <= Number(player1.attr('y')) + Number(player1.attr('height')) * 1.0))
        .subscribe(({}) => {
        xDirection = -xDirection * 1.01;
        yDirection = Math.abs(xDirection) * lazyRandom();
        ball.attr('fill', 'red');
    });
    game
        .filter(() => (Number(ball.attr('cx')) >= 0))
        .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
        .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= (Number(autoPlayerPaddle.attr('x')) + (Number(autoPlayerPaddle.attr('width'))))))
        .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(autoPlayerPaddle.attr('x'))))
        .filter(() => ((Number(ball.attr('cy')) + Number(ball.attr('r'))) >= Number(autoPlayerPaddle.attr('y'))))
        .filter(() => ((Number(ball.attr('cy'))) < Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 0.4))
        .subscribe(({}) => {
        xDirection = -xDirection;
        yDirection = -Math.abs(xDirection) * lazyRandom();
        ball.attr('fill', 'aqua');
    });
    game
        .filter(() => (Number(ball.attr('cx')) >= 0))
        .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
        .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= (Number(autoPlayerPaddle.attr('x')) + (Number(autoPlayerPaddle.attr('width'))))))
        .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(autoPlayerPaddle.attr('x'))))
        .filter(() => ((Number(ball.attr('cy'))) >= Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 0.4))
        .filter(() => ((Number(ball.attr('cy'))) < Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 0.6))
        .subscribe(({}) => {
        xDirection = -xDirection;
        yDirection = 0;
        ball.attr('fill', 'aqua');
    });
    game
        .filter(() => (Number(ball.attr('cx')) >= 0))
        .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
        .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= (Number(autoPlayerPaddle.attr('x')) + (Number(autoPlayerPaddle.attr('width'))))))
        .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(autoPlayerPaddle.attr('x'))))
        .filter(() => ((Number(ball.attr('cy'))) >= Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 0.6))
        .filter(() => ((Number(ball.attr('cy')) - Number(ball.attr('r'))) < Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 1.0))
        .subscribe(({}) => {
        xDirection = -xDirection;
        yDirection = Math.abs(xDirection) * lazyRandom();
        ball.attr('fill', 'aqua');
    });
    game
        .filter(() => (Number(ball.attr('cx')) >= 0))
        .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
        .filter(() => ((Number(ball.attr('cy')) + Number(ball.attr('r'))) >= 600))
        .subscribe(({}) => {
        yDirection = -Math.abs(xDirection) * lazyRandom();
        ball.attr('fill', 'honeydew');
    });
    game
        .filter(() => (Number(ball.attr('cx')) >= 0))
        .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
        .filter(() => ((Number(ball.attr('cy')) - Number(ball.attr('r'))) <= 0))
        .subscribe(({}) => {
        yDirection = Math.abs(xDirection) * lazyRandom();
        ball.attr('fill', 'honeydew');
    });
    game
        .filter(() => (Number(ball.attr('cx')) >= svg.getBoundingClientRect().width))
        .subscribe(() => {
        AIScore = AIScore + 1,
            xDirection = lazyDirectionSelecter(),
            yDirection = lazyDirectionSelecter() * lazyRandom(),
            ball.attr('fill', 'gold'),
            scoreBoard(AIScore, UserScore),
            ball.attr('cx', 300).attr('cy', 300),
            player1.attr('y', 275),
            autoPlayerPaddle.attr('y', 275);
    });
    game
        .filter(() => (Number(ball.attr('cx')) <= 0))
        .subscribe(() => {
        UserScore = UserScore + 1,
            xDirection = lazyDirectionSelecter(),
            yDirection = lazyDirectionSelecter() * lazyRandom(),
            ball.attr('fill', 'gold');
        scoreBoard(AIScore, UserScore);
        ball.attr('cx', 300).attr('cy', 300);
        autoPlayerPaddle.attr('y', 275);
        player1.attr('y', 275);
    });
}
function paddleCreate(x, y, color, documentID = "canvas", paddleSize = 50) {
    const svg = document.getElementById(documentID), rect = new Elem(svg, 'rect')
        .attr('x', x).attr('y', y)
        .attr('width', 10).attr('height', paddleSize)
        .attr('fill', color);
    return rect;
}
function autoMovePaddle(AI_paddle, yDirection, AI_level, documentID = "canvas") {
    const svg = document.getElementById(documentID);
    AI_level = AI_level / 100;
    Number(AI_paddle.attr('y')) > svg.getBoundingClientRect().height - Number(AI_paddle.attr('height')) ?
        AI_paddle.attr('y', svg.getBoundingClientRect().height - Number(AI_paddle.attr('height'))) :
        Number(AI_paddle.attr('y')) + Number(AI_paddle.attr('height')) < 0 ?
            AI_paddle.attr('y', 0) : AI_paddle.attr('y', Number(AI_paddle.attr('y')) + yDirection * AI_level);
}
function ballCreate(cx, cy, radius, color, documentID = "canvas") {
    const svg = document.getElementById(documentID), circle = new Elem(svg, 'circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', radius)
        .attr('fill', color);
    return circle;
}
function addMouseControl(paddle, documentID = "canvas") {
    const svg = document.getElementById(documentID), mousemove = Observable.fromEvent(svg, 'mousemove'), mouseup = Observable.fromEvent(svg, 'mouseup');
    paddle.observe('mousedown')
        .map(({ clientY }) => ({
        yOffset: Number(paddle.attr('y')) - clientY
    }))
        .flatMap(({ yOffset }) => mousemove
        .takeUntil(mouseup)
        .map(({ clientY }) => ({
        y: (clientY + yOffset > svg.getBoundingClientRect().height - Number(paddle.attr('height')))
            ? svg.getBoundingClientRect().height - Number(paddle.attr('height'))
            : clientY + yOffset < 0
                ? 0
                : clientY + yOffset
    })))
        .subscribe(({ y }) => paddle.attr('y', y));
    return paddle;
}
function separator(sepNum, sepHeight) {
    const svg = document.getElementById("canvas");
    (sepNum < 600) ? (new Elem(svg, 'rect')
        .attr('x', 298).attr('y', sepNum)
        .attr('width', 2).attr('height', sepHeight)
        .attr('fill', 'honeydew'),
        separator(sepNum + 15, sepHeight)) : undefined;
}
function scoreBoard(AI_score, User_score) {
    const AIScoreBoard = document.getElementById("AIScore"), UserScoreBoard = document.getElementById("UserScore");
    (AI_score >= 11 && AI_score > User_score) ?
        AIScoreBoard.innerHTML = "AI WIN:" + `${AI_score}` : ((AI_score == 0 && User_score == 0) ? AIScoreBoard.innerHTML = "click and drag right" : AIScoreBoard.innerHTML = `${AI_score}`);
    (User_score >= 11 && User_score > AI_score) ?
        UserScoreBoard.innerHTML = "User WIN:" + `${User_score}` : ((AI_score == 0 && User_score == 0) ? UserScoreBoard.innerHTML = "paddle to hit the ball" : UserScoreBoard.innerHTML = `${User_score}`);
}
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map