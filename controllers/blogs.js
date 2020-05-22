const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
  response.json(blogs.map((blog) => blog.toJSON()))

  //.catch(error => next(error))
})

router.post('/', async (request, response) => {
  const body = request.body

  if (body.title === undefined && body.url === undefined) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      ...body,
      likes: body.likes ? body.likes : 0,
    })
    const result = await blog.save()
    response.status(201).json(result.toJSON())
  }
})

router.delete('/:id', async (request, response) => {
  console.log('parmas', request.params.id)
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

router.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    ...body,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(updatedBlog.toJSON())
})

module.exports = router
