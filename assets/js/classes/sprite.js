//Esta clase es para el jugador, aquí está la posición velocidad etc.
//NOTA: Si no puedo pasar las propiedades del constructor como un objetos, es porque
//No las he definido como un argumento
class Sprite{
	constructor({ position, velocity, color = 'red', offset, collisionBlocks }){
		this.position = position;
		//Aquí se modifica la velocidad
		this.velocity = velocity;
		//Aquí el ancho de las cajas rojas de los personajes
		//NOTA:Se divide el valor entre cuatro ya que como hemos metido player
		//dentro del save y restore este también toma los valores del background, por lo tanto
		//se escala, y entonces tenemos que permanecer con los cálculos exactos de nuestro 
		//scaledCanvas
		this.width = 50 / 4;
		//Aquí se modifica la altura del cuadro rojo del personaje
		this.height = 150 / 4;
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
		this.collisionBlocks = collisionBlocks;

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
		this.checkForHorizontalCollisions();
		this.applyGravity();
		this.checkForVerticalCollisions();

		/*if (this.position.y + this.height + this.velocity.y < canvas.height) {
		}else {
			this.velocity.y = 0;
		}*/
	}

	//Aquí manejamos la gravedad de una forma un poco más cómoda y organizada
	applyGravity(){
		this.position.y += this.velocity.y;
		this.velocity.y += gravity;
	}

	//Aquí se detectan los coliders de forma vertical
	checkForVerticalCollisions(){
		for(let i = 0; i < this.collisionBlocks.length; i++){
			const collisionBlock = this.collisionBlocks[i];

			if (collision({
				object1: this,
				object2: collisionBlock,
			})) {
				if (this.velocity.y > 0) {
					this.velocity.y = 0;
					this.position.y = collisionBlock.position.y - this.height - 0.01;
					break;
				}

				if (this.velocity.y < 0) {
					this.velocity.y = 0;
					this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01;
					break;
				}
			}
		}
	}

	//Y aquí en horizontal
	checkForHorizontalCollisions(){
		for(let i = 0; i < this.collisionBlocks.length; i++){
			const collisionBlock = this.collisionBlocks[i];

			if (collision({
				object1: this,
				object2: collisionBlock,
			})) {
				if (this.velocity.x > 0) {
					this.velocity.x = 0;
					this.position.x = collisionBlock.position.x - this.width - 0.01;
					break;
				}

				if (this.velocity.x < 0) {
					this.velocity.x = 0;
					this.position.x = collisionBlock.position.x + collisionBlock.width + 0.01;
					break;
				}
			}
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
