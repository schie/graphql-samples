var express = require('express');
var fs = require('fs');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var app = express();

fs.readdir('./samples', (err, items) => {
  var routes = items.map(f => {
    var x = `/graphql/${f.slice(0, -3)}`;
    app.use(x, require(`./samples/${f}`));
    return x;
  });


  var schema = buildSchema(`
      type Query {
        routes: [String]
      }
      `);

  var root = {
    routes: () => routes
  };


  app.use(`/graphql`, graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  }));
});

// logging
function loggingMiddleware(req, res, next) {
  console.log('ip: ' + req.ip) ;
  next();
}

app.use(loggingMiddleware);


app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
