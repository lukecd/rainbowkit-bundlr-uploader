import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import BundlrUploader from "../components/BundlrUploader";

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>RainbowKit App</title>
				<meta content="Generated by @rainbow-me/create-rainbowkit" name="description" />
				<link href="/favicon.ico" rel="icon" />
			</Head>

			<main className={styles.main}>
				<div className="mb-3">
					<ConnectButton />
				</div>
				<BundlrUploader />
			</main>
		</div>
	);
};

export default Home;
