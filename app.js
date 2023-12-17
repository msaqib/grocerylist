const form = document.querySelector('.grocery')
const newItem = document.getElementById('item')
const submitButton = document.querySelector('.btn-submit')
const itemContainer = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearButton = document.querySelector('.btn-clear')
const result = document.querySelector('.result')
let editing = false

form.addEventListener('submit', addItem)

newItem.addEventListener('input', () => {
    console.log('changed')
    if (newItem.value === '') {
        submitButton.disabled = true
    }
    else {
        submitButton.disabled = false
    }
})

function addItem(e) {
    e.preventDefault()
    const value = newItem.value
    if (editing) {
        console.log('Editing a value')
    }
    else {
        const id = new Date().getTime().toString()
        const article = createArticle(value)
        list.appendChild(article)
        displayMessage(`${value} successfully added to the list`, 'success')
    }
}

function createArticle(name) {
    const article = document.createElement('article')
    article.classList.add('grocery-item')
    article.innerHTML = `<p class="item-title">${name}</p>
    <div class="btn-container">
        <button class="btn-edit">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn-delete">
            <i class="fas fa-trash"></i>
        </button>
    </div>`
    return article
}

function displayMessage(message, level) {
    result.innerText = message
    result.classList.add(`result-${level}`)
    setTimeout(() => {
        result.innerText = ''
        result.classList.remove(`result-${level}`)
    }, 2000)
}