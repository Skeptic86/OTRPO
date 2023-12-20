describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000");
    cy.get("div").should("have.class", "container");
    cy.wait(10000).then(() => {
      cy.get("div").should("have.class", "PokemonCard_card__ARGSB");
      cy.get("div.PokemonCard_card__ARGSB button").contains("Выбрать").click();
    });

    // Click on button inside div with class select-btn
    // cy.get("div. button").click({ multiple: true });
  });
});
