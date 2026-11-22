import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:3001";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const navigate = useNavigate();

    function emailCorrect(emailInput) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!name.trim() || !email.trim() || !password || !password2) {
            setError("Užpildykite visus laukus");
            return;
        }
        if (!emailCorrect(email)) {
            setError("Neteisingas el. pašto formatas");
            return;
        }
        if (password.length < 6) {
            setError("Slaptažodis turi būti bent š simbolių");
            return;
        }
        if (password !== password2) {
            setError("Slaptažodžiai nesutampa");
            return;
        }

        setLoading(true);

        try {
            const emailLowerCase = email.trim().toLowerCase();

            const response = await fetch(`${API}/users?email=${emailLowerCase}`);
            if (!response.ok) {
                throw new Error("Serverio klaida");
            }
            const foundUsers = await response.json();
            if (foundUsers.length > 0) {
                setError("Naudotojas su tokiu el.paštu jau egzituoja");
                setLoading(false);
                return;
            }

            const newUser = {
                name: name.trim(),
                email: emailLowerCase,
                password: password,
            };

            const userResponse = await fetch(`${API}/users`, {
                method: "POST",
                headers: { "Content-Type": "Application/json" },
                body: JSON.stringify(newUser),
            });
            if (!userResponse.ok) {
                throw new Error("Nepavyko išsaugoti naudotojo");
            }

            navigate("/login");
        } catch (err) {
            setError("Nepavyko užsiregistruoti. Patikrinkite, ar veikia serveris.");
        }
        setLoading(false);
    }

    return (
        <div className="form-page">
            <form className="card" onSubmit={handleSubmit}>
                <h2>Registracija</h2>

                {error && <p className="error">{error}</p>}

                <label>Vardas</label>
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Jūsų vardas"
                />

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
                    placeholder="Bent 6 simboliai"
                />

                <label>Pakartokite slaptažodį</label>
                <input
                    type="password"
                    value={password2}
                    onChange={(event) => setPassword2(event.target.value)}
                />

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Kraunama..." : "Registruotis"}
                </button>

                <p className="small-text">
                    Jau turite paskyrą? <Link to="/login">Prisijungti</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;