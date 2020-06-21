import { asteroidVertices, randomNumBetween } from './helpers';

export default class Asteroid {
  constructor(args) {
    this.position = args.position
    this.radius = args.size;
    this.invisible = false;
  }

  changeInvisible(value){
    this.invisible = value;
  }


  render(state){
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.strokeStyle = '#98f442';
    context.fillStyle = '#98f442';
    context.beginPath();
    if (this.invisible)
      context.ellipse(0, 0, this.radius, this.radius, 0, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
}