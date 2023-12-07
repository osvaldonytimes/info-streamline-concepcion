import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import sessionOptions from "../config/session";
import Header from "../components/header";
import { useState, useRef } from "react";
import styles from "../styles/search.module.css";
import ArticlesList from "../components/articlesList";
import db from "../db";
import { NEWS_API_MOCK_RESPONSE } from "../mocks/newsApiMock";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    let savedArticles = [];
    let savedArticlesId = [];
    if (user) {
      props.user = req.session.user;
      savedArticles = await db.article.getAll(user.id);
      savedArticles = savedArticles.map((article) => ({
        ...article,
        publishedAt: article?.publishedAt?.toISOString(),
      }));
      savedArticlesId = savedArticles.map((article) => article.publishedAt);
    }
    props.isLoggedIn = !!user;
    return {
      props: {
        user: user ? user : null,
        isLoggedIn: !!user,
        savedArticles: savedArticles,
        savedArticlesId: savedArticlesId,
      },
    };
  },
  sessionOptions
);

export default function Search(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [previousQuery, setPreviousQuery] = useState();
  const inputRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    if (fetching || !searchTerm.trim() || searchTerm === previousQuery) return;
    setPreviousQuery(searchTerm);
    setFetching(true);
    let response;
    if (process.env.NODE_ENV === "production") {
      response = NEWS_API_MOCK_RESPONSE;
    } else {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          searchTerm
        )}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
      );
      if (res.status !== 200) {
        setFetching(false);
        return;
      }
      response = await res.json();
    }
    const data = {
      ...response,
      articles: response.articles.map((article) => {
        return {
          author: article.author,
          content: article.content,
          description: article.description,
          publishedAt: article.publishedAt,
          sourceId: article.source?.id,
          sourceName: article.source?.name,
          title: article.title,
          url: article.url,
          urlToImage: article.urlToImage,
        };
      }),
    };
    setSearchResults(data);
    setFetching(false);
  }

  return (
    <>
      <Head>
        <title>InfoStreamline Search</title>
        <meta
          name="description"
          content="Search for news articles on InfoStreamline"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>"
        />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />
      <main className={styles.main}>
        <h1 className={styles.title}>News Article Search</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="news-search">Search by keywords:</label>
          <div className={styles.inputGroup}>
            <input
              ref={inputRef}
              type="text"
              name="news-search"
              id="news-search"
              value={searchTerm}
              autoFocus={true}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Submit</button>
          </div>
        </form>
        {fetching ? (
          <span className={styles.loading}>Loading...⌛</span>
        ) : searchResults && searchResults.totalResults > 0 ? (
          <ArticlesList
            articles={searchResults.articles}
            isLoggedIn={props.isLoggedIn}
            savedArticles={props.savedArticlesId}
            isSavedArticles={false}
          />
        ) : searchResults && searchResults.totalResults === 0 ? (
          <div className={styles.noResults}>
            <p>
              <strong>No results found for "{previousQuery}".</strong>
            </p>
          </div>
        ) : null}
      </main>
    </>
  );
}
