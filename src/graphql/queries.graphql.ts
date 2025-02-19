import { gql } from '@apollo/client';


export const GET_CHAPTERS = gql`
query BibleBook($id: String!) {
    bibleBook(id: $id) {
        id
        abbreviations
        shortName
        longName
        numberOfChapters
        intro
        testament
        code
        section
        chapters {
            id
            chapterNumber
            maxVerseNumber
            xml
        }
    }
}
`;


export const GET_VERSIONS = gql`
query BibleVersions {
    bibleVersions {
        id
        name
        displayAbbreviation
        books {
            id
            shortName
            longName
            code
        }
    }
}
`;
