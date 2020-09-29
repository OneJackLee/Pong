// FIT2102 2018 Assignment 1
// https://docs.google.com/document/d/1woMAgJVf1oL3M49Q8N3E1ykTuTu5_r28_MQPVS5QIVo/edit?usp=sharing

/**
 * function pong-the main body of game-
 *      @param None
 *      @returns VOID
 *      first,genarate the separator of the game(left for AI, right for USER)
 *      second, generate the main element ball by pass in attribute of centreX, centreY, radius and colorfill
 *      create a player paddle by pass in attribute of xCoordinate, yCoordinate and colorfill to function, pass the function to create a observable(to make it movable)
 *      instantiate a AI paddle by pass in its attributes to function
 *      initialise variable which will be used later on
 *      create Observable event stream
 * 
 *      ::Branches of Observable event stream::
 *      for the rules, I have used filter chain to filter the rules such as the game runs when UserScore<11&&AIScore<11, balls in SVG bound
 *      I have also create some filter chain to have some reflection rules such as ball bounce horizontally when hit the mid paddle; 
 *      to top when hit top paddle; to bottom when hit bottom paddle; reflect when hit top or bottom boundary
 *      Some filter chain are to calculate the score of the game such as increment score when hit the left or right boundary
 * 
 *      game
 *      |                                            |  
 *      filter runGame                               filter boundary
 *      filter Boundary                              filter ball_X hit requirement of player paddle X
 *      takeWhile ScoreRequirement                   filter ball hit the top 40% percent of the player paddle
 *      subscribe ball attr and                      subscribe xDirection yDirection and change ball color to indicate hit
 *        move autoPlayerPaddle
 *        (call autoMovePaddle)
 * 
 *      |                                                                               |
 *      filter boundary                                                                 filter boundary
 *      filter ball_X hit requirement of player paddle X                                filter ball_X hit requirement of player paddle X
 *      filter ball hit the middle of the player paddle                                 filter ball hit the bottom 40% percent of the player paddle
 *      subscribe xDirection yDirection and change ball color to indicate hit           subscribe xDirection yDirection and change ball color to indicate hit
 * 
 *      |  
 *      filter boundary
 *      filter ball_X hit requirement of AI paddle X
 *      filter ball hit the top 40% percent of the AI paddle
 *      subscribe xDirection yDirection and change ball color to indicate hit
 * 
 *      |                                                                               |
 *      filter boundary                                                                 filter boundary
 *      filter ball_X hit requirement of AI paddle X                                    filter ball_X hit requirement of AI paddle X
 *      filter ball hit the middle of the AI paddle                                     filter ball hit the bottom 40% percent of the AI paddle
 *      subscribe xDirection yDirection and change ball color to indicate hit           subscribe xDirection yDirection and change ball color to indicate hit
 * 
 *      |                                                                               |
 *      filter boundary                                                                 filter boundary
 *      filter hit bottom boundary                                                      filter hit top boundary
 *      subscribe yDirection and change ball color to indicate hit                      subscribe yDirection and change ball color to indicate hit
 *
 *      |                                                                                |
 *      filter ball hit right boundary                                                   filter ball hit left boundary
 *      subscribe Score, xDirection yDirection; change ball color                        subscribe Score, xDirection yDirection; change ball color
 *      update scoreBoard, reset ball cx cy, both paddle y                               update scoreBoard, reset ball cx cy, both paddle y
 * 
 * 
 * function ballCreate-to create the ball-
 *      @param (cx: number|string, cy: number|string, radius:number|string, color: string, documentID:string="canvas")
 *      @returns Elem
 *      generate ball by create a new Elem, pass in needed attributes.
 *      The reason of the ballCreate function is to reserve for future usage and reduce the repeated line.
 *      first getHTMLElement from document, create circle SVG elem by calling new Elem which is defined in svgelement.ts
 *      pass in attribute cx with cx, cy with cy, r with radius, fill with color,
 *      return new circle SVG Elem
 * 
 * function paddleCreate-to create the paddle-
 *      @param (x: number|string, y: number|string, color: string, documentID:string="canvas",paddleSize:number|string=50)
 *      @returns Elem
 *      generate paddle by create a new Elem, pass in needed attributes
 *      The reason of the paddleCreate function is to reserve for future usage and reduce the repeated line.
 *      first getHTMLElement from document, create circle SVG elem by calling new Elem which is defined in svgelement.ts
 *      pass in attribute x with x, y with y, width with 10, height with paddleSize,fill with color
 *      return new circle SVG Elem
 * 
 * function addMouseControl-to add mouse control according to y coordinate on paddle-
 *      !! Inspired by Tim Dywer
 *      @param (paddle:Elem, documentID:string="canvas")
 *      @returns Elem
 *      Constructs an observable stream to add mouse control on paddle 
 *      on mousedown creates a new stream to handle drags until mouseup
 *      which is almost similar to basicexamples.ts except the rectangle now only move according to Y exis
 *      Observable<MouseDown>
 *        -> map y offsets
 *      Observable<x,y>
 *          ->flatMap
 *            -->O<MouseMove>  takeUntil mouseup
 *              --->O<MouseMove> map y + offsets
 * 
 * 
 * function autoMovePaddle-to move the paddle-
 *      @param (AI_paddle: Elem, yDirection: number, AI_level: number, documentID:string="canvas")
 *      @returns VOID
 *      !!!!!!possibility to manipulate state!!!!!!
 *      refresh paddle_yCoordinate according to the yDirection increment/decrement (speed control by the increment level control)
 *      first divide AI_level with 100
 *      if the AI_paddle y  is greater than the svgbound-AI_paddle height, refresh AI_paddle y with svgbound-AI_paddle height
 *      else if AI_paddle y + AI_paddle height is less than 0 ,refresh the AI_paddle y with 0
 *      else refresh AI_paddle y with AI_paddle y + yDirection * increment_level(AI_level)
 * 
 * function scoreBoard-to update HTML scoreboard-
 *      @param (AI_score: number, User_score: number)
 *      @return VOID
 *      refresh AIScoreBoard and UserScoreBoard when changes happened
 *      first get AIScore and UserScore elements from HTML
 *      use tertiary operation to check whether or not (AI_score >= 11 && AI_score > User_score), then update score and add "AI WIN on it" 
 *      else it (AI_score == 0 && User_score == 0), then display the instruction, else just update score
 * 
 * function separator-to add separator on gamepad-
 *      @param (sepNum: number, sepHeight: number)
 *      @return VOID
 *      if the separator starting point not reached 600 create separator(rectangle elem <-pass in attribute) recursively
 *      
 */
function pong() {
  separator(0,10);  //separator for gamepad
  const
  svg:HTMLElement = document.getElementById("canvas") !,  //get HTMLElement from document
  ball:Elem = ballCreate(300,300,8,'gold'),               //create ball Elem by using function 
  player1:Elem = addMouseControl(paddleCreate(580,275,'grey')),     // create paddle and pass it to addMouseControl to create observable
  autoPlayerPaddle:Elem = paddleCreate(10,275,'white'),            // create AIPaddle(not movable)
  lazyRandom:()=>number = () => Math.random() * 1,                // lazy evaluation to create random number
  lazyDirectionSelecter:()=>number = () => [-1, 1][Math.floor(Math.random() * 2)];    // lazy evaluation to select -1 or 1

  let xDirection:number = lazyDirectionSelecter(), yDirection:number = lazyDirectionSelecter()*lazyRandom(),    // get lazy evaluation number for X and Y direction
  AIScore:number = 0, UserScore:number = 0, runGame:boolean = false, game:Observable<number> = Observable.interval(5);
  // initialise AIScore, UserScore to 0, set runGame to false(wait for user to click ball), create an Observable based on interval

  ball.observe<MouseEvent> ('mousedown')    //create an observe, when the ball being clicked('mousedown'), runGame set to true
  .takeUntil(ball.observe<MouseEvent>('mouseup')) //unsubscribe when mouseup'
  .subscribe(()=>{runGame=true})            // subscribe to set runGame to true

  // the main body of game
  // This is a filter chain which run the main concept of the game.
  // filter the runGame, event when ball.attr('cx') > 0; ball.attr('cx') <=svg.getBoundingClientRect().width)
  // unsubscribe when UserScore<11&&AIScore<11 is not fulfil
  // subscribe to move ball.attr('cx') with  ball.attr('cx')+xDirection; ball.attr('cy') with ball.attr('cy'))+yDirection,
  // call autoMovePaddle function to move the autoPlayerPaddle
  game
  .filter(()=>(runGame)) 
  .filter(()=>((Number(ball.attr('cx')))>=0))
  .filter(()=>((Number(ball.attr('cx')))<=svg.getBoundingClientRect().width))
  .takeWhile(()=>(UserScore<11&&AIScore<11))
  .subscribe(({})=> (ball.attr('cx',Number(ball.attr('cx'))+xDirection).attr('cy',Number(ball.attr('cy'))+yDirection),
  autoMovePaddle(autoPlayerPaddle,yDirection,85),scoreBoard(AIScore,UserScore)))

  // filter chain to filter the event when the ball hit the top 40% percent of the player paddle
  game
  .filter(()=>((Number(ball.attr('cx')))>=0))
  .filter(()=>((Number(ball.attr('cx')))<=svg.getBoundingClientRect().width))
  .filter(()=> ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player1.attr('x'))))
  .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player1.attr('x')) + Number(player1.attr('width'))))
  .filter(() => ((Number(ball.attr('cy')) + Number(ball.attr('r'))) >= Number(player1.attr('y'))))
  .filter(() => ((Number(ball.attr('cy'))) < Number(player1.attr('y')) + Number(player1.attr('height')) * 0.4))
  .subscribe(({}) => {
    xDirection = -xDirection * 1.01;
    yDirection = -Math.abs(xDirection) * lazyRandom()
    ball.attr('fill', 'red')
  })

  // filter chain to filter the event when the ball hit the middle of the player paddle
  game
  .filter(() => (Number(ball.attr('cx')) >= 0))
  .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
  .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player1.attr('x'))))
  .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player1.attr('x')) + Number(player1.attr('width'))))
  .filter(() => ((Number(ball.attr('cy'))) >= Number(player1.attr('y')) + Number(player1.attr('height')) * 0.4))
  .filter(() => ((Number(ball.attr('cy'))) < Number(player1.attr('y')) + Number(player1.attr('height')) * 0.6))
  .subscribe(({}) => {
    xDirection = -xDirection*1.002;
    yDirection = 0
    ball.attr('fill', 'red')
  })

    // filter chain to filter the event when the ball hit the bottom 40% percent of the player paddle
  game
  .filter(() => (Number(ball.attr('cx')) >= 0))
  .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
  .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player1.attr('x'))))
  .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player1.attr('x')) + Number(player1.attr('width'))))
  .filter(() => ((Number(ball.attr('cy'))) >= Number(player1.attr('y')) + Number(player1.attr('height')) * 0.6))
  .filter(() => ((Number(ball.attr('cy')) - Number(ball.attr('r'))) <= Number(player1.attr('y')) + Number(player1.attr('height')) * 1.0))
  .subscribe(({}) => {
    xDirection = -xDirection * 1.01;
    yDirection = Math.abs(xDirection) * lazyRandom()
    ball.attr('fill', 'red')
  })

  // filter chain to filter the event when the ball hit the top 40% percent of the AI paddle
  game
  .filter(() => (Number(ball.attr('cx')) >= 0))
  .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
  .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= (Number(autoPlayerPaddle.attr('x')) + (Number(autoPlayerPaddle.attr('width'))))))
  .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(autoPlayerPaddle.attr('x'))))

  .filter(() => ((Number(ball.attr('cy')) + Number(ball.attr('r'))) >= Number(autoPlayerPaddle.attr('y'))))
  .filter(() => ((Number(ball.attr('cy'))) < Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 0.4))
  .subscribe(({}) => {
      xDirection = -xDirection;
      yDirection = -Math.abs(xDirection) * lazyRandom()
      ball.attr('fill', 'aqua')
    })

  // filter chain to filter the event when the ball hit the middle of the AI paddle
  game
  .filter(() => (Number(ball.attr('cx')) >= 0))
  .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
  .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= (Number(autoPlayerPaddle.attr('x')) + (Number(autoPlayerPaddle.attr('width'))))))
  .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(autoPlayerPaddle.attr('x'))))

  .filter(() => ((Number(ball.attr('cy'))) >= Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 0.4))
  .filter(() => ((Number(ball.attr('cy'))) < Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 0.6))
  .subscribe(({}) => {
      xDirection = -xDirection;
      yDirection = 0
      ball.attr('fill', 'aqua')
    })

  // filter chain to filter the event when the ball hit the bottom 40% percent of the AI paddle
  game
  .filter(() => (Number(ball.attr('cx')) >= 0))
  .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
  .filter(() => ((Number(ball.attr('cx')) - Number(ball.attr('r'))) <= (Number(autoPlayerPaddle.attr('x')) + (Number(autoPlayerPaddle.attr('width'))))))
  .filter(() => ((Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(autoPlayerPaddle.attr('x'))))
  .filter(() => ((Number(ball.attr('cy'))) >= Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 0.6))
  .filter(() => ((Number(ball.attr('cy')) - Number(ball.attr('r'))) < Number(autoPlayerPaddle.attr('y')) + Number(autoPlayerPaddle.attr('height')) * 1.0))
  .subscribe(({}) => {
      xDirection = -xDirection;
      yDirection = Math.abs(xDirection) * lazyRandom()
      ball.attr('fill', 'aqua')
    })

  // filter chain to filter the event when the ball hit bottom boundary
  game
  .filter(() => (Number(ball.attr('cx')) >= 0))
  .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
  .filter(() => ((Number(ball.attr('cy')) + Number(ball.attr('r'))) >= 600))
  .subscribe(({}) => {
      yDirection = -Math.abs(xDirection) * lazyRandom();
      ball.attr('fill', 'honeydew')
    })

    // filter chain to filter the event when the ball hit top boundary
  game
  .filter(() => (Number(ball.attr('cx')) >= 0))
  .filter(() => (Number(ball.attr('cx')) <= svg.getBoundingClientRect().width))
  .filter(() => ((Number(ball.attr('cy')) - Number(ball.attr('r'))) <= 0))
  .subscribe(({}) => {
      yDirection = Math.abs(xDirection) * lazyRandom();
      ball.attr('fill', 'honeydew')
    })

    // filter chain to filter the event when the ball hit right boundary
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
      autoPlayerPaddle.attr('y', 275)
    })

  // filter chain to filter the event when the ball hit left boundary
  game
  .filter(() => (Number(ball.attr('cx')) <= 0))
  .subscribe(() => {
      UserScore = UserScore + 1,
      xDirection = lazyDirectionSelecter(),
      yDirection = lazyDirectionSelecter() * lazyRandom(),
      ball.attr('fill', 'gold')
      scoreBoard(AIScore, UserScore)
      ball.attr('cx', 300).attr('cy', 300)
      autoPlayerPaddle.attr('y', 275)
      player1.attr('y', 275)
    })
}

function paddleCreate(x: number|string, y: number|string, color: string, documentID:string="canvas",paddleSize:number|string=50):Elem {
  const
    svg:HTMLElement = document.getElementById(documentID) !, // get HTMLElement from document
    rect:Elem = new Elem(svg, 'rect')                        // create rectangle SVG elem and pass in attribute x with x, y with y, width with 10, height with paddleSize
    .attr('x', x).attr('y', y)
    .attr('width', 10).attr('height', paddleSize)
    .attr('fill', color);                                    // fill with color
  return rect                                                // return the rectagle SVG elem for future use
}


function autoMovePaddle(AI_paddle: Elem, yDirection: number, AI_level: number, documentID:string="canvas") {
  const
    svg:HTMLElement = document.getElementById(documentID) !; // get HTMLElement from document
  AI_level = AI_level / 100

    Number(AI_paddle.attr('y')) > svg.getBoundingClientRect().height - Number(AI_paddle.attr('height')) ? //AI_paddle y  is greater than the svgbound-AI_paddle height
    AI_paddle.attr('y', svg.getBoundingClientRect().height - Number(AI_paddle.attr('height'))) :
    Number(AI_paddle.attr('y')) + Number(AI_paddle.attr('height')) < 0 ? //AI_paddle y + AI_paddle height is less than 0
    AI_paddle.attr('y', 0) : AI_paddle.attr('y', Number(AI_paddle.attr('y')) + yDirection * AI_level)

}

function ballCreate(cx: number|string, cy: number|string, radius:number|string, color: string, documentID:string="canvas"):Elem {
  const
    svg:HTMLElement = document.getElementById(documentID) !,// get HTMLElement from document
    circle:Elem = new Elem(svg, 'circle') // create circle SVG elem and pass in attribute cx with cx, cy with cy, r with radius, fill with color
    .attr('cx', cx).attr('cy', cy)
    .attr('r', radius)
    .attr('fill', color);
  return circle //return circle SVG elememnt
}

function addMouseControl(paddle:Elem, documentID:string="canvas"):Elem {
  const
    svg:HTMLElement = document.getElementById(documentID) !,// get HTMLElement from document
    mousemove:Observable<MouseEvent> = Observable.fromEvent < MouseEvent > (svg, 'mousemove'), // create Observable fromEvent 'mousemove'
    mouseup:Observable<MouseEvent> = Observable.fromEvent < MouseEvent > (svg, 'mouseup'); // create Observable fromEvent 'mouseup'
  paddle.observe < MouseEvent > ('mousedown')      //create an observe, which triggered when 'mousedown')
    .map(({                                        //map the paddle_y - mouse_yCoordinate(clientY) with yOffset
      clientY
    }) => ({
      yOffset: Number(paddle.attr('y')) - clientY
    }))
    .flatMap(({                                   //stream creator for yOffset
        yOffset
      }) =>
      mousemove                                   //trigger Observable mousemove and unsub when 'mouseup' event triggered
      .takeUntil(mouseup)
      .map(({                                     //map the mouse_yCoordinate
        clientY                                 
      }) => ({                                    // if mouse_yCoordinate + yOffset is greater than the SVG bounding - paddle height
        y: (clientY + yOffset > svg.getBoundingClientRect().height - Number(paddle.attr('height'))) 
        ? svg.getBoundingClientRect().height - Number(paddle.attr('height'))      // map mouse_yCoordinate with SVG bounding - paddle height
        : clientY + yOffset < 0                                                   // else if mouse_yCoordinate + yOffset is less than 0, map it with 0, else
        ? 0 
        : clientY + yOffset                                                       // map the mouse_yCoordinate with mouse_yCoordinate + yOffset 
      })))
    .subscribe(({                                                                 // subscribe funtion to update the paddle_y
        y
      }) =>
      paddle.attr('y', y));
  return paddle
}

function separator(sepNum: number, sepHeight: number) {
  const svg:HTMLElement = document.getElementById("canvas") !; // get elements canvas from HTML
  (sepNum < 600) ? ( // separator starting point not reached 600
    // create separater
    new Elem(svg, 'rect')
    .attr('x', 298).attr('y', sepNum) // starting point of separator
    .attr('width', 2).attr('height', sepHeight) //length of separator
    .attr('fill', 'honeydew'),
    separator(sepNum + 15, sepHeight)
  ) : undefined
}

function scoreBoard(AI_score: number, User_score: number):void {
  const
    AIScoreBoard:HTMLElement = document.getElementById("AIScore") !, // get elements AIScore from HTML
    UserScoreBoard:HTMLElement = document.getElementById("UserScore") !;  // get elements UserScore from HTML
  (AI_score >= 11 && AI_score > User_score) ?         // update score
  AIScoreBoard.innerHTML = "AI WIN:" + `${AI_score}`: ((AI_score == 0 && User_score == 0) ? AIScoreBoard.innerHTML = "click and drag right" : AIScoreBoard.innerHTML = `${AI_score}`);
  (User_score >= 11 && User_score > AI_score) ?       // update score
  UserScoreBoard.innerHTML = "User WIN:" + `${User_score}`: ((AI_score == 0 && User_score == 0) ? UserScoreBoard.innerHTML = "paddle to hit the ball" : UserScoreBoard.innerHTML = `${User_score}`);
}

// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    pong();
  }

 
