import { User, Order, Address } from '../types';
import { ALL_PRODUCTS } from './mockProducts';

export const DEMO_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Amar Gupta',
    phone: '+91 98765 43210',
    addressLine1: 'Flat 402, Sea Green Apartments, Worli Sea Face',
    addressLine2: 'Near Old Passport Office',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    isDefault: true,
    type: 'home',
  },
  {
    id: 'addr-2',
    fullName: 'Amar Gupta (Tech Hub)',
    phone: '+91 98765 43210',
    addressLine1: 'ShopNest India HQ, 5th Floor, Indiranagar 100ft Road',
    addressLine2: 'Opposite Metro Pillar 180',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    isDefault: false,
    type: 'work',
  },
];

export const DEMO_USER: User = {
  id: 'user-001',
  name: 'Amar Gupta',
  email: 'amar.gupta@shopnest.com',
  phone: '+91 98765 43210',
  role: 'customer',
  addresses: DEMO_ADDRESSES,
  defaultAddressId: 'addr-1',
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SN-98234-IN',
    date: '2026-10-02T14:32:00Z',
    items: [
      {
        product: ALL_PRODUCTS[0], // Sony WH-1000XM5
        quantity: 1,
        selectedVariants: { color: 'Black' },
      },
      {
        product: ALL_PRODUCTS[14], // Atomic Habits
        quantity: 1,
      },
    ],
    shippingAddress: DEMO_ADDRESSES[0],
    paymentMethod: 'UPI',
    paymentDetails: 'amar@okaxis',
    status: 'out_for_delivery',
    subtotal: 27489,
    discount: 2749, // 10% coupon
    deliveryFee: 0,
    tax: 1237,
    totalAmount: 25977,
    estimatedDeliveryDate: 'Today by 8:00 PM',
    trackingUpdates: [
      {
        status: 'ordered',
        label: 'Order Placed & Confirmed',
        date: 'Oct 02, 2:32 PM',
        completed: true,
        detail: 'Payment verified via UPI',
      },
      {
        status: 'shipped',
        label: 'Shipped from Mumbai Fulfillment Hub',
        date: 'Oct 03, 9:15 AM',
        completed: true,
        detail: 'Courier: ShopNest Express Logistics (AWB: SNX908234)',
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        date: 'Oct 05, 8:45 AM',
        completed: true,
        detail: 'Delivery partner Suresh (+91 98231 00192) has left the facility',
      },
      {
        status: 'delivered',
        label: 'Delivered',
        date: 'Expected Today',
        completed: false,
        detail: 'Will be delivered to Flat 402',
      },
    ],
  },
  {
    id: 'SN-96120-IN',
    date: '2026-09-24T10:15:00Z',
    items: [
      {
        product: ALL_PRODUCTS[2], // Samsung 55 TV
        quantity: 1,
      },
    ],
    shippingAddress: DEMO_ADDRESSES[0],
    paymentMethod: 'Card',
    paymentDetails: 'HDFC Bank Visa ending 4921',
    status: 'delivered',
    subtotal: 38990,
    discount: 0,
    deliveryFee: 0,
    tax: 1949,
    totalAmount: 40939,
    estimatedDeliveryDate: 'Delivered on Sep 26, 2026',
    trackingUpdates: [
      {
        status: 'ordered',
        label: 'Order Placed',
        date: 'Sep 24, 10:15 AM',
        completed: true,
      },
      {
        status: 'shipped',
        label: 'Shipped from Bhiwandi Logistics Center',
        date: 'Sep 25, 6:00 AM',
        completed: true,
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        date: 'Sep 26, 11:20 AM',
        completed: true,
      },
      {
        status: 'delivered',
        label: 'Delivered to recipient',
        date: 'Sep 26, 3:45 PM',
        completed: true,
        detail: 'Handed directly to resident',
      },
    ],
  },
];

export const VALID_COUPONS: Record<string, number> = {
  SAVE10: 10, // 10% off
  WELCOME20: 20, // 20% off
  FESTIVE15: 15, // 15% off
  SHOPNEST5: 5, // 5% off
};
