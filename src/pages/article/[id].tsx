import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { doc, collection, query, getDoc, where } from "firebase/firestore";
import { TextArea } from "@/components/textarea";

interface ArticleProps {
  item: {
    article: string;
    created: string;
    public: boolean;
    articleId: string;
  }
}

export default function Article({item}: ArticleProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Artigo "{item.article}"</title>
      </Head>

      <main className={styles.main}>
        <h1>Article</h1>
        <article className={styles.article}>
          <p>Artigo: {item.article}</p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Fazer um comentário</h2>
        <form>
          <TextArea
            placeholder="Digite seu comentário..." 
          />
        </form>
        <button className={styles.button}>
          Enviar o comentário
        </button>
      </section>

    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const docRef = doc(db, "articles", id);
  const snapshot = await getDoc(docRef);

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if(!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000;
  const articles = {
    article: snapshot.data()?.article,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    articleId: id
  }

  console.log(articles)

  return {
    props: {
      item: articles
    },
  };
};
