import Footer from '../../layout/Footer.tsx'
import Auth from './Auth.tsx'
import Guide from './Guide.tsx'

const Home = () => {
  return (
    <>
      <div className="grid w-full grid-cols-5 lg:gap-x-4">
        <Auth />
        <Guide />
      </div>
      <Footer />
    </>
  )
}
export default Home
