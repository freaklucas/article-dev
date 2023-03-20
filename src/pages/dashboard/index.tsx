import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import Head from "next/head";

import { getSession } from "next-auth/react";
import { TextArea } from "@/components/textarea";
import { FiShare2 } from "react-icons/fi";

import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
} from "firebase/firestore";

interface DashboardProps {
  user: {
    email: string;
  };
}

interface ArticleProps {
  id: string;
  created: Date;
  public: boolean;
  article: string;
  user: string;
}

export default function Dashboard({ user }: DashboardProps) {
  const [input, setInput] = useState("");
  const [publicArticle, setPublicArticle] = useState(false);
  const [articles, setArticles] = useState<ArticleProps[]>([]);

  useEffect(() => {
    async function loadArticles() {
      const articlesRef = collection(db, "articles");
      const q = query(
        articlesRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );

      onSnapshot(q, (snapshot) => {
        let list = [] as ArticleProps[];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            article: doc.data().article,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });

        setArticles(list);
      });
    }
    loadArticles();
  }, [user?.email]);

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicArticle(event.target.checked);
  }

  async function handleRegisterArticle(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) {
      alert("Por favor, digite algo no campo TextArea.");
      return;
    }

    try {
      await addDoc(collection(db, "articles"), {
        article: input,
        created: new Date(),
        user: user?.email,
        public: publicArticle,
      });

      setInput("");
      setPublicArticle(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Painel de tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual título do artigo?</h1>
            <form onSubmit={handleRegisterArticle}>
              <TextArea
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
                placeholder="Digite em markdown seu artigo"
              />
              <div className={styles.checkboxArea}>
                <input
                  checked={publicArticle}
                  onChange={handleChangePublic}
                  type="checkbox"
                  className={styles.checkbox}
                />
                <label>Deixar artigo público?</label>
              </div>
              <button type="submit" className={styles.button}>
                Registrar
              </button>
            </form>
          </div>
        </section>
        <section className={styles.articleContainer}>
          <h1>Meus artigos</h1>

          {articles.map((article) => (
            <article key={article.id} className={styles.article}>
              
              {article.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLICO</label>
                  <button className={styles.shareButton}>
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}
              
              <div className={styles.articleContent}>
                <div className={styles.markdownPreview}>
                  <ReactMarkdown>
                    {article.article}
                  </ReactMarkdown>
                </div>
                <button className={styles.trashButton}>
                  <FaTrash size={22} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
