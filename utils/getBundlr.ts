import { WebBundlr } from "@bundlr-network/client";
import { ethers } from "ethers";
import { mainnet, polygonMumbai } from "viem/chains";
import { createWalletClient, custom, parseEther } from "viem";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";

/**
 * Creates a new Bundlr object that will then be used by other
 * utility functions. This is where you set your node address and currency.
 *
 * @returns A reference to a Bundlr object
 */
const getBundlr = async (
	url = "https://devnet.bundlr.network",
	currency = "matic",
	providerUrl = "https://rpc-mumbai.maticvigil.com",
) => {
	console.log("here");
	const client = createWalletClient({
		chain: mainnet,
		transport: custom(window.ethereum),
	});
	//@ts-expect-error injected
	client.getSigner = () => client;
	// client.getAddress = async () => client.getAddresses();
	//@ts-expect-error injected
	client.getAddress = async () => client.getAddresses().then((a) => a[0]);

	console.log("client=", client);
	const bundlr = new WebBundlr(url, currency, client, { providerUrl });

	// @ts-expect-error
	bundlr.currencyConfig.getFee = async (_amount, _to): Promise<number> => {
		return 0;
	};

	// if you're using react hooks:
	bundlr.currencyConfig.sendTx = async (data): Promise<string> => {
		const { sendTransaction } = useSendTransaction(data);
		await sendTransaction?.();
		// make this function return the transaction id
		// think it's
		return data.hash;
	};

	bundlr.currencyConfig.createTx = async (
		amount: string | number,
		to: string,
		_fee?: string,
	): Promise<{ txId: string | undefined; tx: any }> => {
		const { config } = usePrepareSendTransaction({
			to, //@ts-expect-error weird type
			value: parseEther(+amount),
		});
		return { txId: undefined, tx: config };
	};

	//otherwise

	bundlr.currencyConfig.sendTx = async (data): Promise<string> => {
		const hash = await client.sendTransaction({
			to: data.to,
			value: parseEther(data.amount.toString()),
			account: bundlr.address as `0x${string}`,
		});
		return hash;
	};

	bundlr.currencyConfig.createTx = async (amount, to, fee): Promise<{ txId: string | undefined; tx: any }> => {
		// dummy value/method
		return { txId: undefined, tx: { amount, to, fee } };
	};

	await bundlr.ready();
	//@ts-expect-error injected
	client._signTypedData = async (domain, types, message) => {
		message["Transaction hash"] = "0x" + Buffer.from(message["Transaction hash"]).toString("hex");
		//@ts-ignore
		return await client.signTypedData({
			domain,
			message,
			types,
			account: bundlr.address!,
			primaryType: "Bundlr",
		});
	};

	console.log("Connected to: " + bundlr.address);
};

export default getBundlr;
