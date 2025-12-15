// Моки для API функций
export const getIngredientsApi = jest.fn(() => 
  Promise.resolve([
    {
      _id: '60666c42cc7b410027a1a9b1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    }
  ])
);

export const orderBurgerApi = jest.fn((ingredients: string[]) => 
  Promise.resolve({ 
    success: true,
    name: 'Метеоритный бургер',
    order: { 
      _id: '123',
      status: 'done',
      name: 'Метеоритный бургер',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 12345,
      ingredients 
    }
  })
);

export const getUserApi = jest.fn(() => 
  Promise.resolve({
    success: true,
    user: { email: 'test@example.com', name: 'Test User' }
  })
);

export const loginUserApi = jest.fn(() => 
  Promise.resolve({
    success: true,
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    user: { email: 'test@example.com', name: 'Test User' }
  })
);

export const registerUserApi = jest.fn(() => 
  Promise.resolve({
    success: true,
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    user: { email: 'test@example.com', name: 'Test User' }
  })
);

export const logoutApi = jest.fn(() => 
  Promise.resolve({ success: true })
);

export const updateUserApi = jest.fn(() => 
  Promise.resolve({
    success: true,
    user: { email: 'updated@example.com', name: 'Updated User' }
  })
);

export const forgotPasswordApi = jest.fn(() => 
  Promise.resolve({ success: true, message: 'Reset email sent' })
);

export const resetPasswordApi = jest.fn(() => 
  Promise.resolve({ success: true, message: 'Password successfully reset' })
);

export const getOrderApi = jest.fn(() => 
  Promise.resolve({
    success: true,
    orders: [
      {
        _id: '123',
        status: 'done',
        name: 'Метеоритный бургер',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        number: 12345,
        ingredients: ['60666c42cc7b410027a1a9b1']
      }
    ]
  })
);

export const getOrdersApi = jest.fn(() => 
  Promise.resolve({
    success: true,
    orders: [
      {
        _id: '123',
        status: 'done',
        name: 'Метеоритный бургер',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        number: 12345,
        ingredients: ['60666c42cc7b410027a1a9b1']
      }
    ],
    total: 1,
    totalToday: 1
  })
);
