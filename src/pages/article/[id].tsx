import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { doc, collection, query, getDoc, where } from "firebase/firestore";

export default function Article() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Article</h1>
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

  return {
    props: {},
  };
};
