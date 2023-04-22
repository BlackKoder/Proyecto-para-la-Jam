//Esta clase es para el background
class Background{
	constructor({position, imageSrc}){
		this.position = position;
		this.image = new Image();
		this.image.src = imageSrc;
	}

	draw(){
		if (!this.image) return;
		c.drawImage(this.image, this.position.y, this.position.x); 
	}

	update(){
		this.draw();
	}
}