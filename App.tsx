import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'

const API_KEY =
  'reston::stepzen.net+1000::51b3170c61439c96b74fbe94fbde4c314751f07dea53993b06454e479fd25fc5'

const client = new ApolloClient({
  uri: 'https://reston.stepzen.net/api/ill-stingray/__graphql',
  headers: {
    Authorization: `Apikey ${API_KEY}`,
  },
  cache: new InMemoryCache(),
})

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <Navigation colorScheme={colorScheme} />
        </ApolloProvider>
        <StatusBar />
      </SafeAreaProvider>
    )
  }
}
