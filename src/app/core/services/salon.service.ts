import { Injectable } from '@angular/core';

export interface Product {
  id: number,
  price: number,
  name: string
  category: Category
}

export interface courtesyProduct {
  id: number,
  price: number,
  name: string
  category: Category
}

export interface Category {
  id: number,
  name: string
}

export interface CheckProduct {
  product: Product;
  quantity: number;
  notes: string;
  addedAt: Date;
  subtotal: number;
}

export interface Check {
  id: number,
  name: string,
  items: CheckProduct[]
}

export interface Step {
  id: number,
  name: string,
  color: string,
}

export interface DinningTable {
  id: number,
  step: Step,
  name: string,
  checks: Check[],
  openedAt: Date | null,
  closedAt: Date | null
}

@Injectable({
  providedIn: 'root'
})
export class SalonService {
  private dinningTables: DinningTable[] = [];
  private products: Product[] = [];
  private categories: Category[] = [];
  private steps: Step[] = [];
  private checkIdCounter: number = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Categorías
    this.categories = [
      { id: 1, name: 'Entradas' },
      { id: 2, name: 'Pastas' },
      { id: 3, name: 'Pizzas' },
      { id: 4, name: 'Carnes' },
      { id: 5, name: 'Postres' },
      { id: 6, name: 'Bebidas' },
      { id: 7, name: 'Invitacion' }
    ];

    // Productos de restaurante italiano
    this.products = [
      { id: 1, name: 'Bruschetta', price: 8.50, category: this.categories[0] },
      { id: 2, name: 'Carpaccio', price: 12.00, category: this.categories[0] },
      { id: 3, name: 'Caprese', price: 9.50, category: this.categories[0] },
      { id: 4, name: 'Arancini', price: 10.00, category: this.categories[0] },

      { id: 5, name: 'Spaghetti Carbonara', price: 14.50, category: this.categories[1] },
      { id: 6, name: 'Fettuccine Alfredo', price: 13.00, category: this.categories[1] },
      { id: 7, name: 'Lasagna', price: 15.50, category: this.categories[1] },
      { id: 8, name: 'Ravioli', price: 16.00, category: this.categories[1] },

      { id: 9, name: 'Pizza Margherita', price: 12.00, category: this.categories[2] },
      { id: 10, name: 'Pizza Quattro Formaggi', price: 14.50, category: this.categories[2] },
      { id: 11, name: 'Pizza Pepperoni', price: 13.50, category: this.categories[2] },
      { id: 12, name: 'Pizza Prosciutto', price: 15.00, category: this.categories[2] },

      { id: 13, name: 'Ossobuco', price: 22.00, category: this.categories[3] },
      { id: 14, name: 'Saltimbocca', price: 20.00, category: this.categories[3] },
      { id: 15, name: 'Bistecca Fiorentina', price: 28.00, category: this.categories[3] },

      { id: 16, name: 'Tiramisu', price: 7.50, category: this.categories[4] },
      { id: 17, name: 'Panna Cotta', price: 6.50, category: this.categories[4] },
      { id: 18, name: 'Cannoli', price: 7.00, category: this.categories[4] },
      { id: 19, name: 'Gelato', price: 5.50, category: this.categories[4] },

      { id: 20, name: 'Agua Mineral', price: 2.50, category: this.categories[5] },
      { id: 21, name: 'Vino Tinto', price: 18.00, category: this.categories[5] },
      { id: 22, name: 'Vino Blanco', price: 16.00, category: this.categories[5] },
      { id: 23, name: 'Espresso', price: 3.00, category: this.categories[5] },

      { id: 24, name: 'Champagne Invitacion', price: 0, category: this.categories[6] },
      { id: 25, name: 'Aperol Spritz Invitacion', price: 0, category: this.categories[6] },
      { id: 26, name: 'Panera Libertador', price: 0, category: this.categories[6] },
      { id: 27, name: 'Paninos Libertador', price: 0, category: this.categories[6] },
      { id: 28, name: 'Paninos Libertador', price: 0, category: this.categories[6] },
      { id: 29, name: 'Paninos Libertador', price: 0, category: this.categories[6] },
    ];

    // Steps
    this.steps = [
      { id: 1, name: 'Sin pedido', color: '#9CA3AF' },
      { id: 2, name: 'Entrada', color: '#ff595e' },
      { id: 3, name: 'Plato principal', color: '#ffca3a' },
      { id: 4, name: 'Postre', color: '#8ac926' },
    ];

    // 12 tables con datos variados
    const now = new Date();

    this.dinningTables = [
      {
        id: 1,
        name: '1',
        step: this.steps[2],
        openedAt: new Date(now.getTime() - 45 * 60000), // Abierta hace 45 minutos
        closedAt: null,
        checks: [
          {
            id: this.checkIdCounter++,
            name: 'Cuenta 1',
            items: [
              {
                product: this.products[0],
                quantity: 2,
                notes: '',
                addedAt: new Date(now.getTime() - 40 * 60000),
                subtotal: this.products[0].price * 2
              },
              {
                product: this.products[4],
                quantity: 1,
                notes: 'Sin ajo',
                addedAt: new Date(now.getTime() - 25 * 60000),
                subtotal: this.products[4].price
              },
              {
                product: this.products[20],
                quantity: 2,
                notes: '',
                addedAt: new Date(now.getTime() - 40 * 60000),
                subtotal: this.products[20].price * 2
              }
            ]
          },
          {
            id: 22,
            name: 'Cuenta 2',
            items: [
              {
                product: this.products[1],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 55 * 60000),
                subtotal: this.products[1].price
              },
              {
                product: this.products[8],
                quantity: 2,
                notes: 'Extra queso',
                addedAt: new Date(now.getTime() - 35 * 60000),
                subtotal: this.products[8].price * 2
              },
              {
                product: this.products[15],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 5 * 60000),
                subtotal: this.products[15].price
              }
            ]
          }
        ]
      },
      {
        id: 2,
        name: '2',
        step: this.steps[0],
        openedAt: null,
        closedAt: null,
        checks: []
      },
      {
        id: 3,
        name: '3',
        step: this.steps[3],
        openedAt: new Date(now.getTime() - 60 * 60000), // Abierta hace 1 hora
        closedAt: null,
        checks: [
          {
            id: this.checkIdCounter++,
            name: 'Cuenta 1',
            items: [
              {
                product: this.products[1],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 55 * 60000),
                subtotal: this.products[1].price
              },
              {
                product: this.products[8],
                quantity: 2,
                notes: 'Extra queso',
                addedAt: new Date(now.getTime() - 35 * 60000),
                subtotal: this.products[8].price * 2
              },
              {
                product: this.products[15],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 5 * 60000),
                subtotal: this.products[15].price
              }
            ]
          }
        ]
      },
      {
        id: 4,
        name: '4',
        step: this.steps[3],
        openedAt: new Date(now.getTime() - 90 * 60000), // Abierta hace 1.5 horas
        closedAt: null,
        checks: [
          {
            id: this.checkIdCounter++,
            name: 'Cuenta 1',
            items: [
              {
                product: this.products[2],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 85 * 60000),
                subtotal: this.products[2].price
              },
              {
                product: this.products[6],
                quantity: 3,
                notes: '',
                addedAt: new Date(now.getTime() - 60 * 60000),
                subtotal: this.products[6].price * 3
              },
              {
                product: this.products[16],
                quantity: 2,
                notes: '',
                addedAt: new Date(now.getTime() - 10 * 60000),
                subtotal: this.products[16].price * 2
              },
              {
                product: this.products[21],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 85 * 60000),
                subtotal: this.products[21].price
              }
            ]
          }
        ]
      },
      {
        id: 5,
        name: '5',
        step: this.steps[1],
        openedAt: new Date(now.getTime() - 15 * 60000), // Abierta hace 15 minutos
        closedAt: null,
        checks: [
          {
            id: this.checkIdCounter++,
            name: 'Cuenta 1',
            items: [
              {
                product: this.products[3],
                quantity: 4,
                notes: '',
                addedAt: new Date(now.getTime() - 10 * 60000),
                subtotal: this.products[3].price * 4
              },
              {
                product: this.products[19],
                quantity: 4,
                notes: '',
                addedAt: new Date(now.getTime() - 10 * 60000),
                subtotal: this.products[19].price * 4
              }
            ]
          }
        ]
      },
      {
        id: 6,
        name: '6',
        step: this.steps[2],
        openedAt: new Date(now.getTime() - 50 * 60000),
        closedAt: null,
        checks: [
          {
            id: this.checkIdCounter++,
            name: 'Cuenta 1',
            items: [
              {
                product: this.products[0],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 45 * 60000),
                subtotal: this.products[0].price
              },
              {
                product: this.products[9],
                quantity: 2,
                notes: 'Una sin hongos',
                addedAt: new Date(now.getTime() - 30 * 60000),
                subtotal: this.products[9].price * 2
              },
              {
                product: this.products[22],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 45 * 60000),
                subtotal: this.products[22].price
              }
            ]
          }
        ]
      },
      {
        id: 7,
        name: '7',
        step: this.steps[0],
        openedAt: null,
        closedAt: null,
        checks: []
      },
      {
        id: 8,
        name: '8',
        step: this.steps[2],
        openedAt: new Date(now.getTime() - 35 * 60000),
        closedAt: null,
        checks: [
          {
            id: this.checkIdCounter++,
            name: 'Cuenta 1',
            items: [
              {
                product: this.products[1],
                quantity: 2,
                notes: '',
                addedAt: new Date(now.getTime() - 30 * 60000),
                subtotal: this.products[1].price * 2
              },
              {
                product: this.products[13],
                quantity: 1,
                notes: 'Término medio',
                addedAt: new Date(now.getTime() - 20 * 60000),
                subtotal: this.products[13].price
              },
              {
                product: this.products[14],
                quantity: 1,
                notes: 'Bien cocido',
                addedAt: new Date(now.getTime() - 20 * 60000),
                subtotal: this.products[14].price
              }
            ]
          }
        ]
      },
      {
        id: 9,
        name: '9',
        step: this.steps[1],
        openedAt: new Date(now.getTime() - 20 * 60000),
        closedAt: null,
        checks: [
          {
            id: this.checkIdCounter++,
            name: 'Cuenta 1',
            items: [
              {
                product: this.products[2],
                quantity: 3,
                notes: '',
                addedAt: new Date(now.getTime() - 15 * 60000),
                subtotal: this.products[2].price * 3
              },
              {
                product: this.products[20],
                quantity: 3,
                notes: '',
                addedAt: new Date(now.getTime() - 15 * 60000),
                subtotal: this.products[20].price * 3
              }
            ]
          }
        ]
      },
      {
        id: 10,
        name: '10',
        step: this.steps[3],
        openedAt: new Date(now.getTime() - 70 * 60000),
        closedAt: null,
        checks: [
          {
            id: this.checkIdCounter++,
            name: 'Cuenta 1',
            items: [
              {
                product: this.products[3],
                quantity: 2,
                notes: '',
                addedAt: new Date(now.getTime() - 65 * 60000),
                subtotal: this.products[3].price * 2
              },
              {
                product: this.products[10],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 45 * 60000),
                subtotal: this.products[10].price
              },
              {
                product: this.products[11],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 45 * 60000),
                subtotal: this.products[11].price
              },
              {
                product: this.products[17],
                quantity: 2,
                notes: '',
                addedAt: new Date(now.getTime() - 8 * 60000),
                subtotal: this.products[17].price * 2
              }
            ]
          }
        ]
      },
      {
        id: 11,
        name: '11',
        step: this.steps[0],
        openedAt: null,
        closedAt: null,
        checks: []
      },
      {
        id: 12,
        name: '12',
        step: this.steps[3],
        openedAt: new Date(now.getTime() - 80 * 60000),
        closedAt: null,
        checks: [
          {
            id: this.checkIdCounter++,
            name: 'Cuenta 1',
            items: [
              {
                product: this.products[0],
                quantity: 2,
                notes: '',
                addedAt: new Date(now.getTime() - 75 * 60000),
                subtotal: this.products[0].price * 2
              },
              {
                product: this.products[5],
                quantity: 1,
                notes: '',
                addedAt: new Date(now.getTime() - 55 * 60000),
                subtotal: this.products[5].price
              },
              {
                product: this.products[7],
                quantity: 1,
                notes: 'Extra salsa',
                addedAt: new Date(now.getTime() - 55 * 60000),
                subtotal: this.products[7].price
              },
              {
                product: this.products[18],
                quantity: 2,
                notes: '',
                addedAt: new Date(now.getTime() - 12 * 60000),
                subtotal: this.products[18].price * 2
              },
              {
                product: this.products[22],
                quantity: 2,
                notes: '',
                addedAt: new Date(now.getTime() - 75 * 60000),
                subtotal: this.products[22].price * 2
              }
            ]
          }
        ]
      }
    ];
  }

  // Métodos públicos para acceder a los datos
  gettables(): DinningTable[] {
    return this.dinningTables;
  }

  gettableById(id: number): DinningTable | undefined {
    return this.dinningTables.find(m => m.id === id);
  }

  getProducts(): Product[] {
    return this.products;
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getSteps(): Step[] {
    return this.steps;
  }

  // Agregar producto a una cuenta
  addProductToCheck(tableId: number, checkId: number, product: Product, quantity: number = 1, notes: string = ''): void {
    const table = this.dinningTables.find(t => t.id === tableId);
    if (table) {
      const check = table.checks.find(c => c.id === checkId);
      if (check) {
        // Buscar si el producto ya existe con las mismas notas
        const existing = check.items.find(item =>
          item.product.id === product.id && item.notes === notes
        );

        if (existing) {
          existing.quantity += quantity;
          existing.subtotal = existing.product.price * existing.quantity;
        } else {
          check.items.push({
            product: product,
            quantity: quantity,
            notes: notes,
            addedAt: new Date(),
            subtotal: product.price * quantity
          });
        }

        this.updateTableStep(tableId, product.category);
      }
    }
  }

  // Eliminar o reducir cantidad de producto
  removeProductFromCheck(tableId: number, checkId: number, itemIndex: number, quantityToRemove: number = 1): void {
    const table = this.dinningTables.find(t => t.id === tableId);
    if (table) {
      const check = table.checks.find(c => c.id === checkId);
      if (check && itemIndex >= 0 && itemIndex < check.items.length) {
        const item = check.items[itemIndex];

        if (item.quantity <= quantityToRemove) {
          check.items.splice(itemIndex, 1);
        } else {
          item.quantity -= quantityToRemove;
          item.subtotal = item.product.price * item.quantity;
        }

        if (check.items.length === 0) {
          table.step = this.steps[0];
        }
      }
    }
  }

  // Cobrar una - limpia todas las cuentas y cierra la table
  payTable(tableId: number): void {
    const table = this.dinningTables.find(t => t.id === tableId);
    if (table) {
      table.checks = [];
      table.closedAt = new Date();
      table.step = this.steps[0]; // Sin pedido
    }
  }

  // Abrir una - crea la primera cuenta
  openTable(tableId: number): void {
    const table = this.dinningTables.find(t => t.id === tableId);
    if (table && table.checks.length === 0) {
      table.openedAt = new Date();
      table.closedAt = null;
      table.checks.push({
        id: this.checkIdCounter++,
        name: 'Cuenta 1',
        items: []
      });
    }
  }

  // Calcular total de una cuenta
  calculateCheckTotal(check: Check): number {
    return check.items.reduce((total, item) => total + item.subtotal, 0);
  }

  // Calcular total de una table
  calculateTableTotal(tableId: number): number {
    const table = this.dinningTables.find(t => t.id === tableId);
    if (table) {
      return table.checks.reduce((total, check) => {
        return total + this.calculateCheckTotal(check);
      }, 0);
    }
    return 0;
  }

  // Cambiar step de según categoría del producto
  updateTableStep(tableId: number, category: Category): void {
    const table = this.dinningTables.find(t => t.id === tableId);
    if (table) {
      switch (category.name) {
        case 'Entradas':
          table.step = this.steps[1];
          break;
        case 'Pastas':
        case 'Pizzas':
        case 'Carnes':
          table.step = this.steps[2];
          break;
        case 'Postres':
          table.step = this.steps[3];
          break;
        case 'Bebidas':
          if (table.step.id === 1) {
            table.step = this.steps[1];
          }
          break;
      }
    }
  }

  // Cambiar step de a "Esperando cuenta"
  requestBill(tableId: number): void {
    const table = this.dinningTables.find(t => t.id === tableId);
    if (table) {
      table.step = this.steps[3];
    }
  }

  // Agregar una nueva cuenta a una table
  addCheckToTable(tableId: number): void {
    const table = this.dinningTables.find(t => t.id === tableId);
    if (table) {
      const checkNumber = table.checks.length + 1;
      table.checks.push({
        id: this.checkIdCounter++,
        name: `Cuenta ${checkNumber}`,
        items: []
      });
    }
  }

  getProductMinutesSinceAdded(addedAt: Date): number {
    const now = new Date();
    const diffInMs = now.getTime() - addedAt.getTime();
    return Math.floor(diffInMs / 60000);
  }
}