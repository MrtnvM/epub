const assert = require("assert");
const mocha = require("mocha");
const fs = require("fs");
const pEvent = require("p-event");

const EPub = require("../epub");

const getBookPath = (book) => `./example/epub_books/${book}`;

const parseBook = async (path) => {
  const epub = new EPub(path);

  epub.parse();
  await pEvent(epub, "end");

  return epub;
};

mocha.describe("EPub books parsing", () => {
  mocha.it("Check parsing metadata", async () => {
    const epubBooksPaths = fs
      .readdirSync("./example/epub_books")
      .filter((p) => p.endsWith(".epub"));

    for (const book of epubBooksPaths) {
      const bookPath = getBookPath(book);
      let epub;
      let isBookParsed = false;

      try {
        epub = await parseBook(bookPath);
        isBookParsed = true;

        assert.ok(epub.metadata.title);
        assert.ok(epub.metadata.cover);
        assert.ok(epub.metadata.date);
        assert.ok(epub.metadata.creator);
      } catch (error) {
        console.error("FAILED TO PARSE BOOK: " + book);

        if (isBookParsed) {
          console.log(epub.metadata);
        }

        throw error;
      }
    }
  });
});
