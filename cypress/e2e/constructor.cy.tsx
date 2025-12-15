/// <reference types="cypress" />

const API = '/api'; // Базовый URL API
const testUrl = Cypress.config('baseUrl') || 'http://localhost:4000';

describe('Конструктор бургера', () => {
    
    before(() => {
        // Перехватываем создание заказа
        cy.intercept('POST', `${API}/orders*`, { fixture: 'order.json' }).as('createOrder');
    });

    beforeEach(() => {
        // Перехватываем загрузку ингредиентов
        cy.fixture('ingredients.json').then((ingredientsData) => {
            const wrappedResponse = {
                success: true,
                data: ingredientsData 
            };
            cy.intercept('GET', `${API}/ingredients*`, wrappedResponse).as('getIngredients');
        });
        
        // Перехватываем запрос данных пользователя
        cy.intercept('GET', `${API}/auth/user*`, { fixture: 'user.json' }).as('getUser');

        // Устанавливаем фейковые токены для авторизации
        cy.setCookie('accessToken', 'FAKE.ACCESS.TOKEN'); 
        window.localStorage.setItem('refreshToken', 'FAKE.REFRESH.TOKEN');

        // Открываем главную страницу
        cy.visit(testUrl);
        cy.wait('@getIngredients'); // Ждём загрузки ингредиентов
        
        // Проверяем, что раздел "Булки" виден
        cy.contains('h3', 'Булки').should('be.visible'); 

        // Находим секцию конструктора по кнопке "Оформить заказ" и сохраняем как алиас
        cy.contains('button', 'Оформить заказ').closest('section').as('constructor');
    });

    afterEach(() => {
        // Очищаем токены после каждого теста
        cy.clearCookie('accessToken');
        window.localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('burgerConstructor'); // Очистка конструктора
    });
    
    it('Добавляет ингредиенты и оформляет заказ', () => {
        // 1. Добавляем первую булку (клик по кнопке в карточке)
        cy.contains('h3', 'Булки')
          .next('ul')
          .find('li')
          .first()
          .find('button')
          .click();

        // 2. Добавляем первую начинку
        cy.contains('h3', 'Начинки')
          .next('ul')
          .find('li')
          .first()
          .find('button')
          .click();

        // 3. Добавляем первый соус
        cy.contains('h3', 'Соусы')
          .next('ul')
          .find('li')
          .first()
          .find('button')
          .click();

        // 4. Проверяем, что булки (верх и низ) отобразились в конструкторе
        cy.get('@constructor').contains('(верх)').should('exist');
        cy.get('@constructor').contains('(низ)').should('exist');
        
        // Проверяем, что в конструкторе 2 начинки (начинка + соус)
        cy.get('@constructor').find('ul').find('li').should('have.length', 2);
        
        // 5. Проверяем, что кнопка "Оформить заказ" активна
        cy.contains('button', 'Оформить заказ').should('not.be.disabled');
        
        // 6. Оформляем заказ
        cy.contains('button', 'Оформить заказ').click();
        cy.wait('@createOrder'); // Ждём ответа от мока

        // 7. Проверяем номер заказа из моковых данных
        cy.fixture('order.json').then((data) => {
            const orderNumber = data?.order?.number;
            cy.contains(String(orderNumber)).should('be.visible');

            // Закрываем модальное окно клавишей ESC
            cy.get('body').type('{esc}');
            cy.contains(String(orderNumber)).should('not.exist');
        });

        // 8. Проверяем, что конструктор очистился
        cy.get('@constructor').within(() => {
            cy.contains('Выберите булки').should('exist');
            cy.contains('Выберите начинку').should('exist');
            cy.get('ul').find('li').should('have.length', 0); // Нет начинок
        });

        // 9. Проверяем, что сумма заказа обнулилась (опционально)
        cy.get('@constructor')
          .contains('button', 'Оформить заказ')
          .prev() // Предполагается, что перед кнопкой находится элемент с суммой
          .invoke('text')
          .then((text) => {
            const digits = text.replace(/[^\d]/g, '');
            expect(digits).to.eq('0');
          });
    });
});
