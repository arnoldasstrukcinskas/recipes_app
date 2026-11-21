import { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const API = "http://localhost:3001"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError("")

        if (!email.trim() || !password) {
            setError("Įveskite el. paštą ir slaptažodį");
            return;
        }

        setLoading(true);
        try {
            const emailLowers = email.trim().toLocaleLowerCase();

            const response = await fetch(
                `${API}/users?email=${emailLowers}&password=${encodeURIComponent(password)}`
            )
            if (!response.ok) {
                throw new Error("Serverio klaida");
            }

            const foundUsers = await response.json();

            if (foundUsers.length === 0) {
                setError("Neteisingas el. paštas arba slaptažodis");
                setLoading(false);
                return;
            }

            login(foundUsers[0]);
            navigate("/dashboard");
        } catch (err) {
            setError("Nepavyko prisijungti. Patikrinkite, ar veikia serveris.");
        }
        setLoading(false);
    }

    return (
        <div className="form-page">
            <form className="card" onSubmit={handleSubmit}>
                <h2>Prisijungimas</h2>

                {error && <p className="error">{error}</p>}

                <label>El. paštas</label>
                <input
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="vardas@pastas.lt"
                />

                <label>Slaptažodis</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Kraunama..." : "Prisijungti"}
                </button>

                <p className="small-text">
                    Neturite paskyros? <Link to="/register">Registruotis</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;