const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  //clean db
  await Blog.deleteMany({})

  for (let blog of helper.initialState) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialState.length)
})

test('verifies unique identifier property "id"', async () => {
  const response = await api.get('/api/blogs')

  for (let blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Node',
    author: 'Ryan',
    url: 'https://nodejs.org/en/',
    likes: 1000,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDB()

  expect(blogs).toHaveLength(3)
})

test('likes property defaults to 0', async () => {
  const newBlog = {
    title: 'Express',
    author: 'openJS',
    url: 'https://expressjs.com/',
  }

  await api.post('/api/blogs').send(newBlog)

  const blogs = await helper.blogsInDB()

  const newBlogObject = blogs.find((blog) => blog.title === newBlog.title)

  expect(newBlogObject.likes).toBe(0)
})

test('status code 400 if title and url properties missing', async () => {
  const newBlog = {
    likes: 100,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogs = await helper.blogsInDB()

  expect(blogs).toHaveLength(helper.initialState.length)
})

test('delete a note and returns 204 if id is valid', async () => {
  const blogAtStart = await helper.blogsInDB()
  const blogToDelete = blogAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDB()

  expect(blogsAtEnd).toHaveLength(helper.initialState.length - 1)

  const contents = blogsAtEnd.map((blog) => blog.title)

  expect(contents).not.toContain(blogToDelete.title)
})

test('update amount of likes', async () => {
  const blogAtStart = await helper.blogsInDB()
  const blogToUpdate = blogAtStart[0]
  blogToUpdate.likes = 1001

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate).expect(200)

  const blogAtEnd = await helper.blogsInDB()

  expect(blogAtEnd[0].likes).toBe(blogToUpdate.likes)
})

afterAll(() => {
  mongoose.connection.close()
})
