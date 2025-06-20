import Header from '../../components/Header';

import { useState } from 'react';
import axios from 'axios';

import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            //POSTリクエスト  
            const res = await axios.post('http://localhost:8000/api-auth/token/', {
                username : email,
                password,
            });

            //RESPONCEは、JWTトークン　accessとreflesh
            login(res.data.access, res.data.refresh); //useAuthによってローカルストレージにも、Reactにもトークンを保存


            navigate('/top');
        } catch {
            alert('ログイン失敗');
        }
    };

    return (
        <>
            <Header />
            <form onSubmit={handleSubmit}>
                <p>メールアドレス  <input type="email" value={email} onChange={e => setEmail(e.target.value)} /></p>
                <p>パスワード  <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></p>
                <button type="submit">ログイン</button>
            </form>
        </>
    );
}
export default LoginPage;