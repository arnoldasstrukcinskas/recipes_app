import { createContext, useState } from "react";

export const AuthContext = createContext();

function getStoragedUser() {
    const storaged = localStorage.getItem("user");
    if (storaged) {
        return JSON.parse(storaged);
    }
    return null;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoragedUser)

    const isAuthenticated = user != null

    function login(user) {
        const storaged = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        setUser(storaged);
        localStorage.setItem("user", JSON.stringify(storaged))
    }

    function logout() {
        setUser(null);
        localStorage.removeItem("user");
    }

    const value = { user, isAuthenticated, login, logout };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}