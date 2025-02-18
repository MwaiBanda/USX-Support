import { useQuery } from '@apollo/client';
import './App.css'
import { GET_CHAPTERS } from './graphql/queries.graphql';
import { BibleBookQuery, BibleBookQueryVariables } from './graphql/__generated__/graphql';
import { useParams } from 'react-router';

function App() {
  let params = useParams();

  const { loading, error, data } = useQuery<BibleBookQuery, BibleBookQueryVariables>(
    GET_CHAPTERS,
    { variables: { id: `${params.version?.toUpperCase()}.${params.book?.toUpperCase()}` }}
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <>
      {data?.bibleBook?.shortName}
    </>
  )
}

export default App
