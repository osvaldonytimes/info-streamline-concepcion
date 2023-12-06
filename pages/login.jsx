import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Login.module.css";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);

export default function Login(props) {
  const router = useRouter();
  const [{ username, password }, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ username, password, ...{ [e.target.name]: e.target.value } });
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim())
      return setError("Both username and password are required.");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) return router.push("/");
      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <>
      <Head>
        <title>InfoStreamline Login</title>
        <meta
          name="description"
          content="Login to access your InfoStreamline account"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>"
        />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main className={styles.main}>
        <h1>Welcome Back to InfoStreamline!</h1>

        <p className={styles.subtitle}>
          Log in to access your personalized news feed.
        </p>

        <form className={styles.form} onSubmit={handleLogin}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
            value={username}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={password}
          />

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>

        <p className={styles.signupPrompt}>
          Need an account? <Link href="/signup">Sign up here</Link>
        </p>
      </main>
    </>
  );
}
