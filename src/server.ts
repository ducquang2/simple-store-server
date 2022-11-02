import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { JsonDB, Config } from 'node-json-db'

import typeDefs from './typeDefs'
import { resolversFn } from './resolvers'

async function main() {
  const db = new JsonDB(new Config('./src/db', true, false, '/'))

  const usersTable = await db.exists('/users')
  if (!usersTable) await db.push('/users', [])

  const productsTable = await db.exists('/products')
  if (!productsTable) await db.push('/products', [])

  const server = new ApolloServer({
    typeDefs,
    resolvers: resolversFn(db),
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })
  console.log(`🚀  Server ready at: ${url}`)
}

main().then()
