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
/*
a=g*(m1-m2)/(m1+m2)
a=(v^2-v0^2)/2S;

Пусть m2 - правый блок
*/
var elem = document.getElementById("my-stopwatch");
var timer = new Stopwatch(elem, { delay: 1 });
const GlobalCargo1Pos = document.getElementById("cargo_1").offsetTop;
const GlobalCargo2Pos = document.getElementById("cargo_2").offsetTop;
const GlobalCargo3Pos = document.getElementById("car").offsetTop;
const GlobalCargo4Pos = document.getElementById("car2").offsetTop;
const GlobalCargo5Pos = document.getElementById("car3").offsetTop;
const button = document.querySelector("button"); //КНОПКА START
let m1=1;
function move() {
    let cargo_1 = document.getElementById("cargo_1"); // Добавляем грузики
    let cargo_2 = document.getElementById("cargo_2");
    let sensor = document.getElementById("sensor-line");
    let car = document.getElementById("car");
    let car2 = document.getElementById("car2");
    let car3 = document.getElementById("car3");

    let currentCargo1 = cargo_1.offsetTop; // Считываем координаты верха правого грузика
    let cargoToStop = cargo_2.offsetTop; // Считываем координаты верха левого грузика. Это мера для остановки правого.
    let currentCargo2 = cargo_2.offsetTop; // Значение для начала движения левого грузика
    let currentCar = car.offsetTop;
    let currentCar2 = car2.offsetTop;
    let currentCar3 = car3.offsetTop;
    let pixelsToMove = 1; // На сколько пикселей двигать грузики при каждом вызове функции
    let sensorPos = sensor.offsetTop;
    let speed=10;
    setInterval(animate, 10); // Вызываем animate пока не прирвём
    timer.start();
    button.disabled = true;
    //alert(cargoToStop+cargo_2.offsetHeight);

    function animate() {
        if (currentCargo1+cargo_1.offsetHeight/2 >= cargoToStop ) {
            //Если правый грузик достиг места остановки,

            clearInterval(animate); // то прерываем
        } else {
            if (currentCargo1 >= sensorPos) {
                timer.stop();
            }
            if(currentCargo2%speed==0){
               if(m1==1) pixelsToMove+=5;
               if(m1==5) pixelsToMove+=10;
               if(m1==10) pixelsToMove+=15;
               if(m1==15) pixelsToMove+=20;
            }
            //if(currentCargo1+cargo_1.offsetHeight/2+pixelsToMove>cargoToStop) break;
            currentCargo2 -= pixelsToMove; // В ином случае двигаем правый грузик вниз, а левый вверх
            currentCargo1 += pixelsToMove;
            currentCar-=pixelsToMove;
            currentCar2-=pixelsToMove;
            currentCar3-=pixelsToMove;
            cargo_2.style.top = currentCargo2 + "px"; // Переприсваиваем в css
            cargo_1.style.top = currentCargo1 + "px";
            car.style.top = currentCar + "px";
            car2.style.top = currentCar2 + "px";
            car3.style.top = currentCar3 + "px";
        }
    }

}

function but1(){
    // поменять массу
    // отрисовка
    let car = document.getElementById("car");
    car.style.visibility = 'visible';
    m1=5;

}
function but2(){
    let car = document.getElementById("car");
    car.style.visibility = 'visible';
    let car2 = document.getElementById("car2");
    car2.style.visibility = 'visible';
    m1=10;
}
function but3(){
    let car = document.getElementById("car");
    car.style.visibility = 'visible';
    let car2 = document.getElementById("car2");
    car2.style.visibility = 'visible';
    let car3 = document.getElementById("car3");
    car3.style.visibility = 'visible';
    m1=15;
}
function reset() {
    let cargo_1 = document.getElementById("cargo_1");
    let cargo_2 = document.getElementById("cargo_2");
    let car = document.getElementById("car");
    let car2 = document.getElementById("car2");
    let car3 = document.getElementById("car3");
    cargo_1.style.top = GlobalCargo1Pos + "px";
    cargo_2.style.top = GlobalCargo2Pos + "px";
    car.style.top = GlobalCargo3Pos + "px";
    car.style.visibility='hidden';
    car2.style.top = GlobalCargo4Pos + "px";
    car2.style.visibility='hidden';
    car3.style.top = GlobalCargo5Pos + "px";
    car3.style.visibility='hidden';
    m1=1;

    timer.reset();
    const button = document.querySelector("button");
    button.disabled = false;
}

