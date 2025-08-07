
// DOM Elements
const bookList = document.getElementById('book-list');
const booksForm = document.getElementById('books-form');
const booksTable = document.getElementById('DisplayTable');
const API_URL = 'https://bookstore-api-six.vercel.app/api/books';

//pop up messages
const SuccessfulToast = () => {
  Toastify({
    text: "Book added successfully!",
    duration: 4000,
    close: true,
    gravity: "top",
    position: 'right',
    backgroundColor: "linear-gradient(to right, #75b000ff)",
  }).showToast();
};

const ErrorToast = () => {
  Toastify({
    text: "Error adding book. Please try again.",
    duration: 4000,
    close: true,
    gravity: "top",
    position: 'right',
    backgroundColor: "linear-gradient(to right, #e11515ff)",
  }).showToast();
};

//Display
function displayBook(book) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="border px-4 py-2">${book.title}</td>
    <td class="border px-4 py-2">${book.author}</td>
    <td class="border px-4 py-2">${book.publisher}</td>
    <td class="border px-4 py-2 text-center">
      <button class="delete-btn bg-orange-100 text-blue-300 px-2 py-1 rounded" data-id="${book._id}">Delete</button>
    </td>
  `;
  bookList.appendChild(row);
}

//get
async function fetchBooks() {
  try {
    const response = await fetch(`${API_URL}?limit=25`);
    const books = await response.json();
    books.forEach(displayBook);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// POST
async function addBook(book) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(book),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    displayBook(data);
    SuccessfulToast();
  } catch (error) {
    console.error("Error posting book:", error);
    ErrorToast();
  }
}

//delete
async function deleteBook(id, event) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }

    // Remove the row from the table
    const button = event.target;
    const row = button.closest('tr');
    row.remove();

    //Optional: show toast
    Toastify({
      text: "Book deleted successfully!",
      duration: 2000,
      gravity: "top",
      position: "center",
      style: { background: "orange" }
    }).showToast();

  } catch (error) {
    console.error("Error deleting book:", error);
    Toastify({
      text: "Failed to delete book.",
      duration: 2000,
      gravity: "top",
      position: "center",
      style: { background: "red" }
    }).showToast();
  }
}

//delete trigger
bookList.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    deleteBook(id, e);
  }
});

// submit trigger
booksForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const { title, author, publisher } = e.target.elements;

  const newBook = {
    title: title.value.trim(),
    author: author.value.trim(),
    publisher: publisher.value.trim(),
  };

  if (!newBook.title || !newBook.author || !newBook.publisher) {
  ErrorToast();
  return; 
}

  await addBook(newBook);
  booksForm.reset(); // Clear form after book has been submitted
});


document.addEventListener("DOMContentLoaded", fetchBooks);
