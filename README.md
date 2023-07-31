# Bundlr Rainbowkit Uploader

This is a [Bundlr](https://bundlr.network/ + [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) + [Tailwind](https://tailwindcss.com/) project to demonstrate using Bundlr with RainbowKit v1.x.

Users can fork this project and build on top of it, or you can copy and paste pieces into your own project.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## UI

<img width="400" src="https://github.com/lukecd/rainbowkit-bundlr-uploader/blob/main/assets/uploader-ui.png?raw=true" />

The UI demonstrates both the RainbowKit connect button and a file uploader component that uses Bundlr to upload the selected file.

## Files

-   `/utils/getBundlr.ts`: Utility function that connects to a Bundlr node, if you're copy and pasting code into your project, pull from here.
-   `/utils/fundAndUpload.ts`: Utility function. You pass it a File object and fileType, the function checks the price to upload, the checks your current funded balance, funds if necessary, then uploads the file and returns the transaction ID.
-   `/components/BundlrUploader.tsx`: UI component, file uploader
-   `/components/Spinner.tsx`: UI component, spinner that shows when a tx is processing
