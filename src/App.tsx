import { useQuery } from '@apollo/client';
import './App.css'
import { GET_CHAPTERS, GET_VERSIONS } from './graphql/queries.graphql';
import { BibleBook, BibleBookQuery, BibleBookQueryVariables, BibleVersionsQuery, BibleVersionsQueryVariables } from './graphql/__generated__/graphql';
import { useParams } from 'react-router';
import { DataTable } from './components/custom/DataTable';
import { Chapter } from './model/Chapter';
import React from 'react';
import { parseChapters } from './lib/praser';
import { columns } from './components/utils/columns';
import { Player } from '@lottiefiles/react-lottie-player';

function App() {
  let params = useParams();
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
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
  const { data } = useQuery<BibleVersionsQuery, BibleVersionsQueryVariables>(GET_VERSIONS);

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
    <div className="w-[90vw] py-10">
      <DataTable data={chapters} columns={columns} versions={data}  />
    </div>
  )
}

export default App
