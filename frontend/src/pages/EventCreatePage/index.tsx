import styles from './styles.module.css';

// import axios from 'axios';  
import api from "../../lib/axios";
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';  //(useEffect)
import Header from "../../components/Header"


function EventCreatePage () {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [datetime, setDatetime] = useState("");
    const [endmessage, setEndmessage] = useState("");
    // const [user, setUser] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            //POSTリクエスト  
            await api.post('/events/', {
                title,
                description,
                event_datetime:datetime,
                end_message:endmessage,            
            });
            navigate('/top');
        } catch (err) {
            alert('作成に失敗しました');
        }
    };

    return (
        <>
            <Header />
            <h1 className={styles.title}>作成するイベント</h1>
            <form onSubmit={handleSubmit}> 
                <p>タイトル  <input type="text" value={title} onChange={e => setTitle(e.target.value)} /></p>
                <p>説明  <input type="text" value={description} onChange={e => setDescription(e.target.value)} /></p>
                <p>日付  <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} /></p>
                <p>表示メッセージ  <input type="text" value={endmessage} onChange={e => setEndmessage(e.target.value)} /></p>
                <button type="submit">作成</button>
            </form>


        </>
    );
}
export default EventCreatePage;