import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { doc, collection, query, getDoc, where, addDoc, getDocs } from "firebase/firestore";
import { TextArea } from "@/components/textarea";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

interface ArticleProps {
  item: {
    article: string;
    created: string;
    public: boolean;
    articleId: string;
  };
  allComments: CommentProps[];
}
interface CommentProps {
  id: string;
  comment: string;
  articleId: string;
  user: string;
  name: string;
}

export default function Article({item, allComments}: ArticleProps) {
  const { data: session} = useSession();
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);


  async function handleRegisterComment(event: FormEvent) {
    event.preventDefault();
    
    if(input === '') return;
    if (!session?.user?.email || !session?.user?.name) return;
    console.log(input)
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        articleId: item?.articleId,
      });

      setInput("");
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
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(event.target.value)
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
      <section className={styles.commentsContainer}>
        <h2>Todos os comentários</h2>
        {comments.length === 0 && (
          <span>Nenhum comentário foi encontrado!</span>
        )}
        {comments.map((item) => (
          <article className={styles.comment} key={item.id}>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const docRef = doc(db, "articles", id);

  const q = query(collection(db, "comments"), where("articleId", "==", id));
  const snapshotComments = getDocs(q);

  let allComments: CommentProps[] = [];
  snapshotComments.then((docs) => {
    docs.forEach((doc) => {
      allComments.push({
        id: doc.id,
        comment: doc.data().comment,
        user: doc.data().user,
        name: doc.data().name,
        articleId: doc.data().articleId
      });
    });
  });
  
  console.log(allComments)
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
      item: articles,
      allComments: allComments,
    },
  };
};
