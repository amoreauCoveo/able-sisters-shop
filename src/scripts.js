function addtocart(item) {
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
    console.log("Attempting to send add to cart event");
    coveoua('ec:addProduct', {
        'id': item.sku,
        'name': item.name,
        'category': item.category,
        'price': item.price,
        'position': 1
    });
    coveoua('ec:setAction', 'add');
    coveoua('send', 'event');
}

function clearcart() {
    localStorage.removeItem("cart");
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