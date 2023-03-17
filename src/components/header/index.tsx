import Link from "next/link";
import styles from "./styles.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const [hover, setHover] = useState(false);
  const { data: session, status } = useSession();

  const handleMouseEnter = () => {
    setHover(true);
  }
  const handleMouseLeave = () => {
    setHover(false);
  }

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
          {session?.user && (
            <Link className={styles.link} href="/dashboard">
              Meu painel
            </Link>
          )}
        </nav>
        {status === "loading" ? (
          <>Loading...</>
        ) : session ? (
          <button 
            className={styles.loginButton} 
            onClick={() => signOut()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
           { hover ? 'Clique para sair' :  `Olá ${session?.user?.name}`}
          </button>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
