import Head from "next/head";
import styles from "@/styles/home.module.css";
import Image from "next/image";

import heroImg from '../../public/assets/work.png';
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";


interface HomeProps {
  posts: number;
  comments: number;
}

export default function Home({posts, comments}: HomeProps) {
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
        <div className={styles.ifoContent}>
          <section className={styles.box}>
            <span>+{posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{comments} comentários</span>
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "comments");
  const commentSnapshot = await getDocs(commentRef);

  const postRef = collection(db, "articles");
  const postSnapshot = await getDocs(postRef);

  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentSnapshot.size || 0,
    },
    revalidate: 60
  }
}