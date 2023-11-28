describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/Home");
    cy.get("div").should("have.class", "container");
    // Get button with text Next

    cy.wait(8000).then(() => {
      cy.get("li").should("have.class", "next");
      cy.get("li.next").contains(">");
      // Get button with text Previous
      cy.get("li.previous").contains("<");
      // Get each page by clicking on the button Next
      cy.get("a").contains(">").click();
      cy.wait(2500).then(() => {
        cy.get("a").contains("<").click();
      });
    });
  });
});
