// src/components/PrivateRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { email } = useSelector((state: any) => state.user);
  console.log("PrivateRoute email:", email);
  return email ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
