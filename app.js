const form = document.querySelector('.grocery')
const newItem = document.getElementById('item')
const submitButton = document.querySelector('.btn-add')
const itemContainer = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
let elementEditing;
const dbName = 'MyGroceryApp'
const dbVersion = 3
const osName = 'groceries'
const clearButton = document.querySelector('.btn-clear')

let editing = false

let db;

form.addEventListener('submit', addItem)

clearButton.onclick = clear

init()

function displayList() {
    const tx = db.transaction(osName, "readonly");
    const store = tx.objectStore(osName)

    store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const article = createArticle(cursor.value, cursor.key)
            list.appendChild(article)
            cursor.continue();
            // const delButton = article.querySelector('.btn-delete')
            // const editButton = article.querySelector('.btn-edit')
            // delButton.onclick = deleteItem
            // editButton.onclick = editItem
        } else {
            console.log("No more entries!");
            if (list.children.length > 0) {
                itemContainer.classList.add('show-groceries')
            }
        }
    };
}

function init() {
    
    function openDB() {
        const request = indexedDB.open(dbName, dbVersion);
    
        request.onerror = (event) => {
            console.error(`Database error: ${event.target.errorCode}`);
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log(db)
            displayList()
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
        
            const objectStore = db.createObjectStore(osName, { autoIncrement: true });
        };
    }
    openDB()
}

newItem.addEventListener('input', () => {
    if (newItem.value === '') {
        submitButton.disabled = true
    }
    else {
        submitButton.disabled = false
    }
})

function storeItem(value) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([osName], "readwrite");
        const objectStore = transaction.objectStore(osName);

        const addRequest = objectStore.add(value);

        addRequest.onsuccess = function(event) {
            const key = event.target.result;
            resolve(key)
        };

        addRequest.onerror = function(event) {
            reject(`Error storing data: ${event.target.error.message}`)
        }

        transaction.oncomplete = function(event) {
            console.log("Transaction completed.");
        };
    })
}

function updateItem(id, newValue) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([osName], "readwrite");
        const objectStore = transaction.objectStore(osName);
        const request = objectStore.get(id);
        request.onerror = (event) => {
            reject(event.target.error.message)
        };
        request.onsuccess = (event) => {
            // Get the old value that we want to update
            let data = event.target.result;
            data = newValue;
            // Put this updated object back into the database.
            const requestUpdate = objectStore.put(data);
            requestUpdate.onerror = (event) => {
                reject(event.target.error.message)
            };
            requestUpdate.onsuccess = (event) => {
                resolve('Item updated')
            };
        };
    })
}

function removeItem(key) {
    return new Promise ( (resolve, reject) => {
        const request = db
        .transaction([osName], "readwrite")
        .objectStore(osName)
        .delete(parseInt(key));
        request.onsuccess = (event) => {
            resolve('Item deleted')
        };
        request.onerror = (event) => {
            reject(event.target.error.message)
        }
    })
}

function addItem(e) {
    e.preventDefault()
    const value = newItem.value
    // let dict = JSON.parse(localStorage.getItem(appKeyName))
    if (editing) {
        const id = elementEditing.getAttribute('data-id')
        const pElement = elementEditing.querySelector('p')
        pElement.innerText = newItem.value
        updateItem(id, newItem.value)
            .then( result => {
                displayMessage('Item successfully updated', 'success')
                if (list.children.length > 0) {
                    itemContainer.classList.add('show-groceries')
                }
                newItem.value = ''
            })
            .catch( error => {
                displayMessage('Item could not be updated', 'danger')
            })
        postModal()
        submitButton.innerText = 'Add'
        newItem.value = ''
        editing = false
    }
    else {
        storeItem(value)
            .then( key => {
                const article = createArticle(value, key)
                list.appendChild(article)
                // const delButton = article.querySelector('.btn-delete')
                // const editButton = article.querySelector('.btn-edit')
                // delButton.onclick = deleteItem
                // editButton.onclick = editItem
                displayMessage(`${value} successfully added to the list`, 'success')
                if (list.children.length > 0) {
                    itemContainer.classList.add('show-groceries')
                }
                newItem.value = ''
            })
            .catch( error => {
                console.log(error)
            })
    }
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
    const delButton = article.querySelector('.btn-delete')
    const editButton = article.querySelector('.btn-edit')
    delButton.onclick = deleteItem
    editButton.onclick = editItem
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

async function deleteItem(e) {
    const item = e.currentTarget.parentElement.parentElement
    const value = item.querySelector('p').innerText
    try {
        const choice = await showModal(`Are you sure you want to delete ${value}`)    
        if (choice){
            list.removeChild(item)
            const id = item.getAttribute('data-id')
            removeItem(id)
                .then( result => {
                    console.log(result)
                    displayMessage(`Item ${value} removed.`, 'danger')
                    if (list.children.length === 0) {
                        itemContainer.classList.remove('show-groceries')
                    }
                })
                .catch(error => {
                    displayMessage(error, 'danger')
                })
        }
        else {

        }
    }
    catch(error) {
        console.log(error)
    }
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

function showModal(message) {
    return new Promise( (resolve) => {
        preModal()
        const div = document.createElement('div')
        div.classList.add('modal')
        div.innerHTML = `<p>${message}</p><div class="btn-row"><button id="yes">Yes</button><button id="no">No</button></div>`
        document.body.appendChild(div)
        document.getElementById('yes').addEventListener('click', function() {
            document.querySelector('.modal').remove()
            postModal()
            resolve(true)
        })
        document.getElementById('no').addEventListener('click', function() {
            document.querySelector('.modal').remove()
            postModal()
            resolve(false)
        })
    })
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

async function clear() {
    try {
        const choice = await showModal('Are you sure you want to delete all items?')
        if (choice){
            //localStorage.setItem(appKeyName, JSON.stringify({}))
            list.innerHTML = ''
            displayMessage('All items removed from list.', 'danger')
            itemContainer.classList.remove('show-groceries')
        }
        else {

        }
    }
    catch(error) {
        console.log(error)
    }
}