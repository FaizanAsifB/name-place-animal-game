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

// type FormData = {
//   email: string
//   password: string
//   displayName: string
//   _action: string
// }

/* export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData()
  const { _action, ...values } = Object.fromEntries(data) as FormData

  if (_action === 'register') {
    const { displayName, email, password } = values

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      try {
        await updateProfile(res.user, {
          displayName,
        })

        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
        })
      } catch (error) {
        throw new Error('There was an error signing up')
      }
    } catch (error) {
      throw new Error('There was an error signing up')
    }
    return redirect('/')
  }

  if (_action === 'login') {
    const { email, password } = values
    console.log(values)
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      // const user = res.user
      console.log(res)
      return redirect('/')
    } catch (error) {
      throw new Error('There was an error signing in')
    }
  }
} */
