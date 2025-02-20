import { supportedTags } from "@/components/utils/tags";
import { BibleBook, BibleChapter } from "@/graphql/__generated__/graphql";
import { Chapter, VerseMetadata } from "@/model/Chapter";
import * as htmlparser2 from "htmlparser2";

async function parseChapter(bibleBook: BibleBook, chapter: BibleChapter | null): Promise<Chapter> {
    return new Promise((resolve, _reject) => {
        let tags: string[] = []
        let verseTags: string[] = []
        let verses: VerseMetadata[] = []
        let currentVerse: number = 0
        const parser = new htmlparser2.Parser({
            onopentag(name, attributes) {
                switch (name) {
                    case "verse":
                        if (currentVerse > 0) {
                            verses.push({
                                id: `${bibleBook?.shortName} ${chapter?.chapterNumber}:${currentVerse}`,
                                name: `${bibleBook?.shortName} ${chapter?.chapterNumber}:${currentVerse}`,
                                tags: verseTags.join(", "),
                                unsupportedTags: verseTags.filter((tag) => !supportedTags.includes(tag)).join(", "),
                                status: verseTags.filter((tag) => !supportedTags.includes(tag)).length > 0 ? "unsupported" : "supported",
                            })
                            verseTags = []
                        }
                        currentVerse += 1
                        if (!tags.includes(attributes.style)) {
                            tags.push(attributes.style)
                        }
                        if (!verseTags.includes(attributes.style)) {
                            verseTags.push(attributes.style)
                        }
                        break
                    case "para":
                        if (!tags.includes(attributes.style)) {
                            tags.push(attributes.style)
                        }
                        if (!verseTags.includes(attributes.style)) {
                            verseTags.push(attributes.style)
                        }
                        break

                    case "char":
                        if (!tags.includes(attributes.style)) {
                            tags.push(attributes.style)
                        }
                        if (!verseTags.includes(attributes.style)) {
                            verseTags.push(attributes.style)
                        }
                        break
                    default:
                        // console.log(`Unsupported tag: ${name}`);
                        break
                }
            },
            ontext(_text) {

            },
            onclosetag(tagname) {
                if (tagname === "usx") {
                    resolve({
                        id: chapter?.id ?? "",
                        name: `${bibleBook?.shortName} ${chapter?.chapterNumber}`,
                        tags: tags.join(", "),
                        status: tags.filter((tag) => !supportedTags.includes(tag)).length > 0 ? "unsupported" : "supported",
                        unsupportedTags: tags.filter((tag) => !supportedTags.includes(tag)).join(", "),
                        metadata: verses,
                    })
                }
            },
        });
        parser.write(
            chapter?.xml ?? "",
        );
        parser.end();
    })
}

export async function parseChapters(bibleBook: BibleBook | undefined | null): Promise<Chapter[]> {
    return Promise.all(bibleBook?.chapters?.map(async (chapter) => {
        return await parseChapter(bibleBook, chapter);
    }) ?? []);
}