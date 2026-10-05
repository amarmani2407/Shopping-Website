import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory, Product, OrderStatus } from '../types';
import { CATEGORIES } from '../data/mockProducts';
import {
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Search,
  Check,
  X,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addToast,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'inventory' | 'orders' | 'analytics'>('inventory');

  // Search & filter for inventory table
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal for Add Product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    description: '',
    category: 'Electronics' as ProductCategory,
    brand: '',
    price: 999,
    mrp: 1499,
    discountPercent: 33,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    fastDelivery: true,
    isDeal: false,
    dealTag: '',
    features: ['High durability engineering', 'Official warranty included'],
    specifications: { 'Warranty': '1 Year' },
  });

  // Inline editing state for product row
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Computed metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => p.stock < 15);

  // Category sales breakdown
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((c) => (counts[c.name] = 0));
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered inventory list
  const filteredInventory = useMemo(() => {
    return products.filter((p) => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchQ =
        !productSearch.trim() ||
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, categoryFilter, productSearch]);

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stock);
  };

  const handleSaveEdit = (id: string) => {
    updateProduct(id, { price: Number(editPrice), stock: Number(editStock) });
    setEditingId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title || !newProductForm.brand) {
      addToast('Please enter product title and brand', 'warning');
      return;
    }

    const calculatedDiscount =
      newProductForm.mrp > newProductForm.price
        ? Math.round(((newProductForm.mrp - newProductForm.price) / newProductForm.mrp) * 100)
        : 0;

    addProduct({
      ...newProductForm,
      discountPercent: calculatedDiscount,
      rating: 4.8,
      ratingCount: 1,
      reviews: [],
    });

    setIsAddModalOpen(false);
    setNewProductForm({
      title: '',
      description: '',
      category: 'Electronics',
      brand: '',
      price: 999,
      mrp: 1499,
      discountPercent: 33,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
      fastDelivery: true,
      isDeal: false,
      dealTag: '',
      features: ['High durability engineering', 'Official warranty included'],
      specifications: { 'Warranty': '1 Year' },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
              ShopNest Seller & Admin Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time fulfillment metrics, dynamic catalog editing, and customer orders dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* 4 HIGHLIGHT METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Gross Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">+18.4% from last week</span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Customer Orders</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
            {totalOrdersCount}
          </p>
          <span className="text-[10px] text-slate-400">All live & processed dispatches</span>
        </div>

        {/* Live Products */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Catalog Products</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
            {products.length}
          </p>
          <span className="text-[10px] text-slate-400">Across 8 marketplace categories</span>
        </div>

        {/* Low Stock Warning */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Low Stock Alerts</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 tabular-nums">
            {lowStockProducts.length}
          </p>
          <span className="text-[10px] text-rose-500 font-semibold">&lt; 15 units remaining</span>
        </div>
      </div>

      {/* Navigation Pills between Sections */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSection('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'inventory'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Product Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveSection('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'orders'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Order Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setActiveSection('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'analytics'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Category Analytics & Insights
        </button>
      </div>

      {/* SECTION 1: INVENTORY MANAGER */}
      {activeSection === 'inventory' && (
        <div className="space-y-4">
          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search catalog products or brands..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (₹)</th>
                  <th className="py-3 px-4">MRP (₹)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInventory.slice(0, 50).map((product) => {
                  const isEditing = editingId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Product title & thumbnail */}
                      <td className="py-3 px-4 flex items-center gap-3 min-w-[240px]">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-10 h-10 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs">
                            {product.title}
                          </p>
                          <span className="text-[11px] text-slate-400">{product.brand}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {product.category}
                      </td>

                      {/* Price (Editable) */}
                      <td className="py-3 px-4 tabular-nums">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs rounded border border-amber-400 bg-white dark:bg-slate-800"
                          />
                        ) : (
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-400 tabular-nums">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </td>

                      {/* Stock (Editable) */}
                      <td className="py-3 px-4 tabular-nums">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-16 px-2 py-1 text-xs rounded border border-amber-400 bg-white dark:bg-slate-800"
                          />
                        ) : (
                          <span
                            className={`font-semibold ${
                              product.stock < 15 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {product.stock} units
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 tabular-nums font-semibold text-amber-500">
                        {product.rating}★ ({product.ratingCount})
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(product.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="p-1.5 text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                              title="Quick edit price and stock"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: ORDERS MANAGER */}
      {activeSection === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer & City</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Dispatch Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">
                        {order.id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(order.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-slate-400">
                        {order.shippingAddress.city}, {order.shippingAddress.pincode}
                      </p>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {order.paymentMethod}
                    </td>

                    {/* Change status dropdown */}
                    <td className="py-3 px-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 appearance-none pr-7 cursor-pointer"
                        >
                          <option value="ordered">Ordered</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: CATEGORY ANALYTICS */}
      {activeSection === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Product Distribution by Department
            </h3>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([catName, count]) => {
                const percent = Math.round((count / products.length) * 100);
                return (
                  <div key={catName} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="font-medium">{catName}</span>
                      <span className="font-bold tabular-nums">
                        {count} items ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Fulfillment Performance
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                <span>ShopNest Express On-Time Delivery Rate</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">99.4%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                <span>Average Fulfillment Time</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">14 Hours</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                <span>Return & Replacement Ratio</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">1.8%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                <span>Buyer Satisfaction Score</span>
                <span className="font-bold text-amber-500">4.8 / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Add New Product to ShopNest
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    placeholder="e.g. Sony"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, category: e.target.value as ProductCategory })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.mrp}
                    onChange={(e) => setNewProductForm({ ...newProductForm, mrp: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  placeholder="Enter detailed description..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProductForm.images[0]}
                  onChange={(e) => setNewProductForm({ ...newProductForm, images: [e.target.value] })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProductForm.fastDelivery}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, fastDelivery: e.target.checked })
                    }
                    className="accent-amber-500"
                  />
                  <span>ShopNest Express Delivery</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProductForm.isDeal}
                    onChange={(e) => setNewProductForm({ ...newProductForm, isDeal: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Mark as Flash Deal</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Publish Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
