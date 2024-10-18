import React from 'react'

export function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
      <Route
        {...rest}
        render={({ location }) => auth.user ? ( children) : ( 
        <Redirect
              to={{
                pathname: rest.pathname, // "/auth/user/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
  