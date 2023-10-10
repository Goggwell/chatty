import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
const { convert } = require("html-to-text");

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 100,
});

const URL_EXAMPLE = "https://cyberpunk.fandom.com/wiki/Cyberpunk_Wiki";

export const getDocuments = async () => {
  const loader = new PuppeteerWebBaseLoader(URL_EXAMPLE);
  console.info(`Getting URL from ${URL_EXAMPLE}`);
  const docs = await loader.load();
  return await splitter.createDocuments(
    docs.map((doc) => {
      const text = convert(doc.pageContent).replace(/\n/g, " ");
      return text;
    })
  );
};
