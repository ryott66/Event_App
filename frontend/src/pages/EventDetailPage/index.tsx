import styles from './styles.module.css';
import Header from '../../components/Header'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { EventDetail } from "../../types"
import api from "../../lib/axios";

function EventDetailPage() {
    const { id, token } = useParams();
    const [event, setEvent] = useState<EventDetail|null>(null);

    useEffect(() => {
        if (id) {
            // ログインユーザー向け（主キーで取得）
            api.get(`/events/${id}/`)
                .then((res) => setEvent(res.data))
                .catch((err) => console.error("取得失敗", err));
        } else if (token) {
            // ゲスト閲覧（トークンで取得）
            api.get(`/events/token/${token}/`)
                .then((res) => setEvent(res.data))
                .catch((err) => console.error("取得失敗", err));
        }
    }, [id, token]);

    if (!event) return <p>読み込み中...</p>;

    return (
        <>
            <Header />
            <h1 className={styles.title}>イベント詳細</h1>
            <div className={styles.detail}>
                <p>{event.title}</p>
                <p>{event.description}</p>
                <p>{event.event_datetime}</p>


            </div>

        </>
    );
}

export default EventDetailPage;