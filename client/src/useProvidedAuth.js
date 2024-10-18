
import React from 'react'

export function useProvideAuth() {

    const [user, setUser] = React.useState(null);

    const { logOut, setCartData } = React.useContext(appContext)


    const signin = cb => {
            setUser(true);
            cb();
    };

    const signout = cb => {
            setUser(null);
            logOut();
            setCartData([]);
            cb();
    };

    const signup = cb => {
            setUser(null);
            cb();
    };

    return {
        user,
        signin,
        signout,
        signup,
        setUser
    };

}

