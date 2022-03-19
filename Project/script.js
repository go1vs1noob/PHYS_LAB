function move() {
  let cargo_1 = document.getElementById("cargo_1"); // Добавляем грузики
  let cargo_2 = document.getElementById("cargo_2");




  let currentCargo1 = cargo_1.offsetTop; // Считываем координаты верха правого грузика
  let cargoToStop = cargo_2.offsetTop; // Считываем координаты верха левого грузика. Это мера для остановки правого.
  let currentCargo2 = cargo_2.offsetTop; // Значение для начала движения левого грузика
  let pixelsToMove = 1; // На сколько пикселей двигать грузики при каждом вызове функции
  
  setInterval(animate, 0); // Вызываем animate пока не прирвём
  function animate() {
    if (currentCargo1 === cargoToStop + 1) {
      //Если правый грузик достиг места остановки,
      clearInterval(animate); // то прерываем
    } else {
      currentCargo2 -= pixelsToMove; // В ином случае двигаем правый грузик вниз, а левый вверх
      currentCargo1 += pixelsToMove;
      cargo_2.style.top = currentCargo2 + "px"; // Переприсваиваем в css
      cargo_1.style.top = currentCargo1 + "px";
    }
  }
  const button = document.querySelector("button"); // Забираем кнопку
  button.disabled = true; // Делаем её неактивной
}
