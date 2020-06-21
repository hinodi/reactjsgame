export default class Ship {
  constructor(args) {
    this.position = args.position
    this.velocity = {
      x: 0, 
      y: 0
    }
    this.rotation = 0;
    this.speed = 0.5;
    this.inertia = 0.89;
    this.radius = 20;
    this.radius2 = 20 * 10;
    this.onDie = args.onDie;
  }

  destroy(){
    this.delete = true;
    this.onDie();
 
  }

  accelerate(){
    this.velocity.x -= Math.sin(-this.rotation*Math.PI/180) * this.speed;
    this.velocity.y -= Math.cos(-this.rotation*Math.PI/180) * this.speed;
  }

  render(state){
    if(state.keys.up){
      this.rotation = 0;
      this.accelerate();
    }
    if(state.keys.left){
      this.rotation = 270;
      this.accelerate();
    }
    if(state.keys.right){
      this.rotation = 90;
      this.accelerate();
    }
    if(state.keys.down){
      this.rotation = 180;
      this.accelerate();
    }

    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Screen edges
    if(this.position.x > state.screen.width) this.position.x = 0;
      else if(this.position.x < 0) this.position.x = state.screen.width;
    if(this.position.y > state.screen.height) this.position.y = 0;
      else if(this.position.y < 0) this.position.y = state.screen.height;

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.strokeStyle = '#ffffff';
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.ellipse(0, 0, this.radius, this.radius, 0, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    context.strokeStyle = '#ffffff';
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.ellipse(0, 0, this.radius2, this.radius2, 0, 0, 2 * Math.PI);
    context.closePath();

    context.stroke();
    context.restore();
  }
}