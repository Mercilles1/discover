import { Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const PrivateRoute = ({ isAuth }) => {
	return isAuth ? <Dashboard/> : <Navigate to='/login' replace />
}

export default PrivateRoute
