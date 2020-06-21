import React, { Component } from 'react';
import Ship from './Ship';
import Asteroid from './Asteroid';
import Goal from './Goal';
import { randomNumBetweenExcluding } from './helpers'

const KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  SPACE: 32, 
  ESCAPSE: 27, 
  ENTER: 13
};

export class Reacteroids extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys : {
        left  : 0,
        right : 0,
        up    : 0,
        down  : 0,
        space : 0,
      },
      asteroidCount: 10,
      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      inGame: false,
      defaultScore: 100, 
    }
    this.ship = [];
    this.goal = [];
    this.asteroids = [];
  }

  handleResize(value, e){
    this.setState({
      screen : {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      }
    });
  }

  handleKeys(value, e){
    let keys = this.state.keys;
    if(e.keyCode === KEY.LEFT) keys.left = value;
    if(e.keyCode === KEY.RIGHT) keys.right = value;
    if(e.keyCode === KEY.UP) keys.up = value;
    if(e.keyCode === KEY.DOWN) keys.down = value;
    if(e.keyCode === KEY.SPACE) keys.space = value;
    this.setState({
      keys : keys
    });
  }

  componentDidMount() {
    window.addEventListener('keyup',   this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    window.addEventListener('resize',  this.handleResize.bind(this, false));

    const context = this.refs.canvas.getContext('2d');
    this.setState({ context: context });
    this.startGame();
    requestAnimationFrame(() => {this.update()});
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeys);
    window.removeEventListener('keydown', this.handleKeys);
    window.removeEventListener('resize', this.handleResize);
  }

  update() {
    const context = this.state.context;
    const keys = this.state.keys;
    const ship = this.ship[0];

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = '#000';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // Check for colisions
    this.checkCollisionsWith(this.ship, this.asteroids);

    // Remove or render
    this.updateObjects(this.asteroids, 'asteroids')
    this.updateObjects(this.ship, 'ship')
    this.updateObjects(this.goal, 'goal')

    context.restore();

    // Next frame
    requestAnimationFrame(() => {this.update()});
  }

  startGame(){
    this.setState({
      inGame: true,
      currentScore: 0,
    });

    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width/2,
        y: this.state.screen.height/2
      },
      onDie: this.gameOver.bind(this)
    });
    this.createObject(ship, 'ship');

    // Make goal
    this.goal=[];
    let goal = new Goal({
      position: {
        x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x-60, ship.position.x+60),
        y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y-60, ship.position.y+60)
      },
      size: 20
    });
    this.createObject(goal, 'goal');

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount)
  }

  gameOver(){
    this.setState({
      inGame: false,
    });
    this.ReplaceTopScore()
  }
  ReplaceTopScore(){
    if(this.state.currentScore > this.state.topScore){
      this.setState({
        topScore: this.state.currentScore,
      });
      localStorage['topscore'] = this.state.currentScore;
    }
  }

  generateAsteroids(howMany){
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 30,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x-60, ship.position.x+60),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y-60, ship.position.y+60)
        },
        velo: 1,
        create: this.createObject.bind(this),
      });
      this.createObject(asteroid, 'asteroids');
    }
  }

  createObject(item, group){
    this[group].push(item);
  }

  updateObjects(items, group){
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      }else{
        items[index].render(this.state);
      }
      index++;
    }
  }

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1;
    var b;
    for(a; a > -1; --a)
    {
      b = items2.length - 1;
      var item1 = items1[a];
      for(b; b > -1; --b)
      {
        var item2 = items2[b];
        if(this.checkCollision(item1, item2)){
          item1.destroy();
        }
        if (this.checkInRange(item1, item2))
          item2.changeInvisible(true); else
            item2.changeInvisible(false);
      }
      if (this.checkCollision(item1, this.goal[0]))
      {
        
        this.setState({
          currentScore: this.state.currentScore + this.state.defaultScore,
        });
        this.ReplaceTopScore();

        if (this.state.currentScore % (this.state.defaultScore * 1) === 0)
        {
          this.generateAsteroids(1);
        }
        
        let goal = new Goal({
          position: {
            x: randomNumBetweenExcluding(0, this.state.screen.width, this.ship[0].position.x-100, this.ship[0].position.x+100),
            y: randomNumBetweenExcluding(0, this.state.screen.height, this.ship[0].position.y-100, this.ship[0].position.y+100)
          },
          size: 20
        });
        this.goal = [goal];
      }
      if (this.checkInRange(item1, this.goal[0]))
        this.goal[0].changeInvisible(true); else
          this.goal[0].changeInvisible(false);
    }
  }

  checkCollision(obj1, obj2){
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if(length < obj1.radius + obj2.radius){
      return true;
    }
    return false;
  }

  checkInRange(obj1, obj2){
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if(length < obj1.radius2 + obj2.radius){
      return true;
    }
    return false;
  }

  render() {
    let endgame;
    let message;

    if (this.state.currentScore <= 0) {
      message = '0 points... So sad.';
    } else if (this.state.currentScore >= this.state.topScore){
      message = 'Top score with ' + this.state.currentScore + ' points. Woo!';
    } else {
      message = this.state.currentScore + ' Points though :)'
    }

    if(!this.state.inGame){
      endgame = (
        <div className="endgame">
          <p>Game over, man!</p>
          <p>{message}</p>
          <button
            onClick={ this.startGame.bind(this) }>
            try again?
          </button>
        </div>
      )
    }

    return (
      <div>
        { endgame } 

        <span className="score current-score" > Score: {this.state.currentScore} </span>
        <span className="score top-score" > Top Score: {this.state.topScore} </span>
        <span className="controls" > Use [←][↑][↓][→] to MOVE <br/> </span>
        <canvas ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}