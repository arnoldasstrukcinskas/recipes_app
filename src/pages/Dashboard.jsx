import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import RecipeList from '../components/RecipeList.jsx';

function Dashboard() {
    const { user } = useContext(AuthContext);

    return (
        <div className='page'>
            <div className='card wide'>
                <h1>Sveiki, {user.name} 👋</h1>
                <RecipeList />
            </div>
        </div>
    );
}

export default Dashboard;