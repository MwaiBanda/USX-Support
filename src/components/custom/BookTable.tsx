import { Chapter } from "@/model/Chapter"
import { DataTable } from "./DataTable"
import { BibleBook, BibleBookQuery, BibleBookQueryVariables, BibleBookStub, BibleVersion } from "@/graphql/__generated__/graphql"
import { createChapterComboColumns } from "../utils/columns"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "@/App"
import { parseChapters } from "@/lib/praser"
import { GET_CHAPTERS } from "@/graphql/queries.graphql"
import { useLazyQuery, useQuery } from '@apollo/client';

interface BookTableProps {
}
export function BookTable({  }: BookTableProps) {
    const { version, book, setChapter } = useContext(AppContext)
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentBook, setCurrentBook] = useState<BibleBookStub | undefined>(undefined);
    const [query] = useLazyQuery<BibleBookQuery, BibleBookQueryVariables>(GET_CHAPTERS)
    useEffect(() => {
        if (version && currentBook ) {
            let processed: { id: string, index: number, chapter: Chapter}[] = []
            version.books?.forEach((book, i) => {
                    query({
                        variables: { id: book?.id ?? "" },
                    }).then((res) => {
                        console.log(res, "data", i)
                        if (res.data?.bibleBook) {
                            parseChapters(res.data.bibleBook as BibleBook).then((remote) => {
                              processed.push(
                                {
                                    id: book?.id ?? "",
                                    index: i,
                                    chapter: {
                                        id: "",
                                        name: remote[0]?.name.split(" ").filter((_n, i) => remote[0]?.name.split(" ").length == 3 ? i < 2 : i < 1).join(" ") ?? "",
                                        status: "unsupported",
                                        tags: "",
                                        unsupportedTags: [...new Set(remote.flatMap((chapter) => chapter.unsupportedTags.split(",").map((tag) => tag.trim())))].filter((tag) => tag !== "").join(", "),
                                        metadata: remote.filter((chapter) => chapter.status === "unsupported").flatMap((chapter) => chapter.metadata).filter((verse) => verse.status === "unsupported")
                                    } as Chapter
                                }
                              )
                              if (processed.length === 66) {
                                console.log("Done", processed)
                                setChapters([processed.find((data) => data.id === currentBook?.id)!.chapter,  ...processed.sort((a, b) => a.index - b.index).filter((data) => data.id !== currentBook?.id).map((data) => data.chapter)])
                              }
                            });
                          }
                    })
                
            })
        }
        if (currentBook) {
        console.log(currentBook)
        }
    }, [currentBook])

    useEffect(() => {
        setTimeout(() => {
            if (currentBook?.id !== book?.id) {
                setCurrentBook(book)
            }
        }
    , 1000)
    }, [book])

    return <DataTable data={chapters} columns={createChapterComboColumns((chapter) => {
        setChapter(chapter)
    })}
        filter="books"
        showSearch
        showPaginator
        showColumns={false}
    />
}