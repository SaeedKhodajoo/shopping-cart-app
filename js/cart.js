const cartItemsContainer = document.getElementById('cart-container')
const subTotalEl = document.querySelector('.cart-summary .subtotal')
const totalEl = document.querySelector('.cart-summary .summary-total span')
const cartBoxNumber = document.querySelector('.cart-total-quantity')
const favoriteBtn = document.getElementById('favorite-btn')
const favoriteContainer = document.querySelector('.favorite-container')
const favoriteListContainer = document.getElementById('favorite-list-container')
const emptyFavoriteListbtn = document.querySelector('.remove-all-btn')


const CART_KEY = 'floral-cart'
const FAVORITE_KEY = 'floral-favorite'



let cart = JSON.parse(localStorage.getItem(CART_KEY)) || []
let favoriteList = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []



function renderCartItems() {
    cartItemsContainer.innerHTML = ''
    cart.forEach(item => {
        let totalPrice = item.price * item.numberOfUnits
        cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="item__info">
                        <img src="${item.imgSrc}" alt="${item.name}">
                        <h4>${item.name}</h4>
                    </div>
                    <div class="item__more-info">
                        <div class="item__price">
                            <small>$</small>${item.price}
                        </div>
                        <div class="item__quantity">
                            <div class="quantity-btn minus" onclick='changeNumberOfUnits("minus",${item.id})'>-</div>
                            <div class="number">${item.numberOfUnits}</div>
                            <div class="quantity-btn plus" onclick='changeNumberOfUnits("plus",${item.id})'>+</div>
                        </div>
                        <div class="item__total-price">
                            <small>$</small>${totalPrice.toFixed(2)}
                        </div>
                        <div onclick='removeItemFromCart(${item.id})' id="delete-btn" class="fas fa-multiply"></div>
                    </div>
                </div>
        `
    })
}

function renderCartSummary() {
    let totalPrice = 0, totalItems = 0;
    totalItems = cart.reduce((acc, item) => { return acc + item.numberOfUnits }, 0)
    totalPrice = cart.reduce((acc, item) => { return acc + item.price * item.numberOfUnits }, 0)
    subTotalEl.innerHTML = `$${totalPrice.toFixed(2)}`
    totalEl.innerHTML = `$${(totalPrice * 75 / 100).toFixed(2)}`
    cartBoxNumber.innerHTML = totalItems
}

renderCartItems()
renderCartSummary()


function removeItemFromCart(id) {
    cart = cart.filter(item => item.id !== id)
    updateCart()
}

function updateCart() {
    renderCartItems()
    renderCartSummary()
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
}


function changeNumberOfUnits(action, id) {
    cart = cart.map(item => {
        let numberOfUnits = item.numberOfUnits

        if (item.id === id) {
            if (action === 'minus' && numberOfUnits > 1) {
                numberOfUnits--
            } else if (action === 'plus' && numberOfUnits < item.instock) {
                numberOfUnits++
            }
        }

        return {
            ...item,
            numberOfUnits
        }
    })

    updateCart()
}


favoriteBtn.addEventListener('click', () => {
    favoriteContainer.classList.toggle('active')
    updateFavoriteContainer()
})


function updateFavoriteContainer() {
    favoriteListContainer.innerHTML = ''

    if (favoriteList.length == 0) {
        favoriteListContainer.innerHTML = `
            <p class='empty-list'> your favorite list is empty</p>
        `
    }

    favoriteList.forEach(favorite => {
        favoriteListContainer.innerHTML += `
            <div class="favorite-list">
                <div class="favorite-box">
                    <div class="image">
                        <img src="${favorite.imgSrc}" alt="${favorite.name}">
                    </div>
                    <div class="content">
                        <h2 class="name">${favorite.name}</h2>
                        <div class="price">$${favorite.price}</div>
                    </div>
                </div>
                <div class="remove-from-favorite"><i onclick='removefromfavorite(${favorite.id})' class="fas fa-multiply"></i></div>
            </div>
        `
    })
}


function removefromfavorite(id) {
    favoriteList = favoriteList.filter(favorite => favorite.id !== id)
    const addToFavoriteElements = Array.from(document.querySelectorAll('.favorite'))
    addToFavoriteElements.forEach(element => {
        if (parseInt(element.getAttribute('data-id').trim()) === id) {
            element.classList.remove('active')
        }
    })
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteList))
    updateFavoriteContainer()
}


// removing all items from favorite list

emptyFavoriteListbtn.addEventListener('click', () => {
    favoriteList = []
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteList))
    updateFavoriteContainer()
    const addToFavoriteElements = Array.from(document.querySelectorAll('.favorite'))
    addToFavoriteElements.forEach(element => {
        element.classList.remove('active')
    })
})