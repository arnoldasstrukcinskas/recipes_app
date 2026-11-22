import { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }
    return (
        <nav className="navbar">
            <span className="logo">🍳 Receptai</span>
            <div className="nav-links">
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard">Pagrindinis</Link>
                        <Link to="/favorites">Mėgstamiausi</Link>
                        <span className="nav-user">Sveiki, {user.name}</span>
                        <button className="btn btn-small" onClick={handleLogout}>
                            Atsijungti
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Prisijungti</Link>
                        <Link to="/register">Registruotis</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;