const typeDefs = `#graphql
  type User {
    id: ID
    username: String
    password: String
  }

  type Product {
    id: ID
    name: String
    image: String
    price: Int
  }

  type Query {
    users: [User]
    products: [Product]
  }

  type Mutation {
    SignIn(username: String!, password: String!): User
    SignUp(username: String!, password: String!): User
    SearchProduct(name: String!): [Product]
  }
`

export default typeDefs
