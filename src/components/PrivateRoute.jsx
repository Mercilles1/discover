import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ isAuth, children }) => {
	return isAuth ? children : <Navigate to='/login' replace />
}

export default PrivateRoute
