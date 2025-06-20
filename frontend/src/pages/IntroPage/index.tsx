// introduction page : do not need login
import styles from './styles.module.css';
import Header from '../../components/Header'

function IntroPage() {
    return (
        <>
            <Header />
            <h1 className={styles.title}>Welcome to Event_App</h1>
        </>
    );
}
export default IntroPage;