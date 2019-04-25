if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb+srv://graygabrielle:uGk5wOInk5GuZf4V@idea-board-7lpkb.mongodb.net/test?retryWrites=true'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/ideaboard-dev'}
}