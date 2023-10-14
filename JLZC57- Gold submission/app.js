//import required modules
const express = require('express');
const app = express();
const fs = require('fs');
//allows for the static page to be used
app.use(express.static(__dirname +'/views/'));





//Get request for products
app.get('/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./data/products.json'));
  res.send(products);
});
//get request for items in the cart
app.get('/cart', (req, res) => {
  const cart = JSON.parse(fs.readFileSync('./data/cart.json'));
  res.json(cart);
});
//get request to output the total price
app.get('/cart/total', (req, res) => {
  const cartItems = JSON.parse(fs.readFileSync('./data/cart.json'));
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  res.json(total);
});
//post request for individual items with an id to the cart.json
app.post('/cart/:id', express.json(), (req, res) => {
  const productId = req.params.id;
  const products = JSON.parse(fs.readFileSync('./data/products.json'));
  let cart = JSON.parse(fs.readFileSync('./data/cart.json'));

  const product = products.find(p => p.id === productId);
  if (!product) {
    res.status(404).send('Product not found');
  } else {
    cart.push(product);
    fs.writeFileSync('./data/cart.json', JSON.stringify(cart));
    res.json(cart);
  }
});
//delete request for the cart
app.delete('/cart', (req, res) => {
  fs.writeFileSync('./data/cart.json', '[]');
  res.sendStatus(204);
});
//get request for reviews
app.get('/reviews', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync('./data/reviews.json'));
  res.send(reviews);
});

//post request for reviews
app.post('/reviews', express.json(), (req, res) => {
  const reviews = JSON.parse(fs.readFileSync('./data/reviews.json'));
  const { username, comment, rating } = req.body;
  const newReview = { username, comment, rating };
  reviews.push(newReview);
  fs.writeFileSync('./data/reviews.json', JSON.stringify(reviews));
  res.send(newReview);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

app.on('close', () => {
  console.log('Server disconnected!');
  alert("Server diconnected");
});
