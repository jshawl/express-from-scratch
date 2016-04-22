//
// hello world
//
var express = require("./express")
var app = express()
var bodyParser = require("./body-parser")
app.listen(3000)
// static routes
app.get("/static", function(req, res){
  res.send("GOT /static")
})
// serve json
app.get("/api", function(req, res){
  res.json({one:1,two:2})
})
// body parser
app.post("/post", function(req, res){
  res.json(req.body)
})
// middleware
app.use(bodyParser)
app.use(function(req, res, next){
  console.log("middleware is being used")
  req.pizza = "yummy"
  next()
})
// dynamic routes

app.get("/users/:name", function(req, res){
  res.json(req.params)
})

app.get("/posts/:post_id/comments/:comment_id", function(req, res){
  res.json(req.params)
})



