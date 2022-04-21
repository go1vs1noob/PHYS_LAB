const wheel_r = 0.063;
const M_tr = 0.00001;
const cargo_mass = 0.0811; //всё в кг
const I = 0.0005;
const g = 9.806;


var Stopwatch = function (elem, options) {
  /* СЕКУНДОМЕР. ЗАПРАШИВАЕТ ДАТУ И ЧЕРЕЗ ДЕЛЬТУ ОБНОВЛЯЕТ СЧЕТЧИК */
  var timer = createTimer(),
    offset,
    clock,
    interval;

  // default options
  options = options || {};
  options.delay = options.delay || 1;

  // append elements
  elem.appendChild(timer);
  /* elem.appendChild(startButton);
  elem.appendChild(stopButton);
  elem.appendChild(resetButton);*/

  // initialize
  reset();

  // private functions
  function createTimer() {
    return document.createElement("span");
  }

  /*function createButton(action, handler) {
    var a = document.createElement("a");
    a.href = "#" + action;
    a.innerHTML = action;
    a.addEventListener("click", function (event) {
      handler();
      event.preventDefault();
    });
    return a;
  }*/

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
      timer.innerHTML = clock / 1000 + " сек.";
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
  function update_no_render() {
    clock += delta();
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
  function show() {
    return parseFloat(clock / 1000);
  }
  //----------------------------------------------------------------------------------------------------------------------------//
  // public API
  this.start = start; // <-- КАК ИМ ПОЛЬЗОВАТЬСЯ
  this.stop = stop;
  this.reset = reset;
  this.curr_time = show;
  this.update = update_no_render;
};

//-----------------------MAIN-----------------------------------------------------------------------------------------------------//

var elem = document.getElementById("my-stopwatch"); // ПОЛУЧАЕМ СЕКУНДОМЕР С ПОМОЩЬЮ getElementById И ЕГО НАЗВАНИЯ В HTML
var timer = new Stopwatch(elem, { delay: 10 }); // <-- ИНИЦИАЛИЗИРУЕМ. DELAY - ТО, КАК ЧАСТО ОБНОВЛЯЕТСЯ СЧЕТЧИК НА ЭКРАНЕ
const GlobalCargobluePos = document.getElementById("cargo_blue").offsetTop; // ПОЛУЧАЕМ ПЕРВОНАЧАЛЬНЫЕ ПОЗИЦИЯ ПРАВОГО И ЛЕВОГО ГРУЗИКОВ ОТНОСИТЕЛЬНО
const GlobalCargoredPos = document.getElementById("cargo_red").offsetTop; // ВЕРХА ЭКРАНА С ПОМОЩЬЮ offsetTop


let button_start = document.getElementById("button_start");
let button_reset = document.getElementById("button_reset");
let button_weight_1 = document.getElementById("button_weight_1");
let button_weight_2 = document.getElementById("button_weight_2");
let button_weight_3 = document.getElementById("button_weight_3"); // ИНИЦИАЛИЗАЦИЯ ОБЪЕКТОВ
let button_weight_4 = document.getElementById("button_weight_4");
let thread_left = document.getElementById("thread_left");
let thread_right = document.getElementById("thread_right");
let wheel = document.getElementById("wheel");


let added_mass = 0; // ИНИЦИАЛИЗИРУЕМ МАССУ, ДОБАВЛЕННУЮ ГРУЗИКАМИ
let wht1_flag = 0; // ИНИЦИАЛИЗИРУЕМ ФЛАГИ, ОЗНАЧАЮЩИЕ, ЧТО ГРУЗИК X БЫЛ ВКЛЮЧЕН
let wht2_flag = 0;
let wht3_flag = 0;
let wht4_flag = 0;
let flag_sum = 0;
let pixelsToMoveAfterTimerStop = 0;
const cargo_height = document.getElementById("cargo_blue").offsetHeight; // ВЫСОТА ГРУЗИКА

//DRAGGABLE RULER
dragElement(document.getElementById("draggable_ruler"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  /* otherwise, move the DIV from anywhere inside the DIV:*/
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//DRAGGABLE RULER

button_start.addEventListener("click", (e) => {
  if (flag_sum != 0) {
    button_reset.disabled = true;
    button_start.disabled = true;
    turn_off_weight_buttons();
    move();
  }
});
button_reset.addEventListener("click", (e) => {
  // ДОБАВЛЯЕМ КНОПКИ В EventListener (обработка кнопок много раз)
  reset();
  turn_on_weight_buttons();
  button_start.disabled = false;
});
button_weight_1.addEventListener("click", (e) => {
  wht1_init();
});
button_weight_2.addEventListener("click", (e) => {
  wht2_init();
});
button_weight_3.addEventListener("click", (e) => {
  wht3_init();
});
button_weight_4.addEventListener("click", (e) => {
  wht4_init();
});



function move() {
  let weight_1 = document.getElementById("weight_1"); // ИНИЦИАЛИЗИРУЕМ ГРУЗИКИ
  let weight_2 = document.getElementById("weight_2");
  let weight_3 = document.getElementById("weight_3");
  let weight_4 = document.getElementById("weight_4");

  let currentWeight_1 = weight_1.offsetTop; // И ИХ ТЕКУЩИЕ ПОЗИЦИИ
  let currentWeight_2 = weight_2.offsetTop;
  let currentWeight_3 = weight_3.offsetTop;
  let currentWeight_4 = weight_4.offsetTop;
  let currentThreadLeft = thread_left.offsetHeight;
  let currentThreadRight = thread_right.offsetHeight;

  let cargo_blue = document.getElementById("cargo_blue"); // ИНИЦИАЛИЗИРУЕМ ГРУЗИКИ С ПОМОЩЬЮ getElementById
  let cargo_red = document.getElementById("cargo_red");
  let sensor = document.getElementById("sensor-line"); // ИНИЦИАЛИЗИРУЕМ ЛИНИЮ ФОТОСЕНСОРА С ПОМОЩЬЮ getElementById
  let currentCargoblue = cargo_blue.offsetTop; // Считываем координаты правого грузика
  let currentCargored = cargo_red.offsetTop; // Считываем координаты левого грузика (чтобы начать движение от них)

  const cargoToStop = GlobalCargoredPos; // Координаты для остановки правого грузика (изначальные координаты левого)
  let pixelsToMove = 0; // На сколько пикселей двигать грузики при каждом вызове функции
  let sensorPos = sensor.offsetTop; // Позиция сенсора

  let acceleration =getRandomNum(0.95,1.05)*(17 * (added_mass * g * (wheel_r * wheel_r) - M_tr * wheel_r)) /
    (wheel_r * wheel_r * (2 * cargo_mass + added_mass + I /  (wheel_r*wheel_r))); // g = 9.8, 17px/cm, 81.1 = m;
  
  let animateInterval = setInterval(animate, 10); // Каждые 10мс вызывается функция animate(), пока не прирвём с помощью clearInterval(animate). Значение 10 можно менять
  timer.start(); // Запускаем секундомер
  console.log(acceleration/17);
  function animate() {

    pixelsToMove = acceleration * timer.curr_time(); //равноуск. движ. t = 139 px/с^2 для m1 = 82.5, m2 =
    
    if (currentCargoblue >= cargoToStop) {
      //Если правый грузик достиг места остановки,
      clearInterval(animateInterval); // то прерываем animate() [движение]  TODO: ПОФИКСИТЬ ВРЕЗАНИЕ В СТОЙКУ. СКОРЕЕ ВСЕГО ПРОИСХОДИТ, ПОТОМУ ЧТО ДВИГАЕТСЯ БОЛЬШЕ ЧЕМ НА 1 ПИКСЕЛЬ ЗА ИТЕРАЦИЮ
      button_reset.disabled = false; // КОГДА ГРУЗИК ОСТАНАВЛИВАЕТСЯ ПОЗВОЛЯЕМ ПОЛЬЗОВАТЕЛЮ СДЕЛАТЬ СБРОС
    } else {
      if (currentCargoblue >= sensorPos - cargo_height) {
        //Если правый грузик достиг линии сенсора фотодатчика
        timer.stop(sensorPos); // то останавливаем секундомер
      }

      currentCargored -= pixelsToMove; // В ином случае двигаем правый грузик вниз, а левый вверх на {pixelsToMove} пикселей (значение изменяемое)
      currentCargoblue += pixelsToMove;

      currentWeight_1 += pixelsToMove;
      currentWeight_2 += pixelsToMove; // ВМЕСТЕ С НИМИ ДВИГАЕМ И ДОБАВЛЕННЫЕ ГРУЗИКИ
      currentWeight_3 += pixelsToMove;
      currentWeight_4 += pixelsToMove;

      currentThreadLeft -= pixelsToMove;
      currentThreadRight += pixelsToMove;

      timer.update(); // после преодоления фотосенсора, таймер на экране остановится. Но "внутри" мы его можем обновлять с помощью timer.update()
      wheel.style.transform = "rotate(" + pixelsToMove * 6 * 17 + "deg)"; // двигаем колесо с помощью transform

      thread_right.style.height = currentThreadRight + "px"; //нить "правая" и "левая"
      thread_left.style.height = currentThreadLeft + "px";
      cargo_red.style.top = currentCargored + "px"; // Переприсваиваем новое положение в css с помощью style.top
      cargo_blue.style.top = currentCargoblue + "px";
      weight_1.style.top = currentWeight_1 + "px"; // ОБНОВЛЯЕМ ИХ ПОЗИЦИИ В CSS
      weight_2.style.top = currentWeight_2 + "px";
      weight_3.style.top = currentWeight_3 + "px";
      weight_4.style.top = currentWeight_4 + "px";
    }
  }
}

function reset() {
  // Возвращаем таймер и грузики в изначальное положение
  cargo_blue.style.top = GlobalCargobluePos + "px"; // Возвращаем на изначальные позиции
  cargo_red.style.top = GlobalCargoredPos + "px";
  weight_1.style.visibility = "hidden"; // ПРИ RESET ПРЯЧЕМ ИХ, ОТКЛЮЧАЕМ ФЛАГИ И СБРАСЫВАЕМ ДОБАВЛЕННУЮ МАССУ.
  weight_2.style.visibility = "hidden";
  weight_3.style.visibility = "hidden";
  weight_4.style.visibility = "hidden";
  thread_left.style.height = 600 + "px";
  thread_right.style.height = 60 + "px";
  wht1_flag = 0;
  wht2_flag = 0;
  wht3_flag = 0; // ФЛАГИ, ЧТО ДОБАВЛЕН X ГРУЗИК
  wht4_flag = 0;
  added_mass = 0;
  flag_sum = 0;
  pixelsToMoveAfterTimerStop = 0;
  wheel.style.transform = "rotate(" + 0 + "deg)"; //ресетим колесо
  timer.stop(); // Останавливаем таймер
  timer.reset(); // Обнуляем таймер
}

function wht1_init() {
  //ИНИЦИАЛИЗАЦИЯ ГРУЗИКОВ

  if (flag_sum <= 1 && wht1_flag == 0) {
    let weight_1 = document.getElementById("weight_1"); // ПОЛУЧАЕМ ГРУЗИК
    weight_1.style.left =
      document.getElementById("cargo_blue").offsetLeft + "px"; // ЛЕВАЯ ПОЗИЦИЯ (ТАКАЯ ЖЕ, КАК У СИНЕГО)
    if (flag_sum == 1) {
      turn_off_weight_buttons();
      weight_1.style.top =
        document.getElementById("cargo_blue").offsetTop - 40 + "px"; // TOP ПОЗИЦИЯ (КАК У СИНЕГО, НО МЕНЬШЕ НА 40 ЕСЛИ 1 ГРУЗИК УЖЕ ДОБАВЛЕН)
    } else {
      weight_1.style.top =
        document.getElementById("cargo_blue").offsetTop - 20 + "px"; // TOP ПОЗИЦИЯ (КАК У СИНЕГО, НО МЕНЬШЕ НА 40 ЕСЛИ 0 ГРУЗИКОВ УЖЕ ДОБАВЛЕН)
    }
    weight_1.style.visibility = "visible"; // ПОКАЗЫВАЕМ ЕГО
    added_mass += 0.0014; // МАССА И ФЛАГ, ЧТО ОН ВКЛЮЧЕН
    wht1_flag = 1;
    flag_sum += 1;
  }
}

function wht2_init() {
  if (flag_sum <= 1 && wht2_flag == 0) {
    let weight_2 = document.getElementById("weight_2");
    weight_2.style.left =
      document.getElementById("cargo_blue").offsetLeft + "px";
    if (flag_sum == 1) {
      turn_off_weight_buttons();
      weight_2.style.top =
        document.getElementById("cargo_blue").offsetTop - 40 + "px";
    } else {
      weight_2.style.top =
        document.getElementById("cargo_blue").offsetTop - 20 + "px";
    }
    weight_2.style.visibility = "visible";
    added_mass += 0.0028;
    wht2_flag = 1;
    flag_sum += 1;
  }
}

function wht3_init() {
  if (flag_sum <= 1 && wht3_flag == 0) {
    let weight_3 = document.getElementById("weight_3");
    weight_3.style.left =
      document.getElementById("cargo_blue").offsetLeft + "px";
    if (flag_sum == 1) {
      turn_off_weight_buttons();
      weight_3.style.top =
        document.getElementById("cargo_blue").offsetTop - 40 + "px";
    } else {
      weight_3.style.top =
        document.getElementById("cargo_blue").offsetTop - 20 + "px";
    }
    weight_3.style.visibility = "visible";
    added_mass += 0.0021;
    wht3_flag = 1;
    flag_sum += 1;
  }
}
function wht4_init() {
  if (flag_sum <= 1 && wht4_flag == 0) {
    let weight_4 = document.getElementById("weight_4");
    weight_4.style.left =
      document.getElementById("cargo_blue").offsetLeft + "px";
    if (flag_sum == 1) {
      turn_off_weight_buttons();
      weight_4.style.top =
        document.getElementById("cargo_blue").offsetTop - 40 + "px";
    } else {
      weight_4.style.top =
        document.getElementById("cargo_blue").offsetTop - 20 + "px";
    }
    weight_4.style.visibility = "visible";
    added_mass += 0.0043;
    wht4_flag = 1;
    flag_sum += 1;
  }
}

function turn_off_weight_buttons() {
  button_weight_1.disabled = true;
  button_weight_2.disabled = true; // ОТКЛЮЧЕНИЕ КНОПОК ГРУЗОВ
  button_weight_3.disabled = true;
  button_weight_4.disabled = true;
}

function turn_on_weight_buttons() {
  button_weight_1.disabled = false;
  button_weight_2.disabled = false; // ВКЛЮЧЕНИЕ КНОПОК ГРУЗОВ
  button_weight_3.disabled = false;
  button_weight_4.disabled = false;
}

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}
