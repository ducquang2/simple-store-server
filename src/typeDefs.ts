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

  type Cart {
    username: String!
    itemID: ID
    itemCount: Int
  }

  type Query {
    users: [User]
    GetAllProducts: [Product]
    GetCart(username: String!): [Cart]
    GetProductWithID(id: ID!): Product
  }
  
  type Mutation {
    SignIn(username: String!, password: String!): User
    SignUp(username: String!, password: String!): User
    SearchProductName(name: String!): [Product]
    AddToCart(username: String!, itemID: ID!, itemCount: Int!): [Cart]
  }
`

export default typeDefs
