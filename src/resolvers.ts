// @ts-nocheck
import { v4 } from 'uuid'

export function resolversFn(db) {
  return {
    Query: {
      users: async () => {
        return db.getData('/users')
      },
      GetAllProducts: async () => {
        return db.getData('/products')
      },
      GetCart: async (parent, args, context, info) => {
        const carts = await db.getData('/carts')

        const exist = carts.filter(
          (x) => x.username.toLowerCase() === args.username.toLowerCase()
        )

        if (exist) {
          return exist
        } else {
          return []
        }
      },
      GetProductWithID: async (parent, args, context, info) => {
        const carts = await db.getData('/products')

        const exist = carts.find((x) => x.id === args.id)

        if (exist) {
          return exist
        } else {
          return null
        }
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
      SearchProductName: async (parent, args, context, info) => {
        const products = await db.getData('/products')

        const exist = products.find(
          (x) => x.name.toLowerCase() === args.name.toLowerCase()
        )
        if (exist) {
          return [exist]
        } else {
          return []
        }
      },
      AddToCart: async (parent, args, context, info) => {
        const carts = await db.getData('/carts')

        const exist = carts.find((x) =>
          x.username.toLowerCase() === args.username.toLowerCase()
            ? x.itemID === args.itemID
            : ''
        )
        if (exist) {
          return Error('Cart exist')
        } else {
          await db.push('/carts', [...carts, { ...args }])
          return [args]
        }
      },
      UpdateItemCountFromCart: async (parent, args, context, info) => {
        const carts = await db.getData('/carts')

        const exist = carts.find((x) =>
          x.username.toLowerCase() === args.username.toLowerCase()
            ? x.itemID === args.itemID
            : ''
        )

        // exist.itemCount = args.itemCount

        if (exist) {
          // console.log(args.itemID)
          carts.find((x) =>
            x.username.toLowerCase() === args.username.toLowerCase()
              ? x.itemID === args.itemID
                ? (x.itemCount = args.itemCount)
                : ''
              : ''
          )
          // console.log(carts)
          await db.push('/carts', carts)
          return exist
        } else {
          return null
        }
      },
      RemoveFromCart: async (parent, args, context, info) => {
        const carts = await db.getData('/carts')

        const olddata = carts.find((x) =>
          x.username.toLowerCase() === args.username.toLowerCase()
            ? x.itemID === args.itemID
            : ''
        )

        const exist = carts.filter((x) => x !== olddata)

        if (exist) {
          console.log(exist)
          await db.push('/carts', exist)
          return olddata
        } else {
          return null
        }
      },
    },
  }
}
