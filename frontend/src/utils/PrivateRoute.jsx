import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
    const { authTokens } = useContext(AuthContext);

    return authTokens ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivateRoute;
