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

        const exist = users.find(
          (x) => x.username.toLowerCase() === args.username.toLowerCase()
        )
        if (exist) {
          return exist
        } else {
          throw Error('User not exist')
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
    },
  }
}
