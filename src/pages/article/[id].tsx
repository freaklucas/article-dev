import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { doc, collection, query, getDoc, where } from "firebase/firestore";

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
        <article>
          <p>Artigo: {item.article}</p>
        </article>
      </main>
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
