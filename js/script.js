const productsContainer = document.querySelector('.products .box-container')
const cartBoxNumber = document.querySelector('.cart-total-quantity')
const favoriteBtn = document.getElementById('favorite-btn')
const favoriteContainer = document.querySelector('.favorite-container')
const favoriteListContainer = document.getElementById('favorite-list-container')
const emptyFavoriteListbtn = document.querySelector('.remove-all-btn')
const removefromfavoriteBtn = document.getElementById('remove-from-favorite-btn')



const CART_KEY = 'floral-cart'
const FAVORITE_KEY = 'floral-favorite'



favoriteBtn.addEventListener('click', (e) => {
    favoriteContainer.classList.toggle('active')
    updateFavoriteContainer()
})

function renderProducts() {
    products.forEach(product => {
        productsContainer.innerHTML += `
            <div class="box">
                <span data-id='${product.id}' onclick='addToFavoriteList(${product.id})' class="fas fa-heart favorite"></span>
                <div class="image">
                    <img src="${product.imgSrc}" alt="${product.name}">
                </div>
                <div class="content">
                    <span>${product.name}</span>
                    <div class="price">$${product.price}</div>
                    <p class="description">${product.description}</p>
                    <button onclick='addToCart(${product.id})' class="btn"><i class="fas fa-shopping-cart"></i> add to cart </button>
                </div>
            </div>
        `
    })
}


let cart = JSON.parse(localStorage.getItem(CART_KEY)) || []
let favoriteList = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []

renderProducts()
updateCartBoxNumber()
updateFavoriteListIcons()

function addToCart(id) {
    if (cart.some(item => item.id === id)) {
        cart = cart.map(item => {
            let numberOfUnits = item.numberOfUnits
            if (item.id === id && numberOfUnits < item.instock) {
                numberOfUnits++
            }
            return {
                ...item,
                numberOfUnits
            }
        })
    } else {
        const item = products.find(product => product.id === id)
        cart.push({
            ...item,
            numberOfUnits: 1
        })
    }

    updateCartBoxNumber()
    updateCart()
}

function updateCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
}



function updateCartBoxNumber() {
    let totalItems = cart.reduce((acc, item) => { return acc + item.numberOfUnits }, 0)
    cartBoxNumber.innerHTML = totalItems
}

function addToFavoriteList(id) {
    const addToFavoriteElements = Array.from(document.querySelectorAll('.favorite'))
    addToFavoriteElements.forEach(element => {
        if (parseInt(element.getAttribute('data-id').trim()) === id) {
            element.classList.toggle('active')
        }
    })


    if (favoriteList.some(item => item.id === id)) {
        favoriteList = favoriteList.filter(listItem => listItem.id !== id)
        updateFavoriteList()
    } else {
        const newItem = products.find(product => product.id === id)
        favoriteList.push(newItem)
        updateFavoriteList()
    }

    updateFavoriteContainer()
}

function updateFavoriteList() {
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteList))
}

// heart icons being active or not

function updateFavoriteListIcons() {
    const addToFavoriteElements = Array.from(document.querySelectorAll('.favorite'))
    addToFavoriteElements.forEach(element => {
        favoriteList.forEach(favorite => {
            if (favorite.id === parseInt(element.getAttribute('data-id').trim())) {
                element.classList.add('active')
            }
        })
    })
}

// rendering favorites from favorite list array

function updateFavoriteContainer() {
    favoriteListContainer.innerHTML = ''

    if(favoriteList.length == 0){
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

function removefromfavorite(id){
    favoriteList = favoriteList.filter(favorite => favorite.id !== id)
    const addToFavoriteElements = Array.from(document.querySelectorAll('.favorite'))
    addToFavoriteElements.forEach(element => {
        if(parseInt(element.getAttribute('data-id').trim()) === id){
            element.classList.remove('active')
        }
    })
    updateFavoriteList()
    updateFavoriteContainer()
}


// removing all items from favorite list

emptyFavoriteListbtn.addEventListener('click' ,()=>{
    favoriteList = []
    updateFavoriteList()
    updateFavoriteContainer()
    const addToFavoriteElements = Array.from(document.querySelectorAll('.favorite'))
    addToFavoriteElements.forEach(element => {
        element.classList.remove('active')
    })
})