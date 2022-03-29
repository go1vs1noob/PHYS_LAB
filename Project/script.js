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
const GlobalCargobluePos = document.getElementById("cargo_blue").offsetTop; // ПОЛУЧАЕМ ПЕРВОНАЧАЛЬНЫЕ ПОЗИЦИЯ ПРАВОГО И ЛЕВОГО ГРУЗИКОВ ОТНОСИТЕЛЬНО
const GlobalCargoredPos = document.getElementById("cargo_red").offsetTop; // ВЕРХА ЭКРАНА С ПОМОЩЬЮ offsetTop

const buttonStart = document.querySelector("button_start"); //ИНИЗИАЛИЗИРУЕМ КНОПКУ START
const buttonReset = document.querySelector("button_reset"); //ИНИЦИАЛИЗИРУЕМ КНОПКУ RESER

let added_mass = 0; // ИНИЦИАЛИЗИРУЕМ МАССУ, ДОБАВЛЕННУЮ ГРУЗИКАМИ
let wht1_flag = 0;  // ИНИЦИАЛИЗИРУЕМ ФЛАГИ, ОЗНАЧАЮЩИЕ, ЧТО ГРУЗИК X БЫЛ ВКЛЮЧЕН (потом мб понадобится)
let wht2_flag = 0;  
let wht3_flag = 0;  



function move() {
  
  let weight_1 = document.getElementById("weight_1");   // ИНИЦИАЛИЗИРУЕМ ГРУЗИКИ 
  let weight_2 = document.getElementById("weight_2");
  let weight_3 = document.getElementById("weight_3");
  let currentWeight_1 = weight_1.offsetTop;            // И ИХ ТЕКУЩИЕ ПОЗИЦИИ
  let currentWeight_2 = weight_2.offsetTop;
  let currentWeight_3 = weight_3.offsetTop;



  
  let cargo_blue = document.getElementById("cargo_blue"); // ИНИЦИАЛИЗИРУЕМ ГРУЗИКИ С ПОМОЩЬЮ getElementById
  let cargo_red = document.getElementById("cargo_red"); 
  let sensor = document.getElementById("sensor-line"); // ИНИЦИАЛИЗИРУЕМ ЛИНИЮ ФОТОСЕНСОРА С ПОМОЩЬЮ getElementById

  let currentCargoblue = cargo_blue.offsetTop; // Считываем координаты правого грузика
  let currentCargored = cargo_red.offsetTop; // Считываем координаты левого грузика (чтобы начать движение от них)





  const cargoToStop = GlobalCargoredPos; // Координаты для остановки правого грузика (изначальные координаты левого)

  let pixelsToMove = 0; // На сколько пикселей двигать грузики при каждом вызове функции
  let sensorPos = sensor.offsetTop; // Позиция сенсора

  setInterval(animate, 10); // Каждые 10мс вызывается функция animate(), пока не прирвём с помощью clearInterval(animate). Значение 10 можно менять
  timer.start(); // Запускаем секундомер
  buttonStart.disabled = true; // Отключаем кнопку START

  function animate() {
    pixelsToMove += 0.01 + added_mass/3000;  // placeholder формула. Зависит от массы. Каждую итерацию прибавляет к скорости данное число
    if (currentCargoblue >= cargoToStop) {
      //Если правый грузик достиг места остановки,
      clearInterval(animate); // то прерываем animate() [движение]  TODO: ПОФИКСИТЬ ВРЕЗАНИЕ В СТОЙКУ. СКОРЕЕ ВСЕГО ПРОИСХОДИТ, ПОТОМУ ЧТО ДВИГАЕТСЯ БОЛЬШЕ ЧЕМ НА 1 ПИКСЕЛЬ ЗА ИТЕРАЦИЮ
    } else {
      if (currentCargoblue >= sensorPos) {
        //Если правый грузик достиг линии сенсора фотодатчика
        timer.stop(); // то останавливаем секундомер
      }

      currentCargored -= pixelsToMove; // В ином случае двигаем правый грузик вниз, а левый вверх на {pixelsToMove} пикселей (значение изменяемое)
      currentCargoblue += pixelsToMove;
      
      currentWeight_1 += pixelsToMove;
      currentWeight_2 += pixelsToMove;  // ВМЕСТЕ С НИМИ ДВИГАЕМ И ДОБАВЛЕННЫЕ ГРУЗИКИ
      currentWeight_3 += pixelsToMove;
      
      
      cargo_red.style.top = currentCargored + "px"; // Переприсваиваем новое положение в css с помощью style.top
      cargo_blue.style.top = currentCargoblue + "px";
      weight_1.style.top = currentWeight_1 + "px";   // ОБНОВЛЯЕМ ИХ ПОЗИЦИИ В CSS
      weight_2.style.top = currentWeight_2 + "px";
      weight_3.style.top = currentWeight_3 + "px";
    }
  }
}

function reset() {
  // Возвращаем таймер и грузики в изначальное положение
  let cargo_blue = document.getElementById("cargo_blue"); // Инизиализируем грузики
  let cargo_red = document.getElementById("cargo_red");
  cargo_blue.style.top = GlobalCargobluePos + "px"; // Возвращаем на изначальные позиции
  cargo_red.style.top = GlobalCargoredPos + "px";
  weight_1.style.visibility = "hidden"; // ПРИ RESET ПРЯЧЕМ ИХ, ОТКЛЮЧАЕМ ФЛАГИ И СБРАСЫВАЕМ ДОБАВЛЕННУЮ МАССУ.
  weight_2.style.visibility = "hidden";
  weight_3.style.visibility = "hidden";
  wht1_flag = 0;
  wht2_flag = 0;
  wht3_flag = 0;
  added_mass = 0;
  timer.reset(); // Обнуляем таймер
  buttonStart.disabled = false; // Включаем кнопку "START"
}

function wht1_init() {  //ИНИЦИАЛИЗАЦИЯ ГРУЗИКОВ
  let weight_1 = document.getElementById("weight_1");           // ПОЛУЧАЕМ ГРУЗИК
  weight_1.style.left = document.getElementById("cargo_blue").offsetLeft + "px";  // ЛЕВАЯ ПОЗИЦИЯ (ТАКАЯ ЖЕ, КАК У СИНЕГО)
  weight_1.style.top = (document.getElementById("cargo_blue").offsetTop - 20) + "px";  // TOP ПОЗИЦИЯ (КАК У СИНЕГО, НО МЕНЬШЕ НА 20)
  weight_1.style.visibility = "visible"; // ПОКАЗЫВАЕМ ЕГО
  added_mass = 5; // МАССА И ФЛАГ, ЧТО ОН ВКЛЮЧЕН
  wht1_flag = 1;
  
}

function wht2_init() {
  let weight_2 = document.getElementById("weight_2");
  weight_2.style.left = document.getElementById("cargo_blue").offsetLeft + "px";
  weight_2.style.top = (document.getElementById("cargo_blue").offsetTop - 20) + "px";  
  weight_2.style.visibility = "visible";
  added_mass = 10;
  wht2_flag = 0;
}

function wht3_init() {
  let weight_3 = document.getElementById("weight_3");
  weight_3.style.left = document.getElementById("cargo_blue").offsetLeft + "px";
  weight_3.style.top = (document.getElementById("cargo_blue").offsetTop - 20) + "px";  
  weight_3.style.visibility = "visible";
  added_mass = 10;
  wht3_flag = 0;
}
