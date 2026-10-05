export type ProductCategory =
  | 'Electronics'
  | 'Fashion'
  | 'Home & Kitchen'
  | 'Books'
  | 'Beauty'
  | 'Sports'
  | 'Toys'
  | 'Grocery';

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface ProductVariant {
  type: 'color' | 'size' | 'storage';
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  brand: string;
  price: number; // in INR ₹
  mrp: number; // Original Price for strikethrough
  discountPercent: number;
  rating: number; // 1-5
  ratingCount: number;
  stock: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  fastDelivery: boolean; // Prime-like ShopNest Express
  isBestSeller?: boolean;
  isDeal?: boolean;
  dealTag?: string;
  reviews: ProductReview[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface SavedItem {
  product: Product;
  selectedVariants?: Record<string, string>;
  savedAt: string;
}

export type OrderStatus = 'ordered' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  date: string;
  completed: boolean;
  detail?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'home' | 'work';
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
  paymentDetails?: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  estimatedDeliveryDate: string;
  trackingUpdates: TrackingStep[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  defaultAddressId?: string;
}

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface FilterState {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  rating: number; // e.g. 4 for 4+ stars
  fastDeliveryOnly: boolean;
  discountMin: number; // e.g. 10 for 10%+
  selectedBrands: string[];
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}
