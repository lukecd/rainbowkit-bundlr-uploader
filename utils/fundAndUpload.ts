import { WebBundlr } from "@bundlr-network/client";
import fileReaderStream from "filereader-stream";
import getBundlr from "../utils/getBundlr";

/**
 */
const fundAndUpload = async (selectedFile: File, fileType: String) => {
	try {
		const bundlr = await getBundlr();
		console.log("got bundlr=", bundlr);
		console.log("got selectedFile=", selectedFile);
		const dataStream = fileReaderStream(selectedFile);
		const price = await bundlr.getPrice(selectedFile?.size);
		const balance = await bundlr.getLoadedBalance();

		if (price.isGreaterThanOrEqualTo(balance)) {
			console.log("Funding node.");
			await bundlr.fund(price);
		} else {
			console.log("Funding not needed, balance sufficient.");
		}

		const tx = await bundlr.upload(dataStream, {
			tags: [{ name: "Content-Type", value: fileType }],
		});
		return tx.id;
	} catch (e) {
		console.log("Error on upload, ", e);
	}
};

export default fundAndUpload;
