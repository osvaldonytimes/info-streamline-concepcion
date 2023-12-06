import Head from "next/head";
import styles from "../styles/savedArticles.module.css";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import ArticlesList from "../components/articlesList";
import db from "../db";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    let savedArticles = await db.article.getAll(user.id);
    savedArticles = savedArticles.map((article) => ({
      ...article,
      publishedAt: article.publishedAt.toISOString(),
    }));
    const savedArticlesId = savedArticles.map((article) => article.publishedAt);
    return {
      props: {
        user: user,
        isLoggedIn: !!user,
        savedArticles: savedArticles || [],
        savedArticlesId: savedArticlesId || [],
      },
    };
  },
  sessionOptions
);

export default function SavedArticles(props) {
  return (
    <>
      <Head>
        <title>InfoStreamline Saved Articles</title>
        <meta
          name="description"
          content="Your saved articles on InfoStreamline"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>"
        />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main className={styles.main}>
        <h1 className={styles.title}>Your Saved Articles</h1>
        <ArticlesList
          articles={props.savedArticles}
          isLoggedIn={props.isLoggedIn}
          savedArticles={props.savedArticlesId}
          isSavedArticles={true}
        />
      </main>
    </>
  );
}
