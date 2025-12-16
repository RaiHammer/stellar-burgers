/// <reference types="cypress" />

const API = '/api';
const testUrl = Cypress.config('baseUrl') || 'http://localhost:4000';

describe('Конструктор бургера', () => {
  before(() => {
    cy.intercept('POST', `${API}/orders*`, { fixture: 'order.json' }).as(
      'createOrder'
    );
  });

  beforeEach(() => {
    cy.fixture('ingredients.json').then((ingredientsData) => {
      const wrappedResponse = {
        success: true,
        data: ingredientsData
      };
      cy.intercept('GET', `${API}/ingredients*`, wrappedResponse).as(
        'getIngredients'
      );
    });

    cy.intercept('GET', `${API}/auth/user*`, { fixture: 'user.json' }).as(
      'getUser'
    );

    cy.setCookie('accessToken', 'FAKE.ACCESS.TOKEN');
    window.localStorage.setItem('refreshToken', 'FAKE.REFRESH.TOKEN');

    cy.visit(testUrl);
    cy.wait('@getIngredients');

    cy.contains('h3', 'Булки').should('be.visible');

    cy.contains('button', 'Оформить заказ')
      .closest('section')
      .as('constructor');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('burgerConstructor');
  });

  it('Добавляет ингредиенты и оформляет заказ', () => {
    cy.contains('h3', 'Булки')
      .next('ul')
      .find('li')
      .first()
      .find('button')
      .click();

    cy.contains('h3', 'Начинки')
      .next('ul')
      .find('li')
      .first()
      .find('button')
      .click();

    cy.contains('h3', 'Соусы')
      .next('ul')
      .find('li')
      .first()
      .find('button')
      .click();

    cy.get('@constructor').contains('(верх)').should('exist');
    cy.get('@constructor').contains('(низ)').should('exist');

    cy.get('@constructor').find('ul').find('li').should('have.length', 2);

    cy.contains('button', 'Оформить заказ').should('not.be.disabled');

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    cy.fixture('order.json').then((data) => {
      const orderNumber = data?.order?.number;
      cy.contains(String(orderNumber)).should('be.visible');

      cy.get('body').type('{esc}');
      cy.contains(String(orderNumber)).should('not.exist');
    });

    cy.get('@constructor').within(() => {
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
      cy.get('ul').find('li').should('have.length', 0);
    });

    cy.get('@constructor')
      .contains('button', 'Оформить заказ')
      .prev()
      .invoke('text')
      .then((text) => {
        const digits = text.replace(/[^\d]/g, '');
        expect(digits).to.eq('0');
      });
  });
  it('Открывает модальное окно с деталями ингредиента при клике', () => {
    cy.contains('Краторная булка N-200i').click();

    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');

    cy.get('#modals').within(() => {
      cy.get('button[type="button"]').first().click();
    });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Закрывает модальное окно ингредиента при клике на крестик', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('be.visible');

    cy.get('#modals').within(() => {
      cy.get('button[type="button"]').first().click();
    });

    cy.contains('Детали ингредиента', { timeout: 2000 }).should('not.exist');
  });

  it('Закрывает модальное окно ингредиента при клике на оверлей', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('be.visible');

    cy.get('body').click(0, 0);
    cy.contains('Детали ингредиента').should('not.exist');
  });
});
