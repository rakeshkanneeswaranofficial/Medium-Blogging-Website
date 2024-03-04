import { Hono } from 'hono'
import { userRouter } from './route/user'
import { blogRouter } from './route/blog'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_KEY: string
  }
}>();

//all reqeuests comming to /api/v1/user will go to userRouter
app.route("/api/v1/user",userRouter);

// //all reqeuests comming to /api/v1/blog will go to blogRoute
app.route("/api/v1/blog",blogRouter);








export default app
