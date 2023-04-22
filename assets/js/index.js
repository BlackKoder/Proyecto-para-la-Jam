//Esto hace el llamado a nuestro canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//Aquí establecemos nuestras dimensiones para nuestro canvas
canvas.width = 1024;
canvas.height = 576;

//Aquí escalamos los valores del lienzo dividiendo entre cuatro veces su tamaño, este debe de 
//concordar con el valor de scale que usamos más abajo
const scaledCanvas = {
	width: canvas.width / 4,
	height: canvas.height / 4
}

//Este va a ser el valor para la gravedad
const gravity = 0.5;


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


//Aquí puedo alterar la posición del jugador en el eje x y 
const player = new Sprite({
			position:{
				x: 0,
				y: 0
			},
			velocity:{
				x: 0,
				y: 1
			},
			offset:{
				x: 0,
				y: 0
			}
			
		});

//Este es el objeto del enemigo
const enemy = new Sprite({
			position:{
				x: 300,
				y: 100
			},
			velocity:{
				x: 0,
				y: 1
			},
			offset:{
				x: -50,
				y: 0
			},
			color: 'blue'
		});

//Este es el valor por defecto de nuestras teclas de dirección

const keys = {
	d:{
		pressed: false,
	},
	a:{
		pressed: false,
	},
	ArrowRight:{
		pressed: false,
	},
	ArrowLeft:{
		pressed: false,
	}
}

//Este es el objeto donde cambiamos los valores de nuestro background
const background = new Background({
	position:{
		x: 0,
		y: 0,
	},
	imageSrc: './assets/img/background.png'
})

//Con esto detectamos las colisiones al dar un golpe
function rectangularCollision({ rectangle1, rectangle2}){
	return(rectangle1.attackBox.position.x  + rectangle1.attackBox.width >=
				rectangle2.position.x && 
			rectangle1.attackBox.position.x <= 
				rectangle2.position.x + rectangle2.width && 
			rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
				rectangle2.position.y && 
			rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
		)
}

//Aquí determinamos el Game Over o si sigue nuestra aventura
function determineDeath({player, enemy, timerId}){
	clearTimeout(timerId);
	document.querySelector('#display-text').style.display = 'flex';
	if (player.health <= 0) {
		document.querySelector('#display-text').innerHTML = 'Game Over';
	}else if(enemy.health <= 0 && player.health > 0){
		document.querySelector('#display-text').innerHTML = 'Adventure Continue';
	}

}

//Con esto hacemos el contador del tiempo de la partida
let timer = 30;
let  timerId;
function decreaseTimer(){
	if (timer > 0 ) {
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		document.querySelector('#timer').innerHTML = timer;
	}
	if (timer === 0) {
		determineDeath({player, enemy, timerId});
	}

}


decreaseTimer();

//Esta función lo que hace es dibujar en nuestro liezo varios cuadros por segundo
//Se mantiene activo todo el tiempo
function animate(){
	window.requestAnimationFrame(animate);
	c.fillStyle = "white";
	c.fillRect(0, 0, canvas.width, canvas.height);

	//Con este guardamos los valores que están dentro de él
	c.save();
	//Con este manejamos el escalado del background
	c.scale(4, 4);
	//Con este hacemos la transición de la vista del background
	c.translate(0, -background.image.height + scaledCanvas.height);
	background.update();
	//Con este restaura los valores para mostrarnoslo constantemente en pantalla
	c.restore();
	player.update();
	enemy.update();


	//Aquí altero la velocidad del personaje y el desplazamiento del jugador
	player.velocity.x = 0;
	enemy.velocity.x = 0;

	if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5;
	}else if(keys.a.pressed && player.lastKey === 'a'){
		player.velocity.x = -5;
	}

	//Aquí altero la velocidad del personaje y el desplazamiento del enemigo

	if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5;
	}else if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
		enemy.velocity.x = -5;
	}

	//Detección de colisiones
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) && 
		player.isAttacking
		) {
		player.isAttacking = false;
		enemy.health -= 20;
		document.querySelector('#enemyHealth').style.width = enemy.health + "%";
	}

	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player
		}) && 
		enemy.isAttacking
		) {
		enemy.isAttacking = false;
		player.health -= 20;
		document.querySelector('#playerHealth').style.width = player.health + "%";
	}

	//Terminar el juego basado en la vida
	if (player.health <= 0 || enemy.health <= 0) {
		determineDeath({player, enemy, timerId});
	}

}

animate();


//Aquí están los controles, se mantiene en escucha en un evento por si presiono una
//tecla en el teclado
window.addEventListener('keydown', (event) =>{
	switch(event.key){
		case 'd':
			keys.d.pressed = true;
			player.lastKey = 'd';
		break;	

		case 'a':
			keys.a.pressed = true;
			player.lastKey = 'a';
		break; 

		case 'w':
			player.velocity.y = -20;
		break; 

		case 'k':
			player.attack();
		break;

		case 'ArrowRight':
			keys.ArrowRight.pressed = true;
			enemy.lastKey = 'ArrowRight';
		break;	

		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true;
			enemy.lastKey = 'ArrowLeft';
		break; 

		case 'ArrowUp':
			enemy.velocity.y = -20;
		break; 

		case 'p':
			enemy.isAttacking = true;
		break;
	}
	//console.log(event.key);
});

//Este es el contrario de la dirección a donde establecimos que vaya el personje
//Para que se mantenga en un solo sitio y no se mueva a lo loco

window.addEventListener('keyup', (event) =>{
	switch(event.key){
		case 'd':
			keys.d.pressed = false;
		break;	

		case 'a':
			keys.a.pressed = false;
		break; 
	}

	switch(event.key){
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
		break;
		
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
		break;		
	}
});
