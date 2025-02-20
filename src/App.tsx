import { useQuery } from '@apollo/client';
import './App.css'
import { GET_CHAPTERS, GET_VERSIONS } from './graphql/queries.graphql';
import { BibleBook, BibleBookQuery, BibleBookQueryVariables, BibleBookStub, BibleVersion, BibleVersionsQuery, BibleVersionsQueryVariables } from './graphql/__generated__/graphql';
import { useParams } from 'react-router';
import { DataTable } from './components/custom/DataTable';
import { Chapter } from './model/Chapter';
import { useState, createContext } from 'react';
import { parseChapters } from './lib/praser';
import { createChapterColumns, createChapterComboColumns } from './components/utils/columns';
import { Player } from '@lottiefiles/react-lottie-player';

interface Context {
  chapter: Chapter | undefined;
  version: BibleVersion | undefined;
  book: BibleBookStub | undefined;
  setVersion: (version: BibleVersion) => void;
  setBook: (book: BibleBookStub) => void;
}
export const AppContext = createContext<Context>({
  chapter: undefined,
  version: undefined,
  book: undefined,
  setVersion: () => { },
  setBook: () => { }
});

function App() {
  let params = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapter, setChapter] = useState<Chapter | undefined>(undefined);
  const [version, setVersion] = useState<BibleVersion | undefined>(undefined)
  const [book, setBook] = useState<BibleBookStub | undefined>(undefined)
  const { loading, error } = useQuery<BibleBookQuery, BibleBookQueryVariables>(
    GET_CHAPTERS,
    {
      variables: { id: `${params.version?.toUpperCase()}.${params.book?.toUpperCase()}` },
      onCompleted: (data) => {
        if (data.bibleBook) {
          parseChapters(data.bibleBook as BibleBook).then((chapters) => {
            setChapters(chapters)
            console.log(chapters)
          });
        }
      },
    }
  );
  const { data: versions } = useQuery<BibleVersionsQuery, BibleVersionsQueryVariables>(GET_VERSIONS);

  if (loading) return <div className='w-full'>
    <Player
      autoplay={true}
      loop={true}
      speed={1}
      src={"https://lottie.host/d2d40561-5981-4ca1-a597-a5ad7e6d28c8/8CuIwTKoJq.json"}
      style={{ height: '300px', width: '40%', margin: 'auto' }}
    ></Player>
  </div>
  if (error) return <p>Error : {error.message}</p>

  return (
    <AppContext.Provider value={{
      chapter: chapter,
      version: version,
      book: book,
      setVersion: setVersion,
      setBook: setBook
    }}>
      <div className="w-[90vw] py-10">
        <DataTable
          data={chapters}
          versions={versions}
          height={530}
          columns={createChapterColumns((chapter) => {
            setChapter(chapter)
          })}
          showVersions
          showSearch
          showPaginator
        />
        <DataTable data={[{
          id: book?.id ?? "",
          name: chapters[0]?.name.split(" ")[0] ?? "",
          status: "unsupported",
          tags: "",
          unsupportedTags: [...new Set(chapters.flatMap((chapter) => chapter.unsupportedTags.split(",")))].join(", "),
          metadata: chapters.filter((chapter) => chapter.status === "unsupported").flatMap((chapter) => chapter.metadata).filter((verse) => verse.status === "unsupported")
        } as Chapter]} columns={createChapterComboColumns((chapter) => {
          setChapter(chapter)
        })} />
      </div>
    </AppContext.Provider>
  )
}

export default App
