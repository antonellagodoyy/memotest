/// <reference types="Cypress" />;

const URL = "127.0.0.1:5500/dist/index.html";

context("Memotest", () => {
  before(() => {
    cy.visit(URL);
  });

  it("Se asegura que el contador de segundos este en 0 al iniciar las partidas", () => {
    cy.get(".tiempo").should("contain.text", "Tiempo transcurrido: 0 segundos");
  });

  it("Se asegura que las cards no sean clickeables fuera de las partidas", () => {
    cy.get(".flipper-effect").should("have.length", 0);
  });

  it("Se asegura que el contador de segundos funcione al iniciar las partidas", () => {
    cy.get("#nuevoJuego").click();
    cy.get(".tiempo").should(
      "not.contain.text",
      "Tiempo transcurrido: 0 segundos"
    );
  });

  it("Se asegura que las cards sean aleatorias", () => {
    cy.get("#nuevoJuego").click();
    cy.get(".card").then(($cards) => {
      let paresOriginales = [];
      $cards.each(function (i, card) {
        paresOriginales.push(card.className);
      });

      cy.get("#nuevoJuego").click();

      cy.get(".card").then(($cards) => {
        let paresNuevos = [];
        $cards.each(function (i, card) {
          paresNuevos.push(card.className);
        });

        assert.notDeepEqual(
          paresOriginales,
          paresNuevos,
          "Las cards son aleatorias"
        );
      });
    });
  });

  it("Juega un par erroneo de cards", () => {
    cy.get("#nuevoJuego").click();

    cy.get(".card").then((cards) => {
      let pares = obtenerParesOrdenados(cards);

      cy.get(pares["par-1"][0]).click();
      cy.get(pares["par-2"][0]).click();

      cy.get(".flipper-card").should("have.length", 12);
    });
  });

  it("Resuelve el juego", () => {
    cy.get("#nuevoJuego").click();

    cy.get(".card").then((cards) => {
      cy.get(".flipper-card").should("have.length", 12);

      let pares = obtenerParesOrdenados(cards);
      let listaDePares = Object.values(pares);

      listaDePares.forEach((par) => {
        cy.wait(1);
        cy.get(par[0]).click();
        cy.wait(1);
        cy.get(par[1]).click();
        cy.wait(1000);
      });
      cy.wait(1);

      cy.get(".flipper-card").should("have.length", 0);
    });
  });
});

function obtenerParesOrdenados(cardsDesordenadas) {
  const pares = {};
  cardsDesordenadas.each((i, card) => {
    const numeroPar = String(card.className.replace("card ", ""));
    if (pares[numeroPar]) {
      pares[numeroPar].push(card);
    } else {
      pares[numeroPar] = [card];
    }
  });
  return pares;
}
