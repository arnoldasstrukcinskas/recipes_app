import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import RecipeCard from "../components/RecipeCard";

function Favorites() {
    const { favorites, loading, error, actionError } = useContext(FavoritesContext);

    return (
        <div className="page-wide">
            <h2 className="section-title">Mėgstamiausi receptai</h2>

            {actionError && <p className="error">{actionError}</p>}
            {loading && <p className="info-text">Kraunama...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && favorites.length === 0 && (
                <p className="info-text">Mėgstamiausių receptų dar nėra.</p>
            )}

            {!loading && !error && favorites.length > 0 && (
                <div className="recipe-grid">
                    {favorites.map((f) => (
                        <RecipeCard
                            key={f.id}
                            recipe={{ id: f.recipeId, name: f.name, image: f.image }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;