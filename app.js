const form = document.querySelector('.grocery')
const newItem = document.getElementById('item')
const submitButton = document.querySelector('.btn-add')
// const itemContainer = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
// const clearButton = document.querySelector('.btn-clear')

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
        const delButton = article.querySelector('.btn-delete')
        const editButton = article.querySelector('.btn-edit')
        delButton.onclick = deleteItem
        editButton.onclick = editItem
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
    const toast = document.createElement('div')
    toast.classList.add('toast')
    toast.innerText = message
    toast.classList.add(level)
    document.body.appendChild(toast)
    setTimeout(() => {
        document.body.removeChild(toast)
    }, 2000)
}

function deleteItem(e) {
    const item = e.currentTarget.parentElement.parentElement
    list.removeChild(item)
}

function editItem(e) {
    const item = e.currentTarget.parentElement.parentElement
    // list.removeChild(item)
}