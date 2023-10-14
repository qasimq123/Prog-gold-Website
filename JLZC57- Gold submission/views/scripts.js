//all elements in that are used in the html are assigned
const productList = document.getElementById('product-list');
const cartList = document.getElementById('cart-list');
const reviewList = document.getElementById('review-list');
const addReviewForm = document.getElementById('add-review-form');
const orderButton = document.getElementById('order-cart');
const emptyCartButton = document.getElementById('empty-cart');
const cartTotalDisplay = document.getElementById('cart-total');
//all async functions are called
loadcart();
submitreviews();
fetchreviews();
fetchproducts();
calculateCartTotal();
//calculates the cart 
async function calculateCartTotal() {
  await fetch('/cart/total')
  .then(response => response.json())
  .then(cartTotal => {
    cartTotalDisplay.textContent =`£${cartTotal}`;
  });
}
//fetches products from the server and outputs them in ProductList, also adds items to cart when corresponding buttins are pressed
async function fetchproducts(){ 
await fetch('/products')
  .then(response => response.json())
  .then(products => {
    products.forEach(product => {
      const li = document.createElement('li');
      li.textContent = `${product.name} - ${product.description} `;
      const br = document.createElement('br');
      li.appendChild(br);

      const img = document.createElement('img');
      img.src = product.image;
      li.appendChild(img);
      li.appendChild(br);

      
      const price = document.createElement('span');
      price.textContent = `£${product.price}`;
      li.appendChild(price);

      const addToCart = document.createElement('button');
      addToCart.textContent = 'Add to Cart';
      addToCart.id = `add-to-cart-${product.id}`;
      addToCart.addEventListener('click', () => {
        fetch(`/cart/${product.id}`, { method: 'POST' })
          .then(response => response.json())
          .then(cart => {
            cartList.innerHTML = '';
            cart.forEach(item => {
              const cartLi = document.createElement('li');
              cartLi.textContent = `${item.name} - £${item.price}`;
              cartList.appendChild(cartLi);
            });
            calculateCartTotal();
          });
      });
      li.appendChild(addToCart);

      productList.appendChild(li);
    });
  });
}
//loads the cart when the site loads, by fetching products from cart
async function loadcart(){
  await fetch('/cart')
  .then(response => response.json())
  .then(cartItems => {
    cartList.innerHTML = '';
    cartItems.forEach(item => {
      const cartLi = document.createElement('li');
      cartLi.textContent = `${item.name} - £${item.price}`;
      cartList.appendChild(cartLi);
    });
  })
  .catch(error => {
    console.error('Error fetching cart data:', error);
  });
}
//empties the cart when the button is pressed
  emptyCartButton.addEventListener('click', () => {
    fetch('/cart', { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          cartList.innerHTML = '';
          cartTotalDisplay.innerHTML = '';
        } else {
          console.log('Error emptying cart');
          alert("Cart is already empty!");
        }
      })
      .catch(error => console.error(error));
  });
//empties the cart and gives an alert when the button is pressed
  orderButton.addEventListener('click', () => {
    fetch('/cart', { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          cartList.innerHTML = '';
          cartTotalDisplay.innerHTML = '';
          alert("Thank you for your order!");
        } else {
          console.log('Error emptying cart');
          alert("Cart is empty, please add some items first!");
        }
      })
      .catch(error => console.error(error));
  });
// Fetch reviews from server

async function fetchreviews(){  
  await fetch('/reviews')
  .then(response => response.json())
  .then(reviews => {
    reviews.forEach(review => {
      const li = document.createElement('li');
      li.textContent = `${review.username}: ${review.comment} (${review.rating} \u2B50 )`;
      reviewList.appendChild(li);
      const br = document.createElement('br');
      reviewList.appendChild(br);
    });
  });
}

// Add review form submit event listener
async function submitreviews(){ 
await addReviewForm.addEventListener('submit', event => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const comment = document.getElementById('comment').value;
  const rating = document.getElementById('rating').value;
  fetch('/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, comment, rating })
  })
  .then(response => response.json())
  .then(newReview => {
    const li = document.createElement('li');
    li.textContent = `${newReview.username}: ${newReview.comment} (${newReview.rating} \u2B50 )`;
    reviewList.appendChild(li);
    addReviewForm.reset();
  });
});
}

  

