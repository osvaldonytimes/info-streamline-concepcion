import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import styles from "./styles.module.css";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header className={styles.header}>
      <p>
        <Link href="/">InfoStreamline 🌐</Link>
      </p>
      <div className={styles.links}>
        {props.isLoggedIn ? (
          <>
            <Link href="/savedArticles">Saved Articles</Link>
            <Link href="/search">Search</Link>
            <a href="#" onClick={logout}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link href="/search">Search</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}
