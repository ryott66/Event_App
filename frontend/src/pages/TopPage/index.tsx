//Top Page : Login User and his events

import styles from './styles.module.css'
import Header from '../../components/Header'

import { useEffect, useState } from 'react';
import type { UserDisplay, EventSummary } from "../../types"
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from "../../lib/axios";

function TopPage() {
    const { logout } = useAuth();   
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDisplay>({ id: "", username: "", email:""});
    const [events, setEvents] = useState<EventSummary[]>([]);

    useEffect(() => {
        api.get('/users/me/')
            .then((res) => {
                setUser(res.data);
            })
            .catch((error) => {
                console.error("ユーザ情報を取得できませんでした", error);
            });

        api.get('/users/me/events/')
            .then((res) => {
                setEvents(res.data);
            })
            .catch((error)=>{
                console.error("ユーザのイベント情報を取得できませんでした", error);
            })
    }, []);

    const handleLogout = () => {
        const confirm = window.confirm("ログアウトしますか？");
        if (confirm) {
            logout();
            navigate("/");
        }
    };

    const handleNewEvent = () => {
        navigate("/events/new");
    }

    const handleDetailEvent = (event:EventSummary) => {
        navigate(`/events/${event.id}`);
    }

    return (
        <>
            <Header />
            <h1>Top Page!!</h1>
            <h2>Welcome {user.username}</h2>
            <h3>Your Event</h3>
            <div className={styles.events}>
                {events.map((event) => (
                    <button className={styles.event} onClick={() => handleDetailEvent(event)}>
                        <p>作成者：{event.owner.username}</p>
                        <p>タイトル：{event.title}</p>
                        <p>日付：{event.event_datetime}</p>
                        {/* <button onClick={() => handleDetailEvent(event)}>詳細</button> */}
                    </button>
                ))}
            </div>
            <button onClick={handleNewEvent} className={styles.newEventbtn}>New Event</button>
            <button onClick={handleLogout} className={styles.logoutbtn}>logout</button>

        </>
    );
}
export default TopPage;