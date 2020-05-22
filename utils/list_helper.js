const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, current) => {
    if (prev.likes > current.likes) {
      return prev
    } else {
      return current
    }
  }

  const { title, author, likes } = blogs.reduce(reducer, {})

  if (likes === undefined) return 'List is Empty'

  return {
    title,
    author,
    likes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
