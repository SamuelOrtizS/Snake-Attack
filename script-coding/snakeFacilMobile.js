//Vamos a usar http://processingjs.org/
// o https://p5js.org/reference/

// Importamos las librerias
let { append, cons, first, isEmpty, isList, length, rest, map, forEach }  = functionalLight;

// Actualiza los atributos del objeto y retorna una copia profunda
function update(data, attribute) {
  return Object.assign({}, data, attribute);
}

//////////////////////// Mundo inicial
let Mundo = {}
////////////////////////
/**
 * Actualiza la serpiente. Creando una nueva cabeza y removiendo la cola
 */
function moveSnake(snake, dir) {
  const head = first(snake);
  return cons({x: head.x + dir.x, y: head.y + dir.y}, snake.slice(0, length(snake) - 1));
}

//Se declara el tamaño de cada celda de juego
const dx = 20;
const dy = 20;
//Se declara el tamaño del canvas
const canvasAlto = 720;
const canvasAncho = 720;

//Dibuja cada parte de la serpiente
function drawSnake(snake){
  fill(0,255,0);
  forEach(snake, s => {
    rect(s.x * dx, s.y * dy, dx, dy);
  });
  noStroke();
}

//Dibuja la cabeza de la serpiente
function drawHead(snake,dir){
  const head = first(snake);
  fill(0,0,0);
  ellipseMode(CORNER);
  noStroke();
  if (dir.x === 0 && dir.y === -1){
        ellipse(head.x*dx,(head.y*dy)+(dy/2),dx/2,dy/2);
        fill(255,0,0)
        rect((head.x*dx)+(dx*5/12),(head.y*dy),dx/6,dy/2);
  } else if (dir.x === 0 && dir.y=== 1){
        ellipse((head.x*dx)+(dx/2),head.y*dy,dx/2,dy/2);
        fill(255,0,0)
        rect((head.x*dx)+(dx*5/12),(head.y*dy)+(dy/2),dx/6,dy/2);
  } else if (dir.x === -1 && dir.y=== 0){
        ellipse((head.x*dx)+(dx/2),head.y*dy,dx/2,dy/2);
        fill(255,0,0)
        rect((head.x*dx),(head.y*dy)+(dx*5/12),dx/2,dy/6);
  } else {
        ellipse(head.x*dx,head.y*dy,dx/2,dy/2);
        fill(255,0,0)
        rect((head.x*dx)+(dx/2),(head.y*dy)+(dy*5/12),dx/2,dy/6);
  }
}

//Dibuja la comida
function drawFood(food) {
  fill(255,0,0);
  ellipseMode(CORNER);
  ellipse(food.x * dx, food.y * dy, dx, dy);
}

//Dibuja el puntaje
function drawScore(score) {
  const scoreAlto = canvasAlto-(dy/2);
  textFont('Georgia', dx);
  fill(255,0,0);
  text("Score: " + score, dx/2, scoreAlto);
}

//Incrementa el puntaje
function addScore(num){
  return (Mundo.score + num);
}

//Incrementa en una unidad el tamaño de la serpiente
function addSnake(snake, dir) {
  const head = first(snake);
  return cons({x: head.x + dir.x, y: head.y + dir.y}, cons(last(snake),snake.slice(0, length(snake) - 1)));
}

//Retorna el ultimo elemento de una lista
function last(test){
  if (length(test == 1)){
      return test;
  } else {
      return rest(test);
  }
}

//Crea una nueva fruta, en una posicion aleatoria dentro del canvas
function moveFood(food){
  const alto = (canvasAlto-dx)/dx
  const ancho = (canvasAncho-dy)/dy
  return {x: floor(random()*alto+1),y: floor(random()*ancho+1) };
}

//Verifica si se ha comido una fruta, si la cabeza esta en la misma posicion que la fruta
function haComido(snake,fruit){
  const head = first(snake);
  if ((head.x == fruit.x)&&(head.y == fruit.y)){
      return true;
  } else {
      return false;
  }
}

//Termina el juego si la serpiente choca contra el borde del mapa.
function choqueMuro(snake){
  const head = first(snake);
  if (head.x < 0 || head.y <0){
      return true;
  } else if (head.x > ((canvasAncho - dx)/dx) || head.y > ((canvasAlto - dy)/dy)){
      return true;
  } else {
      return false;
  }
}

//Determina si una lista contiene un elemento
function inList(list, elem){
  if (isEmpty(list)){
      return false;
  } else if (first(list).x == elem.x && first(list).y == elem.y){
    return true;
  } else {
      return (inList((rest(list)),elem));
  }
}

//Verifica que la comida no este dentro de la serpiente
function posFood(snake,food){
  return inList(rest(snake),food);
}

//Dibuja los controles en pantalla
function drawControls() {
  fill('rgba(255,255,255,0.1)');
  triangle(canvasAncho/2,0,canvasAncho/3,canvasAlto/3,(canvasAncho/3)*2,canvasAlto/3);
  triangle(canvasAncho/3,canvasAlto/3,canvasAncho/3,(canvasAlto/3)*2,0,canvasAlto/2);
  triangle((canvasAncho/3)*2,canvasAlto/3,(canvasAncho/3)*2,(canvasAlto/3)*2,canvasAncho,(canvasAlto/2));
  triangle(canvasAncho/3,(canvasAlto/3)*2,(canvasAncho/3)*2,(canvasAlto/3)*2,canvasAncho/2,canvasAlto);
  fill(255,0,0);
}

/**
 * Esto se llama antes de iniciar el juego
 */
 function setup() {
  const drawAlto = canvasAlto;
  const drawAncho = canvasAncho;
  frameRate(8);
  createCanvas(drawAlto, drawAncho);
  Mundo = {snake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], dir: {x: 1, y: 0}, food: {x: 5, y: 5 }, score: 0, parar: false};
}

// Dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
function drawGame(Mundo){
  if (Mundo.parar){
      fill(255,255,255);
      textSize(50);
      textAlign(CENTER);
      text("Game Over",0,(canvasAlto-50)/2,canvasAncho,50);
      frameRate(0);
  } else {
      background(0, 0, 0);
      drawFood(Mundo.food);
      drawSnake(Mundo.snake);
      drawHead(Mundo.snake,Mundo.dir);
      drawScore(Mundo.score);
      drawControls();
  }
}

// Esto se ejecuta en cada tic del reloj. Con esto se pueden hacer animaciones
function onTic(Mundo){
  if (choqueMuro(Mundo.snake)){
      return (update(Mundo, {parar: true}));
  } else if (posFood(Mundo.snake,Mundo.food)){
      return update(Mundo, {snake: moveSnake(Mundo.snake, Mundo.dir), food: moveFood(Mundo.food)});
  } else if (!haComido(Mundo.snake,Mundo.food)){
      return update(Mundo, {snake: moveSnake(Mundo.snake, Mundo.dir)});
  } else {
      return update(Mundo, {snake: addSnake(Mundo.snake, Mundo.dir),food: moveFood(Mundo.food), score: addScore(1)});
  }
}

//Implemente esta función si quiere que su programa reaccione a eventos del mouse
function onMouseEvent (Mundo, event) {
  if (event.action == "click"){
    if ((event.mouseX < ((canvasAncho/3)*2)) && (event.mouseX > (canvasAncho/3)) && (event.mouseY < (canvasAlto/3)) && (event.mouseY > 0)){
      if ((Mundo.dir.y == 1) && (Mundo.dir.x == 0)){
          return update(Mundo, {dir: {y: 1, x: 0}});
      } else {
          return update(Mundo, {dir: {y: -1, x: 0}});
      }
    } else if ((event.mouseX < ((canvasAncho/3)*2)) && (event.mouseX > (canvasAncho/3)) && (event.mouseY < canvasAlto) && (event.mouseY > ((canvasAlto/3)*2))){
      if ((Mundo.dir.y == -1) && (Mundo.dir.x == 0)){
          return update(Mundo, {dir: {y: -1, x: 0}});
      } else {
          return update(Mundo, {dir: {y: 1, x: 0}});
      }
    } else if ((event.mouseX < (canvasAncho/3)) && (event.mouseX > 0) && (event.mouseY < ((canvasAlto/3)*2)) && (event.mouseY > (canvasAlto/3))){
      if ((Mundo.dir.y == 0) && (Mundo.dir.x == 1)){
          return update(Mundo, {dir: {y: 0, x: 1}});
      } else {
          return update(Mundo, {dir: {y: 0, x: -1}});
      }
    } else if ((event.mouseX < canvasAncho) && (event.mouseX > ((canvasAncho/3)*2)) && (event.mouseY < ((canvasAlto/3)*2)) && (event.mouseY > (canvasAlto/3))){
      if ((Mundo.dir.y == 0) && (Mundo.dir.x == -1)){
          return update(Mundo, {dir: {y: 0, x: -1}});
      } else {
          return update(Mundo, {dir: {y: 0, x: 1}});
      }
    }
  } else {
   return update(Mundo,{});
  }
}

/**
* Actualiza el mundo cada vez que se oprime una tecla. Retorna el nuevo stado del mundo
*/
function onKeyEvent (Mundo, keyCode) {
  // Cambiamos la dirección de la serpiente. Noten que no movemos la serpiente. Solo la dirección. Además, verifica si la siguiente dirección es válida.
  switch (keyCode) {
    case UP_ARROW:
      if ((Mundo.dir.y == 1) && (Mundo.dir.x == 0)){
          return update(Mundo, {dir: {y: 1, x: 0}});
      } else {
          return update(Mundo, {dir: {y: -1, x: 0}});
      }
      break;
    case DOWN_ARROW:
      if ((Mundo.dir.y == -1) && (Mundo.dir.x == 0)){
          return update(Mundo, {dir: {y: -1, x: 0}});
      } else {
          return update(Mundo, {dir: {y: 1, x: 0}});
      }
      break;
    case LEFT_ARROW:
          if ((Mundo.dir.y == 0) && (Mundo.dir.x == 1)){
          return update(Mundo, {dir: {y: 0, x: 1}});
      } else {
          return update(Mundo, {dir: {y: 0, x: -1}});
      }
      break;
    case RIGHT_ARROW:
      if ((Mundo.dir.y == 0) && (Mundo.dir.x == -1)){
          return update(Mundo, {dir: {y: 0, x: -1}});
      } else {
          return update(Mundo, {dir: {y: 0, x: 1}});
      }
      break;
      case 67:
        return (update(Mundo, {snake: addSnake(Mundo.snake, Mundo.dir),food: moveFood(Mundo.food), score: addScore(10)}));
      break;
      case 96:
        return (update(Mundo, {parar: true}));
      break
    default:
      console.log(keyCode);
      return update(Mundo, {});
  }
}
