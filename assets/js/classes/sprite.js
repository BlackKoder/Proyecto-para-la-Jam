//Esta clase es para el jugador, aquí está la posición velocidad etc.
//NOTA: Si no puedo pasar las propiedades del constructor como un objetos, es porque
//No las he definido como un argumento
class Sprite{
	constructor({ position, velocity, color = 'red', offset }){
		this.position = position;
		//Aquí se modifica la velocidad
		this.velocity = velocity;
		//Aquí el ancho de las cajas rojas de los personajes
		this.width = 50;
		//Aquí se modifica la altura del cuadro rojo del personaje
		this.height = 150;
		//Este es para los controles
		this.lastKey;
		//Este es para el cuadro de ataque
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset,
			width: 100,
			height: 50
		}
		this.color = color;
		this.isAttacking;
		this.health = 100;

	}

	//Aquí se dibuja el cuadro rojo, se establece sus coordenadas y dimensiones
	draw(){
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		//Caja de ataque
		if (this.isAttacking) {
			c.fillStyle = "green";
			c.fillRect(
				this.attackBox.position.x, 
				this.attackBox.position.y, 
				this.attackBox.width, 
				this.attackBox.height
				);	
		}
	}

	//Aquí se actualiza todos los valores de draw position y velocity
	update(){
		this.draw();
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y < canvas.height) {
			this.velocity.y += gravity;
		}else {
			this.velocity.y = 0;
		}
	}

	//Esto lo que hace es que los ataques se restablezcan a su valor original
	//Para que sea como un golpe que se está dando
	attack(){
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100)
	}
}
