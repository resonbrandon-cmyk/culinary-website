import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import ToastContainer from './components/ToastContainer';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';

function AppContent() {
  const { currentPage } = useApp();

  const isAdminPage = currentPage.startsWith('admin');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'menu':
        return <Menu />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'order-tracking':
        return <OrderTracking />;
      case 'orders':
        return <Orders />;
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'account':
        return <Account />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-products':
        return <AdminProducts />;
      case 'admin-orders':
        return <AdminOrders />;
      case 'admin-customers':
        return <AdminCustomers />;
      case '404':
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-500 selection:text-white">
      {/* Primary Top Bar Contract Navbar */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Interactive Food Customizer Modal */}
      <ProductDetailModal />

      {/* Toast Alert Feed */}
      <ToastContainer />

      {/* Global Footer (shown on public storefront pages) */}
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
