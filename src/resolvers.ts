// @ts-nocheck
import { v4 } from 'uuid'

export function resolversFn(db) {
  return {
    Query: {
      users: async () => {
        return db.getData('/users')
      },
      products: async () => {
        return db.getData('/products')
      },
    },
    Mutation: {
      SignIn: async (parent, args, context, info) => {
        const users = await db.getData('/users')

        const exist = users.find((x) =>
          x.username.toLowerCase() === args.username.toLowerCase()
            ? x.password === args.password
            : ''
        )
        if (exist) {
          console.log(exist)
          return exist
        } else {
          throw Error('username or password is invalid')
        }
      },
      SignUp: async (parent, args, context, info) => {
        const users = await db.getData('/users')

        const exist = users.find(
          (x) => x.username.toLowerCase() === args.username.toLowerCase()
        )
        if (!exist) {
          await db.push('/users', [...users, { ...args, id: v4() }])
          return args
        } else {
          throw Error('User exist')
        }
      },
      SearchProduct: async (parent, args, context, info) => {
        const products = await db.getData('/products')

        const exist = products.find(
          (x) => x.name.toLowerCase() === args.name.toLowerCase()
        )
        if (exist) {
          console.log([exist])
          return [exist]
        } else {
          return []
        }
      },
    },
  }
}
