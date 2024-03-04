import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signupInput } from "./zod";

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string
      JWT_KEY: string
    }
  }>();

userRouter.post('/signup', async (c) => {

    const body = await c.req.json();

    
  
    //connecting to prisma acelerate
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
  
  
    //adding to database
    try {
      const user = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password,
          name: body.name
        }
      })
  
  
      //making payload for token generation
      const payload = {
        id: user.id
      }
  
  
      //genrated token
      const token = await sign(payload, c.env.JWT_KEY);
      return c.json({
        jwt: token
      })
  
    } catch (error) {
      console.log(error);
      c.status(411)
      return c.json({
        error: "user already exists"
      })
    }
  
  })
  
  
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
  
    const body = await c.req.json();
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: body.username,
          password : body.password
        }
      })
  
      if (!user) {
        c.status(403)
        return c.json({
          error: "incorrect credintials"
        })
      }
  
      const payload = {
        id: user.id
      }
      const token = await sign(payload, c.env.JWT_KEY);
      return c.json({ token });
  
    } catch (error) {
  
      console.log(error);
      return c.json({ error : "invalid cr" });
  
  
    }
  
  
  
  })