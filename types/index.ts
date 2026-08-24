export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  image: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  date: string;
  total: number;
  paymentStatus: "paid" | "pending";
  orderStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  shippingAddress: string;
  items: OrderItem[];
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
}