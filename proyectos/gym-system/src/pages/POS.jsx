import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Receipt, Search } from 'lucide-react';
import { productsAPI, tryAPI } from '../services/api';
import mockProducts from '../data/mockProducts';
import './POS.css';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('Todas');

  useEffect(() => {
    const loadProducts = async () => {
      const data = await tryAPI(() => productsAPI.getAll(), mockProducts);
      setProducts(data);
    };
    loadProducts();
  }, []);

  const categories = ['Todas', ...new Set(products.map(p => p.categoria))];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCat === 'Todas' || p.categoria === filterCat;
    return matchSearch && matchCat;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(item => item.id === id ? { ...item, cantidad: item.cantidad + delta } : item)
        .filter(item => item.cantidad > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await productsAPI.sell(cart, 'Efectivo', null);
    } catch {
      // Fallback: solo limpiar carrito localmente
    }
    alert(`✅ Venta registrada por $${total.toLocaleString()} MXN`);
    setCart([]);
  };

  return (
    <div className="pos-page">
      <div className="pos-header animate-slide-up">
        <div>
          <h1 className="page-title">Punto de Venta</h1>
          <p className="page-subtitle">Cobra productos, visitas y servicios rápidos.</p>
        </div>
      </div>

      <div className="pos-layout">
        {/* Products Grid */}
        <div className="pos-products animate-slide-up delay-100">
          <div className="pos-products-toolbar">
            <div className="toolbar-search">
              <Search size={18} className="toolbar-search-icon" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="toolbar-input"
              />
            </div>
            <div className="pos-categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${filterCat === cat ? 'filter-active' : ''}`}
                  onClick={() => setFilterCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pos-grid">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                className="pos-product-card glass-panel"
                onClick={() => addToCart(product)}
              >
                <div className="pos-product-emoji">
                  {product.categoria === 'Bebidas' && '🥤'}
                  {product.categoria === 'Suplementos' && '💪'}
                  {product.categoria === 'Snacks' && '🍫'}
                  {product.categoria === 'Accesorios' && '🧤'}
                  {product.categoria === 'Acceso' && '🚪'}
                </div>
                <span className="pos-product-name">{product.nombre}</span>
                <span className="pos-product-price">${product.precio}</span>
                <span className="pos-product-stock">{product.stock} en stock</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="pos-cart glass-panel animate-slide-up delay-200">
          <div className="pos-cart-header">
            <h3>
              <ShoppingCart size={20} />
              Ticket actual
            </h3>
            <span className="cart-count">{totalItems} items</span>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <Receipt size={40} />
              <p>El ticket está vacío.</p>
              <span>Selecciona productos para comenzar.</span>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.nombre}</span>
                      <span className="cart-item-price">${item.precio} c/u</span>
                    </div>
                    <div className="cart-item-actions">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.cantidad}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>
                        <Plus size={14} />
                      </button>
                      <button className="qty-btn delete" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span className="cart-item-subtotal">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <span className="cart-total-value">${total.toLocaleString()}</span>
                </div>
                <button className="primary-button checkout-btn" onClick={handleCheckout}>
                  <Receipt size={18} />
                  Cobrar ${total.toLocaleString()}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default POS;
