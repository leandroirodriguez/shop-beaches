import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AllProductsPage from './pages/AllProductsPage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminProductNew from './pages/AdminProductNew'
import AdminProductEdit from './pages/AdminProductEdit'
import AdminCategories from './pages/AdminCategories'
import AdminCategoryEdit from './pages/AdminCategoryEdit'
import AdminBlog from './pages/AdminBlog'
import AdminBlogNew from './pages/AdminBlogNew'
import AdminBlogEdit from './pages/AdminBlogEdit'
import MainClonePage from './pages/MainClonePage'
import MISClonePage from './pages/MISClonePage'
import AboutClonePage from './pages/AboutClonePage'
import NewClonePage from './pages/NewClonePage'
import ContactClonePage from './pages/ContactClonePage'
import OBClonePage from './pages/OBClonePage'
import GynClonePage from './pages/GynClonePage'
import HRTClonePage from './pages/HRTClonePage'

export default function App() {
  const { pathname } = useLocation()
  // Admin pages and the hidden /mainclone prototype render standalone,
  // without the shop chrome
  const isStandalone =
    pathname.startsWith('/admin') ||
    ['/mainclone', '/misclone', '/aboutclone', '/newclone', '/contactclone', '/obclone', '/gynclone', '/hrtclone'].includes(pathname)

  return (
    <>
      {!isStandalone && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mainclone" element={<MainClonePage />} />
        <Route path="/misclone" element={<MISClonePage />} />
        <Route path="/aboutclone" element={<AboutClonePage />} />
        <Route path="/newclone" element={<NewClonePage />} />
        <Route path="/contactclone" element={<ContactClonePage />} />
        <Route path="/obclone" element={<OBClonePage />} />
        <Route path="/gynclone" element={<GynClonePage />} />
        <Route path="/hrtclone" element={<HRTClonePage />} />
        <Route path="/shop" element={<AllProductsPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AdminProductNew />} />
        <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/categories/:id/edit" element={<AdminCategoryEdit />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/blog/new" element={<AdminBlogNew />} />
        <Route path="/admin/blog/:id/edit" element={<AdminBlogEdit />} />
      </Routes>
      {!isStandalone && <Footer />}
    </>
  )
}
