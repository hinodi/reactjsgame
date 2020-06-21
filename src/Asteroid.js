import { asteroidVertices, randomNumBetween } from './helpers';

export default class Asteroid {
  constructor(args) {
    this.position = args.position
    this.velocity = {
      x: randomNumBetween(-1.5, 1.5) * args.velo,
      y: randomNumBetween(-1.5, 1.5) * args.velo
    }
    this.rotation = 0;
    this.rotationSpeed = randomNumBetween(-1, 1)
    this.radius = args.size;
    this.create = args.create;
    this.vertices = asteroidVertices(8, args.size);
    this.invisible = false;
  }

  changeInvisible(value){
    this.invisible = value;
  }

  render(state){
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Rotation
    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Screen edges
    if(this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
      else if(this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
    if(this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
      else if(this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = '#FFF';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -this.radius);
    if (this.invisible)
      for (let i = 1; i < this.vertices.length; i++) {
        context.lineTo(this.vertices[i].x, this.vertices[i].y);
      }
    context.closePath();
    context.stroke();
    context.restore();
  }
}