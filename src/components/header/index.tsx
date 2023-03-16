import Link from 'next/link';
import styles from './styles.module.css';

export function Header() {
  return (
    <header className={styles.header}>
        <section className={styles.content}>
            <nav className={styles.nav}>
                <Link href="/">
                    <h1 className={styles.logo}>
                        Artigos
                        <span>+</span>
                    </h1>
                </Link>
                <Link className={styles.link} 
                    href="/dashboard">
                    Meu painel
                </Link>
            </nav>
            <button className={styles.loginButton}>
                Acessar
            </button>
        </section>
    </header>
  )
}