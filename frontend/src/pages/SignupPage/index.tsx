import Header from '../../components/Header';
import { useState } from 'react';
import api from "../../lib/axios";
import { useNavigate } from 'react-router-dom';


function SignupPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !email || !password) {
            alert("全ての項目を入力してください");
            return;
        }
        try {
            await api.post('http://localhost:8000/api/users/', {
                username,
                email,
                password,
            });

            navigate("/login");
        } catch (error: any) {
            alert("エラーが発生しました");
        }
    }

    return (
        <>
            <Header />
            <h1>Please Sign up</h1>
            <form onSubmit={handleSubmit}>
                <p>ユーザー名  <input type="text" value={username} onChange={e => setUsername(e.target.value)} /></p>
                <p>メールアドレス  <input type="email" value={email} onChange={e => setEmail(e.target.value)} /></p>
                <p>パスワード  <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></p>
                <button type="submit">作成</button>
            </form>
        </>
    );
}
export default SignupPage;