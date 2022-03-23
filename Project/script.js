var Stopwatch = function (elem, options) {
  var timer = createTimer(),
    startButton = createButton("start", start),
    stopButton = createButton("stop", stop),
    resetButton = createButton("reset", reset),
    offset,
    clock,
    interval;

  // default options
  options = options || {};
  options.delay = options.delay || 1;

  // append elements
  elem.appendChild(timer);
  elem.appendChild(startButton);
  elem.appendChild(stopButton);
  elem.appendChild(resetButton);

  // initialize
  reset();

  // private functions
  function createTimer() {
    return document.createElement("span");
  }

  function createButton(action, handler) {
    var a = document.createElement("a");
    a.href = "#" + action;
    a.innerHTML = action;
    a.addEventListener("click", function (event) {
      handler();
      event.preventDefault();
    });
    return a;
  }

  function start() {
    if (!interval) {
      offset = Date.now();
      interval = setInterval(update, options.delay);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
    render(0);
  }

  function update() {
    clock += delta();
    render();
  }

  function render() {
    timer.innerHTML = clock / 1000;
  }

  function delta() {
    var now = Date.now(),
      d = now - offset;

    offset = now;
    return d;
  }

  // public API
  this.start = start;
  this.stop = stop;
  this.reset = reset;
};

var elem = document.getElementById("my-stopwatch");
var timer = new Stopwatch(elem, { delay: 1 });
const GlobalCargo1Pos = document.getElementById("cargo_1").offsetTop;
const GlobalCargo2Pos = document.getElementById("cargo_2").offsetTop;
const button = document.querySelector("button"); //КНОПКА START

function move() {
  let cargo_1 = document.getElementById("cargo_1"); // Добавляем грузики
  let cargo_2 = document.getElementById("cargo_2");
  let sensor = document.getElementById("sensor-line");

  let currentCargo1 = cargo_1.offsetTop; // Считываем координаты верха правого грузика
  let cargoToStop = cargo_2.offsetTop; // Считываем координаты верха левого грузика. Это мера для остановки правого.
  let currentCargo2 = cargo_2.offsetTop; // Значение для начала движения левого грузика
  let pixelsToMove = 1; // На сколько пикселей двигать грузики при каждом вызове функции
  let sensorPos = sensor.offsetTop;

  setInterval(animate, 10); // Вызываем animate пока не прирвём
  timer.start();
  button.disabled = true;
  function animate() {
    if (currentCargo1 >= cargoToStop) {
      //Если правый грузик достиг места остановки,
      clearInterval(animate); // то прерываем
    } else {
      if (currentCargo1 >= sensorPos) {
        timer.stop();
      }
      currentCargo2 -= pixelsToMove; // В ином случае двигаем правый грузик вниз, а левый вверх
      currentCargo1 += pixelsToMove;
      cargo_2.style.top = currentCargo2 + "px"; // Переприсваиваем в css
      cargo_1.style.top = currentCargo1 + "px";
    }
  }
}

function reset() {
  let cargo_1 = document.getElementById("cargo_1");
  let cargo_2 = document.getElementById("cargo_2");
  cargo_1.style.top = GlobalCargo1Pos + "px";
  cargo_2.style.top = GlobalCargo2Pos + "px";
  timer.reset();
  const button = document.querySelector("button");
  button.disabled = false;
}


