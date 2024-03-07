import { BlogCard } from "../components/BlogCard"
import { Appbar } from "../components/AppBar"
import { useBlogs } from "../hooks"
import { BlogSkeleton } from "../components/Skeleton"

export const Blogs = () =>{

    const {blogs, loading} = useBlogs();

    if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <div>
        <Appbar></Appbar>
   
    
    <div className="flex justify-center">
        

        <div className="max-w-xl">
            {blogs.map (blog => <BlogCard   id={blog.id}  authorName={blog.author.name} content={blog.content} publishedDate="21/11/2003" title={blog.title} ></BlogCard> )}
        </div>

        </div>
  
       
    </div>
}