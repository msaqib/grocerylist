const form = document.querySelector('.grocery')
const newItem = document.getElementById('item')
const submitButton = document.querySelector('.btn-add')
const itemContainer = document.querySelector('.grocery-container')
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
    if (list.children.length > 0) {
        itemContainer.classList.add('show-groceries')
    }
    newItem.value = ''
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
    const value = item.querySelector('p').innerText
    preModal()
    showModal(`Are you sure you want to delete ${value}`, item)    
}

function editItem(e) {
    const item = e.currentTarget.parentElement.parentElement
    // list.removeChild(item)
}

function showModal(message, item) {
    function handleYes() {
        list.removeChild(item)
        closeModal()
    }

    function handleNo() {
        closeModal()
    }

    function closeModal() {
        document.querySelector('.modal').remove()
        postModal()
        const value = item.querySelector('p').innerText
        displayMessage(`Item ${value} removed.`, 'danger')
        if (list.children.length === 0) {
            itemContainer.classList.remove('show-groceries')
        }
    }

    const div = document.createElement('div')
    div.classList.add('modal')
    div.innerHTML = `<p>${message}</p><div class="btn-row"><button id="yes">Yes</button><button id="no">No</button></div>`
    div.classList.add('.toast')
    document.body.appendChild(div)
    document.getElementById('yes').addEventListener('click', handleYes)
    document.getElementById('no').addEventListener('click', handleNo)
}

function preModal() {
    submitButton.disabled = true
    newItem.disabled = true
    const editButtons = document.querySelectorAll('.btn-edit')
    const deleteButtons = document.querySelectorAll('.btn-delete')
    editButtons.forEach( btn => btn.onclick = null)
    deleteButtons.forEach( btn => btn.onclick = null)
    const clearButton = document.querySelector('.btn-clear')
    clearButton.disabled = true
}

function postModal() {
    submitButton.disabled = false
    newItem.disabled = false
    const editButtons = document.querySelectorAll('.btn-edit')
    const deleteButtons = document.querySelectorAll('.btn-delete')
    editButtons.forEach( btn => btn.onclick = editItem)
    deleteButtons.forEach( btn => btn.onclick = deleteItem)
    const clearButton = document.querySelector('.btn-clear')
    clearButton.disabled = false
}

function reset() {

}