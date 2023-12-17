const form = document.querySelector('.grocery')
const newItem = document.getElementById('item')
const submitButton = document.querySelector('.btn-submit')
const itemContainer = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearButton = document.querySelector('.btn-clear')
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
    if (value !== '') {
        if (editing) {
            console.log('Editing a value')
        }
        else {
            const id = new Date().getTime().toString()
            console.log('Adding a new item')
            const article = createArticle(value)
            list.appendChild(article)
        }
    }
}

function createArticle(name) {
    const article = document.createElement('article')
    article.classList.add('grocery-item')
    const p = document.createElement('p')
    p.classList.add('item-title')
    p.innerText = name
    const div = document.createElement('div')
    div.classList.add('btn-container')
    const btnEdit = document.createElement('button')
    btnEdit.classList.add('btn-edit')
    const iEdit = document.createElement('i')
    iEdit.classList.add('fas')
    iEdit.classList.add('fa-edit')
    btnEdit.appendChild(iEdit)
    const btnDelete = document.createElement('button')
    btnDelete.classList.add('btn-delete')
    const iDelete = document.createElement('i')
    iDelete.classList.add('fas')
    iDelete.classList.add('fa-trash')
    btnDelete.appendChild(iDelete)
    div.appendChild(btnEdit)
    div.appendChild(btnDelete)
    article.appendChild(p)
    article.appendChild(div)
    return article
}