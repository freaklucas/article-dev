import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { doc, collection, query, getDoc, where, addDoc } from "firebase/firestore";
import { TextArea } from "@/components/textarea";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

interface ArticleProps {
  item: {
    article: string;
    created: string;
    public: boolean;
    articleId: string;
  }
}

export default function Article({item}: ArticleProps) {
  const { data: session} = useSession();
  const [comments, setComments] = useState("");

  async function handleRegisterComment(event: FormEvent) {
    event.preventDefault();
    
    if(comments === '') return;
    if (!session?.user?.email || !session?.user?.name) return;
    console.log(comments)
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: comments,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        articleId: item?.articleId,
      });

      setComments("");
    } catch (err) {
      console.log(err);
    }
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Artigos</title>
      </Head>

      <main className={styles.main}>
        <h1>Article</h1>
        <article className={styles.article}>
          <p>Artigo: {item.article}</p>
        </article>
      </main>

      <section 
        className={styles.commentsContainer}
      >
        <h2>Fazer um comentário</h2>
        <form onSubmit={handleRegisterComment}>
          <TextArea
            value={comments}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setComments(event.target.value)
            }
            placeholder="Digite seu comentário..." 
          />
        </form>
        <button 
          disabled={!session?.user}
          className={styles.button}
          onClick={handleRegisterComment}
        >
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

  const miliseconds = snapshot.data()
    ?.created?.seconds * 1000;
  const articles = {
    article: snapshot.data()?.article,
    public: snapshot.data()?.public,
    created: new Date(miliseconds)
    .toLocaleDateString(),
    user: snapshot.data()?.user,
    articleId: id
  }

  return {
    props: {
      item: articles
    },
  };
};
