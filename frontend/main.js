// Handle forms
document.body.addEventListener('submit', async event => {
  // Prevent default behavior (page reload)
  event.preventDefault();
  // Get info about the form
  let form = event.target;
  let route = form.getAttribute('action');
  let method = form.getAttribute('method');
  // Collect the data from the form
  // (does not work with check and radio boxes yet)
  let requestBody = {};
  for (let { name, value } of form.elements) {
    if (!name) { continue; }
    requestBody[name] = value;
  }
  // Send the data via our REST api
  let rawResult = await fetch(route, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  let result = await rawResult.json();
  console.log(result);
  // Empty the fields
  for (let element of form.elements) {
    if (!element.name) { continue; }
    element.value = '';
  }
  // Non-generic code, speficic for the Add product form
  form.style.display = 'none';
  document.querySelector('.Add-products').style.display = 'block';
  document.querySelector('.Add-stores').style.display = 'block';
  document.querySelector('.Add-quantity').style.display = 'block';

  await getProducts();
  await getStores();
  await getStocks();
});

// Show form on button click in Product Page
document.body.addEventListener('click', event => {
  let changeProductButton = event.target.closest('.Add-products');
  if (!changeProductButton) { return; }
  document.querySelector('.add-products').style.display = 'block';
  changeProductButton.style.display = 'none';
});

// Show form on button click in Store Page
document.body.addEventListener('click', event => {
  let changeProductButton = event.target.closest('.Add-stores');
  if (!changeProductButton) { return; }
  document.querySelector('.add-stores').style.display = 'block';
  changeProductButton.style.display = 'none';
});

// Show form on button click in Store Page
document.body.addEventListener('click', event => {
  let changeProductButton = event.target.closest('.Add-quantity');
  if (!changeProductButton) { return; }
  document.querySelector('.add-quantity').style.display = 'block';
  changeProductButton.style.display = 'none';
});

//---------------------Product Page---------------------------
//Fetch all the Product Details 
async function getProducts() {
  let rawData = await fetch('/api/productsList');
  let allStocks = await rawData.json();
  console.log(allStocks);
  let html = '';
  for (let { id, productImage, productName } of allStocks) {
    html += `
     <div class = "products" id = "id${id}">
     <img src=${productImage}>
     <th>${productName}</th>
     <td><button class="change-button" id="change-${id}">Change</button></td>
     <td><button class="delete-button" id="delete-${id}">Delete</button></td>
     </div>
    `;
  }
  let productList = document.querySelector('.Find-all-products');
  productList.innerHTML = html;
  //document.body.prepend(productList);
  window.scrollTo(0, 0);
}

// To click and view the details on products
function ClickToProduct() {
  document.body.addEventListener('click', async (event) => {

    // get the productDiv that the user click on
    let productDiv = event.target.closest('.products');

    // if not click on a productDiv do nothing
    if (!productDiv) {
      return;
    }

    // if the product div already has a details element do nothing
    if (productDiv.querySelector('details')) { return; }

    // remove all old details
    // (only only one product shown with details at a time)
    let allDetailsParas = document.querySelectorAll('.details');
    for (let detailpara of allDetailsParas) {
      detailpara.remove();
    }

    // Read the id of the product and make a fetch
    // of the detailed product info
    let id = productDiv.id.slice(2);
    let data = await fetch('/api/productsList/' + id);
    let details = await data.json();

    // Append the detailed info to the productDiv
    let detailpara2 = document.createElement('p');
    detailpara2.className = 'details';
    detailpara2.innerHTML = "Article.No: " + details.id;
    productDiv.append(detailpara2);

    let detailpara = document.createElement('p');
    detailpara.className = 'details';
    detailpara.innerHTML = details.productDescription;
    productDiv.append(detailpara);

    let detailpara1 = document.createElement('p');
    detailpara1.className = 'details';
    detailpara1.innerHTML = "price: " + details.productPrice;
    productDiv.append(detailpara1);
  });
}
//Display all Products details from DB
getProducts();
ClickToProduct();

// React on click on delete button Product Page
document.body.addEventListener('click', async event => {
  let deleteButton = event.target.closest('.delete-button');
  if (!deleteButton) { return; }
  let idToDelete = deleteButton.id.slice(7);
  await fetch('/api/productsList/' + idToDelete, {
    method: 'DELETE'
  });
  getProducts();
});

// React on click on change button in Product Page
document.body.addEventListener('click', async event => {
  let changeButton = event.target.closest('.change-button');
  if (!changeButton) { return; }
  let idToChange = changeButton.id.slice(7);
  // get the data to change
  let rawResult = await fetch('/api/productsList/' + idToChange);
  let result = await rawResult.json();
  // fill and show the change forms base on the result/data
  let changeForm = document.querySelector('.change-product-form');
  // add the correct route / action to the form
  changeForm.setAttribute('action', '/api/productsList/' + result.id);
  // Fill the form with the data from the database
  for (let element of changeForm.elements) {
    if (!element.name) { continue; }
    element.value = result[element.name];
  }
  // show the form
  changeForm.style.display = "block";
  // scroll to the bottom of the page where the form is
  window.scrollTo(0, 10000000); // x,y = x = 0, y = high value to scroll to bottom of page
});

//-------------------------Store Details part---------------------------------
//Fetch all the Store Details
async function getStores() {
  let rawData = await fetch('/api/storeAddress');
  let allStocks = await rawData.json();
  console.log(allStocks);
  let html = '';
  for (let { id, storeName } of allStocks) {
    html += `
    <div class = "stores" id = "id${id}">
    <th>Store.No: ${id}</th>
    <td>${storeName}</td>
    <td><button class="change-button" id="change-${id}">Change</button></td>
    <td><button class="delete-button" id="delete-${id}">Delete</button><td>
    </div>
    `;
  }
  let productList = document.querySelector('.Find-all-Stores');
  productList.innerHTML = html;
  //document.body.prepend(productList);
  window.scrollTo(0, 0);
}

function ClickToStore() {
  document.body.addEventListener('click', async (event) => {
    // get the productDiv that the user click on
    let productDiv = event.target.closest('.stores');
    // if not click on a productDiv do nothing
    if (!productDiv) {
      return;
    }
    // if the product div already has a details element do nothing
    if (productDiv.querySelector('details')) { return; }
    // remove all old details
    // (only only one product shown with details at a time)
    let allDetailsParas = document.querySelectorAll('.details');
    for (let detailpara of allDetailsParas) {
      detailpara.remove();
    }

    // Read the id of the product and make a fetch
    // of the detailed product info
    let id = productDiv.id.slice(2);
    let data = await fetch('/api/storeAddress/' + id);
    let details = await data.json();

    // Append the detailed info to the productDiv
    let detailpara2 = document.createElement('p');
    detailpara2.className = 'details';
    detailpara2.innerHTML = details.streetName;
    productDiv.append(detailpara2);

    let detailpara = document.createElement('p');
    detailpara.className = 'details';
    detailpara.innerHTML = details.postCode;
    productDiv.append(detailpara);

    let detailpara3 = document.createElement('p');
    detailpara3.className = 'details';
    detailpara3.innerHTML = details.city;
    productDiv.append(detailpara3);

    let detailpara1 = document.createElement('p');
    detailpara1.className = 'details';
    detailpara1.innerHTML = "Phone.No: " + details.phoneNo;
    productDiv.append(detailpara1);
  });
}
if (location.pathname === '/storeLocation.html') {
  getStores();
}

//Display all products details from DB

ClickToStore();

document.body.addEventListener('click', async event => {
  let deleteButton = event.target.closest('.delete-button');
  if (!deleteButton) { return; }
  let idToDelete = deleteButton.id.slice(7);
  await fetch('/api/storeAddress/' + idToDelete, {
    method: 'DELETE'
  });
  getStores();
});

document.body.addEventListener('click', async event => {
  let changeButton = event.target.closest('.change-button');
  if (!changeButton) { return; }
  let idToChange = changeButton.id.slice(7);
  // get the data to change
  let rawResult = await fetch('/api/storeAddress/' + idToChange);
  let result = await rawResult.json();
  // fill and show the change forms base on the result/data
  let changeForm = document.querySelector('.change-store-form');
  // add the correct route / action to the form
  changeForm.setAttribute('action', '/api/storeAddress/' + result.id);
  // Fill the form with the data from the database
  for (let element of changeForm.elements) {
    if (!element.name) { continue; }
    element.value = result[element.name];
  }

  // Show the form
  changeForm.style.display = "block";
  // scroll to the bottom of the page where the form is
  window.scrollTo(0, 10000000); // x,y = x = 0, y = high value to scroll to bottom of page
});

//--------------------------Stock List view-----------------------------------------------------

//Fetch all the Stocks Details
async function viewProducts() {
  let rawData = await fetch('/api/avaibleProductsInStores');
  let allStocks = await rawData.json();
  console.log(allStocks);
  let html = '';
  for (let { productId, productName, storeId, storeName, avaiableStock } of allStocks) {
    html += `
    <div class = "stockAvaiable">
    <table>
    <tr>
     <th>Article.No</th>
     <th>Prodcut Name</th>
     <th>Store No</th>
      <th>Store Name</th>
     <th>Avaiable in each store</th>
    </tr>
    <tr>
     <td> ${productId}</td>
     <td> ${productName}</td>
     <td> ${storeId}</td>
     <td> ${storeName}</td>
     <td> ${avaiableStock}</td>
    </tr>
    </table>
    </div>
    `;
  }
  let productList = document.querySelector('.View-stockProducts-in-store');
  productList.innerHTML = html;
  //document.body.prepend(productList);
  window.scrollTo(0, 0);
}

//Display all products details from DB
//viewProducts();
if (location.pathname === '/stockList.html') {
  viewProducts();
}

