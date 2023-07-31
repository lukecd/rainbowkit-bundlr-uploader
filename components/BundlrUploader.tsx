"use client";

import { useState, useEffect, useRef } from "react";
import getBundlr from "../utils/getBundlr";
import Spinner from "./Spinner";
import fileReaderStream from "filereader-stream";

export const BundlrUploader: React.FC = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileType, setFileType] = useState<string>("");

	const [isStrongProvenance, setIsStrongProvenance] = useState<boolean>(true);
	const [progress, setProgress] = useState<number>(0);
	const [curBalance, setCurBalance] = useState<number>(0);
	const [txProcessing, setTxProcessing] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
			setFileType(event.target.files[0].type);
		}
	};

	const handleUpload = async () => {
		setMessage("");
		if (!selectedFile) {
			setMessage("Please select a file first");
			return;
		}
		setTxProcessing(true);
		const bundlr = await getBundlr();
		if (selectedFile) {
			try {
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

				console.log(`File uploaded ==> https://arweave.net/${tx.id}`);
				setMessage(
					`File <a class="underline" target="_blank" href="https://arweave.net/${tx.id}">uploaded</a>`,
				);
			} catch (e) {
				console.log("Error on upload, ", e);
			}
			setTxProcessing(false);
		}
	};

	const handleStrongProvenanceChange = (checked: boolean) => {
		setIsStrongProvenance(checked);
	};

	return (
		<div className="w-[400px] bg-background rounded-lg shadow-2xl p-5">
			<h2 className="text-2xl text-center font-bold mb-4 text-text">Bundlr Image Uploader</h2>
			<div className="w-full bg-primary h-[200px] rounded-xl">
				{selectedFile && (
					<div>
						<img
							className="w-full h-[200px] rounded-xl resize-none bg-primary object-cover"
							src={URL.createObjectURL(selectedFile)}
							alt="Selected"
						/>
					</div>
				)}
			</div>
			<div className="pr-4 mt-5">
				<div
					className="border-2 border-dashed border-background-contrast rounded-lg p-4 mb-4 text-center"
					onDragOver={(event) => event.preventDefault()}
					onDrop={(event) => {
						event.preventDefault();
						const droppedFiles = Array.from(event.dataTransfer.files);
						setFiles(droppedFiles);
					}}
				>
					<p className="text-background-contrast mb-2">Drag and drop files here</p>
					<input type="file" onChange={handleFileUpload} className="hidden" />
					<button
						onClick={() => {
							const input = document.querySelector('input[type="file"]');
							if (input) {
								input.click();
							}
						}}
						className="px-4 py-2 bg-background-contrast text-background rounded-md border-2 border-background-contrast hover:border-background hover:bg-primary hover:text-background-contrast transition-all duration-500 ease-in-out"
					>
						Browse Files
					</button>
				</div>
				{files.map((file, index) => (
					<div key={index} className="flex items-center mb-2 text-background-contrast">
						<span className="mr-2">{file.name}</span>
					</div>
				))}
				{message && <div className="text-red-500" dangerouslySetInnerHTML={{ __html: message }} />}{" "}
				<button
					className={`mt-5 w-full py-2 px-4 bg-background text-text rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out border-2 border-background-contrast ${
						txProcessing
							? "bg-background-contrast text-white cursor-not-allowed"
							: "hover:bg-background-contrast hover:text-white"
					}`}
					onClick={handleUpload}
					disabled={txProcessing}
				>
					{txProcessing ? <Spinner color="text-background" /> : "Upload"}
				</button>
			</div>
		</div>
	);
};

export default BundlrUploader;
