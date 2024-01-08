import Header from '@/layout/Header.tsx'
import Footer from '../../layout/Footer.tsx'
import Auth from './Auth.tsx'
import Guide from './Guide.tsx'

// grid grid-cols-5

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col flex-1">
        <Auth />
        <Guide />
        <Footer />
      </div>
    </div>
  )
}
export default Home
