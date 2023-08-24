const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.engine(
  'handlebars',
  exphbs.create({
    defaultLayout: false, 
    extname: '.handlebars' 
  })
);
app.set('view engine', 'handlebars');


app.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync('products.json'));
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  const products = JSON.parse(fs.readFileSync('products.json'));
  res.render('realTimeProducts', { products });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});


io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('addProduct', (newProduct) => {
  
    const products = JSON.parse(fs.readFileSync('products.json'));
    products.push(newProduct);
    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

    io.emit('newProduct', newProduct);
  });
});
