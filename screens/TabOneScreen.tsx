import { gql, useQuery } from '@apollo/client'
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import BookItem from '../components/BookItem/BookItem'
import { Text, View } from '../components/Themed'

const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`

export default function TabOneScreen() {
  const { data, loading, error } = useQuery(query, { variables: { q: 'React Native' } })
  console.log({ data })
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <View>
          <Text lightColor='#f00'>Fetching error: {error.message}</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data.googleBooksSearch.items || []}
          renderItem={({ item }) => (
            <BookItem
              book={{
                image: item.volumeInfo.imageLinks.thumbnail,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors,
                isbn: item.volumeInfo.industryIdentifiers[0].identifier,
              }}
            />
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
