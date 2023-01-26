function addtocart(item, product) {
    /*
    {
        "sku": "yoursku",
        "price": "yourprice",
        "category": "thecategory",
        "name": "name"
    }
     */
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        cart = [];
    } else {
        cart = JSON.parse(cart);
    }
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    // Send Coveo event
    coveoua('ec:addProduct', {
        'id': item.sku,
        'name': item.name,
        'category': item.category,
        'price': item.price,
        'position': 1
    });
    coveoua('ec:setAction', 'add');
    coveoua('send', 'event');
    if (product) {
        let qcart = localStorage.getItem("qcart");
        if (qcart == null) {
            qcart = [];
        } else {
            qcart = JSON.parse(qcart);
        }
        qcart.push(product);
        localStorage.setItem("qcart", JSON.stringify(qcart));
    }
}

function clearcart() {
    localStorage.removeItem("cart");
    localStorage.removeItem("qcart");
    localStorage.removeItem("cartid");
}

function buyfromcart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        cart = [];
    } else {
        cart = JSON.parse(cart);
    }
    if (cart.length > 0) {
        cart.forEach(cartitem => {
            const purchaseItem = {
                'id': cartitem.sku,
                'name': cartitem.name,
                'category': cartitem.category,
                'price': cartitem.price
            }
            coveoua('ec:addProduct', purchaseItem)
        })
        coveoua('ec:setAction', 'purchase', {
            'id': 'transaction-1234'
        });
        coveoua('send', 'event');
    }
    clearcart();
}

function getCartTotal() {
    let cart = localStorage.getItem("cart");
    if (cart) {
        cart = JSON.parse(cart);
    }
    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price;
    })
    return totalPrice;
}

function getCartNumberItems() {
    let cart = localStorage.getItem("cart");
    if (cart) {
        cart = JSON.parse(cart);
    }
    return cart.length;
}

function returnQBasket() {
    /**
     * {
    id: 'BASK123',
    subtotal: {
      value: 9.99,
      currency: 'USD'
    },
    total: {
      value: 9.99,
      currency: 'USD'
    },
    quantity: 10,
    subtotalIncludingTax: {
      value: 9.99,
      currency: 'USD'
    }
  }
     */
    const value = getCartTotal();
    const quantity = getCartNumberItems();
    const basket = {
        id: localStorage.getItem("cartid"),
        subtotal: {
            value: value,
            currency: 'CAD'
        },
        total: {
            value: value,
            currency: 'CAD'
        },
        quantity: quantity,
        subtotalIncludingTax: {
            value: value,
            currency: 'CAD'
        }
    }

    return basket;
}

function returnFullBasketItem(qproduct) {
    return {
        basket: returnQBasket(),
        product: qproduct,
        quantity: 1,
        subtotal: {
            value: getCartTotal(),
            currency: 'CAD'
        },
        subtotalIncludingTax: {
            value: getCartTotal(),
            currency: 'CAD'
        }
    }
}

function getRandomId() {
    return Math.floor(Math.random() * 16777215).toString(16);
}

document.addEventListener("DOMContentLoaded", function () {
    let cartid = localStorage.getItem("cartid");
    if (cartid == null) {
        cartid = getRandomId();
        localStorage.setItem("cartid", cartid);
    }
})