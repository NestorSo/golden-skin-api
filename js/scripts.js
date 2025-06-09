// Carrito de compras

const ListProducts = document.querySelector('#productDetails');
let productsArray = [];

document.addEventListener('DOMContentLoaded', function () {
    eventListeners();
});

function eventListeners() {
    ListProducts.addEventListener('click', getDataElements);
}

function getDataElements(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const ElementHtml = e.target.parentElement.parentElement;
        selectData(ElementHtml);

    };
}

function selectData(Prod) {
    const productInfo = {
        image: Prod.querySelector('img').src,
        title: Prod.querySelector('.product-title').textContent,
        price: parseFloat(Prod.querySelector('.price').textContent.replace('$', '')),
        description: Prod.querySelector('.product-description').textContent,
        id: parseInt(Prod.querySelector('.add-to-cart').dataset.id, 10),
        quantity: 1
    };

    productsArray = [...productsArray, productInfo];

    productsHtml();
}
    

    function productsHtml() {
        productsArray.forEach(Prod => {
           const {img, title, price, description, id, quantity} = Prod;
           const tr = document.createElement('tr');

           const tdImage = document.createElement('td');
           const productImage = document.createElement('img');
           productImage.src = img;
           productImage.alt = 'imagen product'; 
           tdImage.appendChild(productImage);

           const tdTitle = document.createElement('td');
           const productTitle = document.createElement('p');
           productTitle.textContent = title;
           tdTitle.appendChild(productTitle);

           const tdPrice = document.createElement('td');
           const productPrice = document.createElement('p');
           productPrice.textContent = `$${price.toFixed(2)}`;
           tdPrice.appendChild(productPrice);

           const tdDescription = document.createElement('td');
           const productDescription = document.createElement('p');
           productDescription.textContent = description;
           tdDescription.appendChild(productDescription);

           const tdQuantity = document.createElement('td');
           const productQuantity = document.createElement('input');
           productQuantity.type = 'number';
           productQuantity.min = 1;
           productQuantity.value = quantity;
           productQuantity.dataset.id = id;
           tdQuantity.appendChild(productQuantity);

           const tdDelete = document.createElement('td');
           const productDelete = document.createElement('button');
           productDelete.type = 'button';
           productDelete.textContent = 'X';
           tdDelete.appendChild(productDelete);


           tr.append(tdImage, tdTitle, tdPrice, tdDescription, tdQuantity, tdDelete);

           console.log(tr);
        });
    };
    

