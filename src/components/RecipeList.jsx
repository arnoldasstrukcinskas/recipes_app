import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "./RecipeCard.jsx";
import { FavoritesContext } from "../context/FavoritesContext.jsx";

const LIMIT = 5;

function RecipeList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { actionError } = useContext(FavoritesContext);

    const [recipes, setRecipes] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    let page = parseInt(searchParams.get("page"));

    if (isNaN(page) || page < 1) {
        page = 1;
    }

    const totalPages = Math.ceil(total / LIMIT);

    useEffect(() => {

        async function loadRecipes() {
            setLoading(true);
            setError("");

            try {
                const skip = (page - 1) * LIMIT;
                const response = await fetch(
                    `https://dummyjson.com/recipes?limit=${LIMIT}&skip=${skip}`
                );
                if (!response.ok) {
                    throw new Error("Serverio klaida");
                }
                const data = await response.json();
                setRecipes(data.recipes);
                setTotal(data.total);
            } catch (err) {
                setError("Nepavyko įkelti receptų. Bandykite dar kartą.");
            }
            setLoading(false);
        }

        loadRecipes();

    }, [page]);

    function goBack() {
        setSearchParams({ page: page - 1 });
    }

    function goNext() {
        setSearchParams({ page: page + 1 });
    }

    return (
        <div>
            <h2 className="section-title">Receptai</h2>

            {actionError && <p className="error">{actionError}</p>}
            {loading && <p className="info-text">Kraunama...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && recipes.length === 0 && (
                <p className="info-text">Receptų nerasta.</p>
            )}

            {!loading && !error && (
                <div className="recipe-grid">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}

            {!error && total > 0 && (
                <div className="pagination">
                    <button
                        className="btn btn-small-orange"
                        onClick={goBack}
                        disabled={page <= 1 || loading}
                    >
                        Atgal
                    </button>
                    <span>
                        Puslapis {page} iš {totalPages}
                    </span>
                    <button
                        className="btn btn-small-orange"
                        onClick={goNext}
                        disabled={page >= totalPages || loading}
                    >
                        Kitas
                    </button>
                </div>
            )}
        </div>
    );
}

export default RecipeList;