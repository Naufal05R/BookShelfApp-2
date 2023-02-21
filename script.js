const books = [];
const EVENT_RENDER = 'event-render';
const EVENT_SAVE = 'event-save';
const KEY_STORAGE = 'key-storage';

window.addEventListener('DOMContentLoaded', () => {
  const submit = document.getElementById('form');
  submit.addEventListener('submit', () => {
    addBook();
    resetForm();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function resetForm() {
  const inputForm = document.querySelectorAll('label');
  const checkForm = document.querySelectorAll('input[type="checkbox"]');

  for (item in inputForm) {
    inputForm[item].value = '';
  }
  
  checkForm.checked = false;

  document.dispatchEvent(new Event(EVENT_RENDER));
  saveData();
}

function addBook() {
  const bookTitle = document.getElementById('title').value;
  const bookAuthor = document.getElementById('author').value;
  const bookYear = document.getElementById('year').value;
  const bookCheck = document.getElementById('check').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookCheck);
  books.push(bookObject);

  document.dispatchEvent(new Event(EVENT_RENDER));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isRead) {
  return {
    id,
    title,
    author,
    year,
    isRead
  }
}

document.addEventListener(EVENT_RENDER, () => {
  const unreadBookList = document.getElementById('uncompleted-books-list');
  unreadBookList.innerHTML = '';

  const readBookList = document.getElementById('completed-books-list');
  readBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = displayBook(bookItem);
    if (!bookItem.isRead)
      unreadBookList.append(bookElement);
    else
      readBookList.append(bookElement);
  }
});

function displayBook(bookObject) {
  const booksTitle = document.createElement('h3');
  booksTitle.innerText = bookObject.title;

  const booksAuthor = document.createElement('h4');
  booksAuthor.innerText = bookObject.author;

  const booksYear = document.createElement('p');
  booksYear.innerText = bookObject.year;

  const bookContainer = document.createElement('div');
  bookContainer.append(booksTitle, booksAuthor, booksYear);

  const container = document.createElement('div');
  container.classList.add('listed-book');
  container.append(bookContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isRead) {
    const undo = document.createElement('i');
    undo.classList.add('bx', 'bx-undo');
    const undoButton = document.createElement('button');
    undoButton.classList.add('btn', 'btn-success', 'ms-auto');
    undoButton.append(undo);

    undoButton.addEventListener('click', () => {
      undoBookFromRead(bookObject.id);
    });

    const trash = document.createElement('i');
    trash.classList.add('bx', 'bx-trash');
    const trashButton = document.createElement('button');
    trashButton.classList.add('btn', 'btn-danger', 'ms-2');
    trashButton.append(trash);

    trashButton.addEventListener('click', () => {
      removeBookFromRead(bookObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const check = document.createElement('i');
    check.classList.add('bx', 'bx-check');
    const checkButton = document.createElement('button');
    checkButton.classList.add('btn', 'btn-success', 'ms-auto');
    checkButton.append(check);

    checkButton.addEventListener('click', () =>{
      addBookToRead(bookObject.id);
    });

    const trash = document.createElement('i');
    trash.classList.add('bx', 'bx-trash');
    const trashButton = document.createElement('button');
    trashButton.classList.add('btn', 'btn-danger', 'ms-2');
    trashButton.append(trash);

    trashButton.addEventListener('click', () => {
      removeBookFromRead(bookObject.id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) 
    return bookItem;
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function addBookToRead (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isRead = true;
  document.dispatchEvent(new Event(EVENT_RENDER));
  saveData();
}

function undoBookFromRead(bookId) {
  const bookTarget = findBook(bookId);
  
  if (bookTarget == null) return;
  
  bookTarget.isRead = false;
  document.dispatchEvent(new Event(EVENT_RENDER));
  saveData();
}

function removeBookFromRead(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(EVENT_RENDER));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(KEY_STORAGE, parsed);
    document.dispatchEvent(new Event(EVENT_SAVE));
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener('EVENT_SAVE', () => {
  console.log(localStorage.getItem(KEY_STORAGE));
});

function loadDataFromStorage() {
  const searializedData = localStorage.getItem(KEY_STORAGE);
  let data = JSON.parse(searializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(EVENT_RENDER));
}