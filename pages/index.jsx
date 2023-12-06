import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import styles from "../styles/home.module.css";
import Link from "next/link";

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

export default function Home(props) {
  return (
    <>
      <Head>
        <title>InfoStreamline Home</title>
        <meta name="description" content="Welcome to InfoStreamline!" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>"
        />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.container}>
        <h1 className={styles.title}>Welcome to InfoStreamline 🌐</h1>
        <p className={styles.text}>
          InfoStreamline is your gateway to global news and articles, powered by
          NewsAPI.org.
        </p>
        <div className={styles.searchCallout}>
          <Link href="/search" className={styles.button}>
            Search Articles
          </Link>
        </div>
        <section className={styles.faq}>
          <h2 className={styles.faqTitle}>FAQ</h2>
          <p className={styles.faqText}>
            <strong>How does InfoStreamline source its articles?</strong>
          </p>
          <p className={styles.faqText}>
            InfoStreamline uses NewsAPI.org to aggregate news from various
            reputable sources across the globe.
          </p>
          <p className={styles.faqText}>
            <strong>Can I save articles to read later?</strong>
          </p>
          <p className={styles.faqText}>
            Yes, sign up and bookmark any article to revisit at your
            convenience.
          </p>
          <p className={styles.faqText}>
            <strong>
              Is there a cost associated with using InfoStreamline?
            </strong>
          </p>
          <p className={styles.faqText}>
            No, our service is completely free for users.
          </p>
          <div className={styles.humor}>
            <p className={styles.humorText}>
              <strong>Why did the article go to school?</strong>
            </p>
            <p className={styles.humorText}>To become a 'headline'! 😄</p>
          </div>
        </section>
      </main>
    </>
  );
}
