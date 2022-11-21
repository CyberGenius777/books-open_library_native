import React, { useCallback, useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native'
import BookItem from '../components/BookItem/BookItem'
import { Text, View } from '../components/Themed'

import { debounce } from 'lodash'
import { IBook } from '../types/IBook'

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
  const [searchValue, setSearchValue] = useState<string>('')
  const [sendQuery, { data, loading, error }] = useLazyQuery(query)
  const [provider, setProvider] = useState<'googleBooksSearch' | 'openLibrarySearch'>(
    'googleBooksSearch',
  )

  const loadData = useCallback(debounce(sendQuery, 300), [])

  const onSearchHandler = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setSearchValue(e.nativeEvent.text)
    loadData({ variables: { q: searchValue } })
  }

  const getBookDataFrom = (item: any): IBook => {
    if (provider === 'googleBooksSearch') {
      return {
        image: item.volumeInfo?.imageLinks?.thumbnail,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        isbn: item.volumeInfo?.industryIdentifiers?.[0]?.identifier,
      }
    }
    return {
      image: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,
      title: item.title,
      authors: item.author_name,
      isbn: item.isbn,
    }
  }

  useEffect(() => {
    loadData({ variables: { q: 'React Native' } })
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.input} placeholder='Search...' onChange={onSearchHandler} />
      </View>

      <View style={styles.tabs}>
        <Text
          style={provider === 'googleBooksSearch' ? { fontWeight: 'bold', color: 'royalblue' } : {}}
          onPress={() => setProvider('googleBooksSearch')}>
          Google Books
        </Text>
        <Text
          style={provider === 'openLibrarySearch' ? { fontWeight: 'bold', color: 'royalblue' } : {}}
          onPress={() => setProvider('openLibrarySearch')}>
          Open Library
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <View>
          <Text lightColor='#f00'>Fetching error: {error.message}</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={
            (provider === 'googleBooksSearch'
              ? data?.googleBooksSearch?.items
              : data?.openLibrarySearch.docs) || []
          }
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.noData}>
              <Text>No data</Text>
            </View>
          )}
          renderItem={({ item }) => <BookItem book={getBookDataFrom(item)} />}
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
  header: {
    marginVertical: 15,
  },
  input: {
    borderColor: '#cdcdcd',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
  },
  noData: {
    alignItems: 'center',
  },
})
