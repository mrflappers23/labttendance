import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RequireAuth({
  children,
  allowedRoles
}) {
  const {
    user,
    profile,
    loading
  } = useAuth();

  // Wait for authentication to finish.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading account...
      </div>
    );
  }

  // No logged-in user.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // No associated LabTrack profile.
  if (!profile) {
    return <Navigate to="/access-pending" replace />;
  }

  // Check the user's permissions.
  if (
    allowedRoles &&
    !allowedRoles.includes(profile.role)
  ) {
    return <Navigate to="/no-access" replace />;
  }

  return children;
}