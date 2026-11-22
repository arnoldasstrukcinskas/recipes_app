import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const FavoritesContext = createContext();

const API = "http://localhost:3001"

export function FavoritesProvider({ children }) {
    const { user } = useContext(AuthContext)

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [busyIds, setBusyIds] = useState([]);

    useEffect(() => {
        // Atsijungus išvalome ankstesnio naudotojo būseną
        if (!user) {
            setFavorites([]);
            setError("");
            setActionError("");
            setBusyIds([]);
            setLoading(false);
            return;
        }

        async function loadFavorites() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`${API}/favorites?userId=${user.id}`);
                if (!response.ok) {
                    throw new Error("Serverio klaida");
                }
                const data = await response.json();

                setFavorites(data);
            } catch (err) {
                setError("Nepavyko įkelti mėgstamiausių receptų. Patikrinkite, ar veikia serveris.");
            }
            setLoading(false);
        }

        loadFavorites();

        // Pasitrigerina tik tada, kai pasikeičia useris.
    }, [user]);

    function isFavorite(recipeId) {
        // Galim sakyti sutrumpintas for ciklas
        return favorites.some((favorite) => favorite.recipeId === recipeId);
    }

    function isBusy(recipeId) {
        return busyIds.includes(recipeId);
    }

    async function addFavorite(recipe) {
        if (!user) return;
        if (isFavorite(recipe.id) || isBusy(recipe.id)) return;

        setActionError("");
        setBusyIds((previous) => [...previous, recipe.id]);

        try {
            const check = await fetch(`${API}/favorites?userId=${user.id}&recipeId=${recipe.id}`);

            if (!check.ok) {
                throw new Error("serverio klaida");
            }

            const existing = await check.json();

            if (existing.length > 0) {
                setFavorites((previous) => [...previous, existing[0]]);
            } else {
                const response = await fetch(`${API}/favorites`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        recipeId: recipe.id,
                        name: recipe.name,
                        image: recipe.image,
                    }),
                });
                if (!response.ok) {
                    throw new Error("Nepavyko išsaugoti");
                }

                const newRecipe = await response.json();
                setFavorites((previous) => [...previous, newRecipe]);
            }

        } catch (error) {
            setActionError("Nepavyko pridėti recepto į mėgstamiausius.");
        }

        setBusyIds((previous) => previous.filter((id) => id !== recipe.id));
    }

    async function removeFavorite(recipeId) {
        if (isBusy(recipeId)) return;

        const record = favorites.find((favorite) => favorite.recipeId === recipeId);

        if (!record) return;

        setActionError("");

        setBusyIds((previous) => [...previous, recipeId]);

        try {
            const response = await fetch(`${API}/favorites/${record.id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Nepavyko pašalinti");
            }
            setFavorites((previous) => previous.filter((favorite) => favorite.id !== record.id));
        } catch (error) {
            setActionError("Nepavyko pašalinti recepto iš mėgstamiausių.");
        }
        setBusyIds((previous) => previous.filter((id) => id !== recipeId));
    }

    const value = {
        favorites,
        loading,
        error,
        actionError,
        isFavorite,
        isBusy,
        addFavorite,
        removeFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}