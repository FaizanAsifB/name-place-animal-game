import { redirect } from 'react-router-dom'

const Redirect = () => {
  return <div>Redirect</div>
}
export default Redirect

export const loader = () => {
  return redirect('/')
}
