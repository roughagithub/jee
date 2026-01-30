// Interfaces alignées avec les DTO Purchase et PurchaseResponse du backend

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Order {
  totalPrice: number;
  totalQuantity: number;
}

export interface OrderItem {
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  productId: number;
}

export interface Purchase {
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  order: Order;
  orderItems: OrderItem[];
}

export interface PurchaseResponse {
  orderTrackingNumber: string;
}
