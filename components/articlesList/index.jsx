import React from "react";
import styles from "./styles.module.css";
import { useState } from "react";
import Link from "next/link";

const ArticlesList = ({
  articles,
  isSavedArticles,
  isLoggedIn,
  savedArticles,
}) => {
  const [savedArticlesId, setSavedArticlesId] = useState(savedArticles);
  const [data, setArticles] = useState(articles);

  const handleArticleAction = async (article, isSaved) => {
    if (!isLoggedIn) {
      onLoginPrompt();
    } else if (isSaved) {
      await handleRemoveArticle(article);
      if (isSavedArticles) {
        setArticles((currentArticles) =>
          currentArticles.filter((a) => a.publishedAt !== article.publishedAt)
        );
      }
    } else {
      await handleSaveArticle(article);
    }
  };

  const onLoginPrompt = () => {
    alert("Please log in or sign up to save articles.");
  };

  const handleSaveArticle = async (article) => {
    try {
      const response = await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save the article");
      }
      setSavedArticlesId((currentIds) => [...currentIds, article.publishedAt]);
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const handleRemoveArticle = async (article) => {
    try {
      const response = await fetch("/api/article", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete the article");
      }
      setSavedArticlesId((currentIds) =>
        currentIds.filter((articleId) => articleId !== article.publishedAt)
      );
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  return (
    <div>
      <div className={styles.articlesContainer}>
        {data.map((article, index) => (
          <div key={index} className={styles.card}>
            <img
              src={article.urlToImage}
              alt={article.title}
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{article.title}</h2>
              <p className={styles.cardDescription}>{article.description}</p>
              <div className={styles.cardInfo}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cardSource}
                >
                  {article.sourceName}
                </a>
                <span className={styles.cardAuthor}>{article.author}</span>
                <div className={styles.cardFooter}>
                  <span className={styles.cardDate}>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <SaveOrRemoveButton
                    isLoggedIn={isLoggedIn}
                    article={article}
                    savedArticlesId={savedArticlesId}
                    handleArticleAction={handleArticleAction}
                  ></SaveOrRemoveButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.noArticles}>
        {isSavedArticles && data.length === 0 && (
          <div>
            <p>
              <strong>You don't have any articles saved yet.</strong>
            </p>
            <p>
              Explore and <Link href="/search">find articles to save</Link> to
              your list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SaveOrRemoveButton = ({
  isLoggedIn,
  article,
  savedArticlesId,
  handleArticleAction,
}) => {
  // make a date comparison to determine if this article is in the saved list
  const articleDate = new Date(article.publishedAt);
  const savedArticlesDates = savedArticlesId.map((id) => new Date(id));
  const isSaved = !!savedArticlesDates.find(
    (date) => date.getTime() === articleDate.getTime()
  );
  return (
    <span
      className={`${styles.saveButton} ${
        !isLoggedIn ? styles.saveButtonDisabled : " "
      }`}
      onClick={() => handleArticleAction(article, isSaved)}
    >
      {isSaved ? "Remove" : "Save"}
    </span>
  );
};

export default ArticlesList;
