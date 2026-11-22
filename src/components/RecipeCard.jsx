import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext.jsx";

function RecipeCard({ recipe }) {
    const { isFavorite, isBusy, addFavorite, removeFavorite, loading } =
        useContext(FavoritesContext);

    const favorite = isFavorite(recipe.id);
    const busy = isBusy(recipe.id);

    function handleClick() {
        if (favorite) {
            removeFavorite(recipe.id);
        } else {
            addFavorite(recipe);
        }
    }

    return (
        <div className="recipe-card">
            <img src={recipe.image} alt={recipe.name} />
            <div className="recipe-info">
                <h3>{recipe.name}</h3>
                {recipe.cuisine && <p className="cuisine">Virtuvė: {recipe.cuisine}</p>}
                {favorite && <p className="fav-badge">❤️ Mėgstamas</p>}

                <div className="recipe-actions">
                    <Link className="link-btn" to={`/recipe/${recipe.id}`}>
                        Peržiūrėti
                    </Link>
                    <button
                        className={favorite ? "btn btn-small-red" : "btn btn-small-orange"}
                        onClick={handleClick}
                        disabled={busy || loading}
                    >
                        {busy
                            ? "Palaukite..."
                            : favorite
                                ? "Pašalinti iš mėgstamiausių"
                                : "Į mėgstamiausius"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;