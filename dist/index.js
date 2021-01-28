let seconds = 1;
let time;

function timer() {
  if (time === undefined) {
    time = setInterval(cuentaSegundos, 1000);
  } else {
    clearInterval(time);
    document.querySelector(".timer").textContent = "0 segundos";
    seconds = 1;
    time = setInterval(cuentaSegundos, 1000);
  }
}

function cuentaSegundos() {
  if (
    document.querySelector(".tiempo").classList.contains("tiempo-corriendo")
  ) {
    document.querySelector(".tiempo").classList.remove("tiempo-corriendo");
  } else {
    document.querySelector(".tiempo").classList.add("tiempo-corriendo");
  }
  document.querySelector(".timer").textContent = seconds++ + " segundos";
}

function mezclarCards(cantidadCards) {
  let posicionesAleatorias = creaIndicesAleatorios(cantidadCards);

  let $cards = document.getElementsByClassName("card");
  let j = 0;

  for (let i = 1; i <= posicionesAleatorias.length; i++) {
    let id = `card-${posicionesAleatorias[j]}`;
    $cards.namedItem(`card-${i}`).id = id;
    j++;
  }

  document.getElementById("card-1").classList.add("par-1");
  document.getElementById("card-2").classList.add("par-1");
  document.getElementById("card-3").classList.add("par-2");
  document.getElementById("card-4").classList.add("par-2");
  document.getElementById("card-5").classList.add("par-3");
  document.getElementById("card-6").classList.add("par-3");
  document.getElementById("card-7").classList.add("par-4");
  document.getElementById("card-8").classList.add("par-4");
  document.getElementById("card-9").classList.add("par-5");
  document.getElementById("card-10").classList.add("par-5");
  document.getElementById("card-11").classList.add("par-6");
  document.getElementById("card-12").classList.add("par-6");
}

function creaIndicesAleatorios(length) {
  let posicionesAleatorias = [];

  for (let i = 0; i < length; i++) {
    let numeroAleatorio = Math.ceil(Math.random() * length);
    if (posicionesAleatorias.indexOf(numeroAleatorio) != -1) {
      i--;
    }
    while (posicionesAleatorias.indexOf(numeroAleatorio) === -1) {
      posicionesAleatorias[i] = numeroAleatorio;
      break;
    }
  }
  return posicionesAleatorias;
}

const $botonNuevoJuego = document.querySelector("#nuevoJuego");
let partidaIniciada = false;

$botonNuevoJuego.addEventListener("click", function () {
  $cards.forEach(function (card) {
    card.className = "flipper-card visible";
    card.parentNode.classList = "card";
  });
  timer();
  mezclarCards(12);
  partidaIniciada = true;
  document.querySelector(".tiempo").classList.add("tiempo-corriendo");
  document.querySelector(".tiempo").classList.add("borde-tiempo");
});

let $primerCard = null;
const $tablero = document.querySelector(".grid");
const $cards = document.querySelectorAll(".flipper-card");

$tablero.addEventListener("click", function (e) {
  const $cardsActivas = document.getElementsByClassName("flipper-effect");
  if (partidaIniciada === true && $cardsActivas.length < 2) {
    const $elemento = e.target.parentElement;
    if ($elemento.classList.contains("flipper-card")) {
      manejarClickCard($elemento);
    }
  }
});

let paresExitosos = 0;

function manejarClickCard($cardActual) {
  mostrarCard($cardActual);

  if ($primerCard === null) {
    $primerCard = $cardActual;
  } else {
    if ($primerCard === $cardActual) {
      return;
    }

    if (cardsIguales($primerCard, $cardActual)) {
      eliminarCard($primerCard);
      eliminarCard($cardActual);
      paresExitosos += 2;
      if (paresExitosos === 12) {
        setTimeout(function () {
          document.querySelector("#overlay").className = "overlay";
          document.querySelector("#exito").className = "exito";
          clearInterval(time);
          document.querySelector(".time").textContent = `${
            seconds - 1
          } segundos.`;
        }, 1400);
      }
    } else {
      ocultarCard($primerCard);
      ocultarCard($cardActual);
    }
    $primerCard = null;
  }
}

function mostrarCard($card) {
  $card.classList.add("flipper-effect");
}

function ocultarCard($card) {
  setTimeout(function () {
    $card.classList.remove("flipper-effect");
  }, 1000);
}

function eliminarCard($card) {
  setTimeout(function () {
    $card.className = "oculto";
  }, 1000);
}

function cardsIguales($primerCard, $cardActual) {
  const clasesPrimerCard = $primerCard.parentElement.classList.value;
  const clasesCardActual = $cardActual.parentElement.classList.value;

  return clasesPrimerCard === clasesCardActual;
}

const $iconClose = document.querySelector(".icon-close");

$iconClose.addEventListener("click", function (e) {
  e.target.parentElement.className = "oculto";
  resetearJuego();
});

const $jugarOtraVez = document.querySelector("#jugar-otra-vez");

$jugarOtraVez.addEventListener("click", function (e) {
  e.target.parentElement.className = "oculto";
  resetearJuego();
  partidaIniciada = true;
  document.querySelector(".tiempo").classList.add("tiempo-corriendo");
  document.querySelector(".tiempo").classList.add("borde-tiempo");

  timer();
});

function resetearJuego() {
  document.querySelector(".overlay").className = "oculto";
  document.querySelector(".tiempo").classList.remove("tiempo-corriendo");
  document.querySelector(".tiempo").classList.remove("borde-tiempo");

  $cards.forEach(function (card) {
    card.className = "flipper-card visible";
    card.parentNode.classList = "card";
  });

  mezclarCards(12);

  document.querySelector(".timer").textContent = "0 segundos";

  partidaIniciada = false;

  paresExitosos = 0;
}
