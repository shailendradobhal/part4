const Blog = require('../models/blog')

const initialState = [
  {
    title: 'React',
    author: 'facebook',
    url: 'https://reactjs.org/',
    likes: 10000,
  },
  {
    title: 'Redux',
    author: 'Dan',
    url: 'https://redux.js.org/',
    likes: 1000,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = { initialState, nonExistingId, blogsInDB }
