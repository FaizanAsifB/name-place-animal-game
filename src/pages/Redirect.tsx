import { redirect } from 'react-router-dom'

const Redirect = () => {
  return <div>Redirect</div>
}
export default Redirect

// eslint-disable-next-line react-refresh/only-export-components
export const loader = () => {
  return redirect('/')
}
