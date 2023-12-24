const form = document.querySelector('.grocery')
const newItem = document.getElementById('item')
const submitButton = document.querySelector('.btn-add')
const itemContainer = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
let elementEditing;
const appKeyName = 'MyGroceryApp'

let editing = false

form.addEventListener('submit', addItem)

init()

function init() {
    const dict = localStorage.getItem(appKeyName)
    if (!dict) {
        localStorage.setItem(appKeyName, JSON.stringify({}))
    }
    else {
        const data = JSON.parse(dict)
        for (const [key, value] of Object.entries(data)) {
            const markup = createArticle(value, key)
            list.appendChild(markup)
        }
        itemContainer.classList.add('show-groceries')
    }
}

newItem.addEventListener('input', () => {
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
    let dict = JSON.parse(localStorage.getItem(appKeyName))
    if (editing) {
        const id = elementEditing.getAttribute('data-id')
        const pElement = elementEditing.querySelector('p')
        pElement.innerText = newItem.value
        dict[id] = newItem.value
        localStorage.setItem(appKeyName, JSON.stringify(dict))
        postModal()
        submitButton.innerText = 'Add'
        newItem.value = ''
        editing = false
    }
    else {
        const id = new Date().getTime().toString()
        const article = createArticle(value, id)
        list.appendChild(article)
        const delButton = article.querySelector('.btn-delete')
        const editButton = article.querySelector('.btn-edit')
        delButton.onclick = deleteItem
        editButton.onclick = editItem
        dict[id] = value
        localStorage.setItem(appKeyName, JSON.stringify(dict))
        displayMessage(`${value} successfully added to the list`, 'success')
    }
    if (list.children.length > 0) {
        itemContainer.classList.add('show-groceries')
    }
    newItem.value = ''
}

function createArticle(name, id) {
    const article = document.createElement('article')
    article.setAttribute('data-id', id)
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
    const value = item.querySelector('p').innerText
    showModal(`Are you sure you want to delete ${value}`, item)    
}

function editItem(e) {
    preModal()
    elementEditing = e.currentTarget.parentElement.parentElement
    newItem.disabled = false
    submitButton.disabled = false
    const pElement = elementEditing.querySelector('p')
    newItem.value = pElement.innerText
    newItem.focus()
    submitButton.innerText = 'Save'
    editing = true
}

function showModal(message, item) {
    function handleYes() {
        list.removeChild(item)
        closeModal(true)
    }

    function handleNo() {
        closeModal(false)
    }

    function closeModal(done) {
        document.querySelector('.modal').remove()
        const value = item.querySelector('p').innerText
        if (done) {
            displayMessage(`Item ${value} removed.`, 'danger')
        }
        if (list.children.length === 0) {
            itemContainer.classList.remove('show-groceries')
        }
        postModal()
    }

    preModal()
    const div = document.createElement('div')
    div.classList.add('modal')
    div.innerHTML = `<p>${message}</p><div class="btn-row"><button id="yes">Yes</button><button id="no">No</button></div>`
    document.body.appendChild(div)
    document.getElementById('yes').addEventListener('click', handleYes)
    document.getElementById('no').addEventListener('click', handleNo)
}

function preModal() {
    submitButton.disabled = true
    newItem.disabled = true
    const editButtons = document.querySelectorAll('.btn-edit')
    const deleteButtons = document.querySelectorAll('.btn-delete')
    editButtons.forEach( btn => {
        btn.onclick = null
        btn.style.cursor = 'auto'
    })
    deleteButtons.forEach( btn => {
        btn.onclick = null
        btn.style.cursor = 'auto'
    })
    const clearButton = document.querySelector('.btn-clear')
    clearButton.disabled = true
}

function postModal() {
    submitButton.disabled = false
    newItem.disabled = false
    const editButtons = document.querySelectorAll('.btn-edit')
    const deleteButtons = document.querySelectorAll('.btn-delete')
    editButtons.forEach( btn => {
        btn.onclick = editItem
        btn.style.cursor = 'pointer'
    })
    deleteButtons.forEach( btn => {
        btn.onclick = deleteItem
        btn.style.cursor = 'pointer'
    })
    const clearButton = document.querySelector('.btn-clear')
    clearButton.disabled = false
}

function reset() {

}