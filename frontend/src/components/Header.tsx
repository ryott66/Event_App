import { useNavigate } from 'react-router-dom';


function Header() {

    const navigate = useNavigate();

    return (
        <>
            <header>
                <div className="header-right">
                    <nav>
                        <button onClick={() => navigate('/top')}>Home</button>
                        <button onClick={() => navigate('/login')}>Login</button>
                        <button onClick={() => navigate('/signup')}>Sign up</button>
                    </nav>
                </div>

            </header>
        </>
    );
}
export default Header;