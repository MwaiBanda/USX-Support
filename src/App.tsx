import { useQuery } from '@apollo/client';
import './App.css'
import { GET_CHAPTERS } from './graphql/queries.graphql';
import { BibleBookQuery, BibleBookQueryVariables } from './graphql/__generated__/graphql';

function App() {
  const { loading, error, data } = useQuery<BibleBookQuery, BibleBookQueryVariables>(
    GET_CHAPTERS,
    { variables: { id: 'NLT.JHN' }}
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
