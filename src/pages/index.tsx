import Head from "next/head";
import styles from "@/styles/home.module.css";
import Image from "next/image";

import heroImg from '../../public/assets/work.png';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>
          ArticleDev | 
          Crie e publique artigos
        </title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image 
            className={styles.hero}
            alt="logo articleDev"
            src={heroImg}
            priority
          />
        </div>
        <h1 className={styles.title}>
          Sistema criado para organização  
          <br /> dos 
          seus artigos
        </h1>
      </main>
    </div>
  );
}
