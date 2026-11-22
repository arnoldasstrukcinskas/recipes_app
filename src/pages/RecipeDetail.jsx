import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";

function RecipeDetail() {
    const { id } = useParams();
    const { isFavorite, isBusy, addFavorite, removeFavorite, loading: favLoading, actionError } = useContext(FavoritesContext);

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {

        async function loadRecipe() {
            setLoading(true);
            setError("");
            setNotFound(false);
            setRecipe(null);

            try {
                const response = await fetch(`https://dummyjson.com/recipes/${id}`);

                if (response.status == 404) {
                    setNotFound(true);

                } else if (!response.ok) {
                    throw new Error("serverio klaida");

                } else {
                    const data = await response.json();

                    setRecipe(data);
                }
            } catch (error) {
                setError("Nepavyko įkelti recepto. Bandykite dar kartą.");
            }
            setLoading(false);
        }
        loadRecipe();

    }, [id]);

    if (loading) {
        return (
            <div className="page">
                <p className="info-text">Kraunama...</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="page">
                <div className="card wide">
                    <p className="error">Receptas nerastas.</p>
                    <Link className="back-link" to="/dashboard">← Atgal į receptus</Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="card wide">
                    <p className="error">{error}</p>
                    <Link className="back-link" to="/dashboard">← Atgal į receptus</Link>
                </div>
            </div>
        );
    }

    const favorite = isFavorite(recipe.id);
    const busy = isBusy(recipe.id);

    function handleFavoriteClick() {
        if (favorite) {
            removeFavorite(recipe.id);
        } else {
            addFavorite(recipe);
        }
    }

    return (
        <div className="page">
            <div className="card wide detail">
                <Link className="back-link" to="/dashboard">← Atgal į receptus</Link>

                <h2>{recipe.name}</h2>
                <img className="detail-img" src={recipe.image} alt={recipe.name} />

                {actionError && <p className="error">{actionError}</p>}

                <button
                    className={favorite ? "btn btn-small-red" : "btn btn-small-orange"}
                    onClick={handleFavoriteClick}
                    disabled={busy || favLoading}
                >
                    {busy
                        ? "Palaukite..."
                        : favorite
                            ? "Pašalinti iš mėgstamiausių"
                            : "Į mėgstamiausius"}
                </button>

                <div className="detail-numbers">
                    <div>
                        <strong>Paruošimas</strong>
                        <span>{recipe.prepTimeMinutes} min.</span>
                    </div>
                    <div>
                        <strong>Gaminimas</strong>
                        <span>{recipe.cookTimeMinutes} min.</span>
                    </div>
                    <div>
                        <strong>Porcijos</strong>
                        <span>{recipe.servings}</span>
                    </div>
                </div>

                <h3>Ingredientai</h3>
                <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>

                <h3>Gaminimo žingsniai</h3>
                <ol>
                    {recipe.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default RecipeDetail;
