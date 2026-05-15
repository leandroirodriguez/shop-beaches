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

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
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
      {!isAdmin && <Footer />}
    </>
  )
}
