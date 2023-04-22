class CollisionBlock{
	constructor({position}){
		this.position = position;
		this.width = 16;
		this.heigth = 16;
	}

	draw(){
		c.fillStyle = 'rgba(255, 0, 0, 0.5)';
		c.fillRect(this.position.x, this.position.y, this.width, this.heigth);
	}

	update(){
		this.draw();
	}
}

