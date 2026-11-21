import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
    const { user } = useContext(AuthContext);

    return (
        <div className='page'>
            <div className='card wide'>
                <h2>Sveiki, {user.name} 👋</h2>
                <p>El. paštas: {user.email}</p>
                <p>Čia kitose dalyse atsiras receptai ir mėgstamiausi.</p>
            </div>
        </div>
    );
}

export default Dashboard;