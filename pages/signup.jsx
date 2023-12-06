import Head from "next/head";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import { useState } from "react";
import styles from "../styles/login.module.css";
import { useRouter } from "next/router";
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

export default function Signup(props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "", // Changed to camelCase for consistency
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  }

  async function handleCreateAccount(e) {
    e.preventDefault();
    const { username, password, confirmPassword } = formData;
    if (!username) return setError("Username is required");
    if (!password) return setError("Password is required");
    if (password !== confirmPassword) return setError("Passwords must match");

    try {
      const res = await fetch("/api/auth/signup", {
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
        <title>InfoStreamline Signup</title>
        <meta name="description" content="Sign up for InfoStreamline" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>"
        />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main className={styles.main}>
        <h1>Create Your InfoStreamline Account</h1>

        <form className={styles.form} onSubmit={handleCreateAccount}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
            value={formData.username}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleChange}
            value={formData.confirmPassword}
          />

          <button type="submit" className={styles.loginButton}>
            Sign Up
          </button>

          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>

        <p className={styles.signupPrompt}>
          Already have an account? <Link href="/login">Log in here</Link>
        </p>
      </main>
    </>
  );
}
