import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createBlogInput , updateBlogInput} from "@rakeshkanneeswaran/mediumblog-common/dist/zod";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_KEY: string
    },
    Variables:{
        userId : string
    }
}>();


blogRouter.use("/*",async (c ,next) => {
    const authHeader = c.req.header("authorization") || " ";

    try {
        const user = await verify(authHeader,c.env.JWT_KEY);
        if (user) {
            c.set("userId" , user.id)
            await next();
        } else {
            c.status(403);
            return c.json({
                "message" : "you are not logged In "
            })
        }
        next();
        
    } catch (error) {
        c.status(400)

        return c.json({
            error : "not authorised"
        })
        
    }
   
})


blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);

    if (!success) {
        c.status(411);
        return c.json({
            error : "inputs not correct"
        })
    }
    const authorId = c.get("userId")
    console.log(authorId)
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    })
    return c.json({
        id: blog.id
    })
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            error : "inputs not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })
    return c.json({
        blog
    })
})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
     try {
        const blog = await prisma.blog.findMany({
            select : {
                content : true,
                title : true,
                id : true,
                author : {
                    select : {
                        name : true
                    }
                }
            }
        })
        return c.json({
            blog

        })
     } catch (error) {
        c.status(411);
        return c.json({
            error : "error occoured"
        })
     }
})


blogRouter.get('/:id', async (c) => {

    const id =  c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(id)
            }
        })
        return c.json({
            blog
        })

    } 
    catch (error) {
        c.status(411);
        return c.json({
            error: "error occured while fetching the data"
        })
    }
})





