var Stopwatch = function (elem, options) {
  /* СЕКУНДОМЕР. НЕ РАЗБИРАЛСЯ В РАБОТЕ, КАК Я ПОНЯЛ, ПРОСТО ЗАПРАШИВАЕТ ДАТУ И ЧЕРЕЗ ДЕЛЬТУ ОБНОВЛЯЕТ СЧЕТЧИК */
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

  //----------------------------------------------------------------------------------------------------------------------------//
  // public API
  this.start = start; // <-- КАК ИМ ПОЛЬЗОВАТЬСЯ
  this.stop = stop;
  this.reset = reset;
};

//----------------------------------------------------------------------------------------------------------------------------//

var elem = document.getElementById("my-stopwatch"); // ПОЛУЧАЕМ СЕКУНДОМЕР С ПОМОЩЬЮ getElementById И ЕГО НАЗВАНИЯ В HTML
var timer = new Stopwatch(elem, { delay: 10 }); // <-- ИНИЦИАЛИЗИРУЕМ. DELAY - ТО, КАК ЧАСТО ОБНОВЛЯЕТСЯ СЧЕТЧИК НА ЭКРАНЕ
const GlobalCargo1Pos = document.getElementById("cargo_1").offsetTop; // ПОЛУЧАЕМ ПЕРВОНАЧАЛЬНЫЕ ПОЗИЦИЯ ПРАВОГО И ЛЕВОГО ГРУЗИКОВ ОТНОСИТЕЛЬНО
const GlobalCargo2Pos = document.getElementById("cargo_2").offsetTop; // ВЕРХА ЭКРАНА С ПОМОЩЬЮ offsetTop

const buttonStart = document.querySelector("button"); //ИНИЗИАЛИЗИРУЕМ КНОПКУ START

function move() {
  let cargo_1 = document.getElementById("cargo_1"); // ИНИЦИАЛИЗИРУЕМ ГРУЗИКИ С ПОМОЩЬЮ getElementById
  let cargo_2 = document.getElementById("cargo_2");
  let sensor = document.getElementById("sensor-line"); // ИНИЦИАЛИЗИРУЕМ ЛИНИЮ ФОТОСЕНСОРА С ПОМОЩЬЮ getElementById

  let currentCargo1 = cargo_1.offsetTop; // Считываем координаты правого грузика
  let currentCargo2 = cargo_2.offsetTop; // Считываем координаты левого грузика (чтобы начать движение от них)

  const cargoToStop = GlobalCargo2Pos; // Координаты для остановки правого грузика (изначальные координаты левого)

  let pixelsToMove = 1; // На сколько пикселей двигать грузики при каждом вызове функции
  let sensorPos = sensor.offsetTop;

  setInterval(animate, 10); // Каждые 10мс вызывается функция animate(), пока не прирвём с помощью clearInterval(animate). Значение 10 можно менять
  timer.start(); // Запускаем секундомер
  buttonStart.disabled = true; // Отключаем кнопку START
  function animate() {
    if (currentCargo1 >= cargoToStop) {
      //Если правый грузик достиг места остановки,
      clearInterval(animate); // то прерываем animate() [движение]
    } else {
      if (currentCargo1 >= sensorPos) {
        //Если правый грузик достиг линии сенсора фотодатчика
        timer.stop(); // то останавливаем секундомер
      }
      currentCargo2 -= pixelsToMove; // В ином случае двигаем правый грузик вниз, а левый вверх на {pixelsToMove} пикселей (значение изменяемое)
      currentCargo1 += pixelsToMove;
      cargo_2.style.top = currentCargo2 + "px"; // Переприсваиваем новое положение в css с помощью style.top
      cargo_1.style.top = currentCargo1 + "px";
    }
  }
}

function reset() {
  // Возвращаем таймер и грузики в изначальное положение
  let cargo_1 = document.getElementById("cargo_1"); // Инизиализируем грузики
  let cargo_2 = document.getElementById("cargo_2");
  cargo_1.style.top = GlobalCargo1Pos + "px"; // Возвращаем на изначальные позиции
  cargo_2.style.top = GlobalCargo2Pos + "px";
  timer.reset(); // Обнуляем таймер
  buttonStart.disabled = false; // Включаем кнопку "START"
}
