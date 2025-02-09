import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import {
    newDocument,
    callingElements,
    createNewElements,
} from "./functions.js";
import './book-previews.js';
import './genre-dropdown.js';
import './author-dropdown.js';
import './toggle-theme.js';
import './book-lists.js';
//these functions help with DOM manipulation

let page = 1;
let matches = books;

const starting = document.createDocumentFragment() // store the initial batch of book elements

// Display initial books
for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = document.createElement('book-preview');
  element.setAttribute('data-preview', id);
  element.setAttribute('image', image);
  element.setAttribute('title', title);
  element.setAttribute('author', authors[author]);
  starting.appendChild(element); // adds each button to the document fragment
}

callingElements.listItems.appendChild(starting); // append fragment to the DOM

// Create genre dropdown
const genreDropdownElement = document.createElement('genre-dropdown');
genreDropdownElement.setAttribute('genres', JSON.stringify(genres));
callingElements.searchGenres.appendChild(genreDropdownElement);

// Create authors dropdown
const authorDropdownElement = document.createElement('author-dropdown');
authorDropdownElement.setAttribute('authors', JSON.stringify(authors));
callingElements.searchAuthors.appendChild(authorDropdownElement);


// Toggle theme styling
const themeToggleElement = document.createElement('theme-toggle');
callingElements.settingsThemes.appendChild(themeToggleElement);


// Set up event listeners
function setUpEventlisteners() {
    callingElements.cancelButton.addEventListener("click", () => {
      callingElements.searchOverlay.open = false;
    });
  
    callingElements.settingsCancel.addEventListener("click", () => {
      callingElements.settingsOverlay.open = false;
    });
  
    callingElements.headerSearch.addEventListener("click", () => {
      callingElements.searchOverlay.open = true;
      callingElements.searchTitle.focus();
    });
  
    callingElements.headerSettings.addEventListener("click", () => {
      callingElements.settingsOverlay.open = true;
    });
  
    callingElements.listClose.addEventListener("click", () => {
      callingElements.activeList.open = false;
    });
  }
  
  setUpEventlisteners();

  // dark/light mode toggle from nav bar
function toggleDarkAndLight() {
    callingElements.settingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData); // convers from data to an object
  
      if (theme === "night") {
        document.documentElement.style.setProperty(
          "--color-dark",
          "255, 255, 255"
        );
        document.documentElement.style.setProperty("--color-light", "10, 10, 20");
      } else {
        document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
        document.documentElement.style.setProperty(
          "--color-light",
          "255, 255, 255"
        );
      }
  
      callingElements.settingsOverlay.open = false;
    });
  }
  
  toggleDarkAndLight();

  // Filter serach results
  callingElements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // handles the form submisson for filtering search results
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) {
        let genreMatch = filters.genre === 'any';

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || 
            book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book);
        }
    }

    page = 1;
    matches = result;

    if (result.length < 1) {
        callingElements.listMessage.classList.add("list__message_show");
    } else {
        callingElements.listMessage.classList.remove("list__message_show");
    }

    callingElements.listItems.innerHTML = "";
    const newItems =newDocument;

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element);
    }

    callingElements.listItems.appendChild(newItems);
    callingElements.listButtons.disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;
  
      callingElements.listButtons.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${
        matches.length - page * BOOKS_PER_PAGE > 0
          ? matches.length - page * BOOKS_PER_PAGE
          : 0
      })</span>
  `;

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false;
});


    // Show more books
    callingElements.listButtons.addEventListener("click", () => {
    const fragment = newDocument;

    for (const { author, id, image, title } of matches.slice(
        page * BOOKS_PER_PAGE,
         (page + 1) * BOOKS_PER_PAGE,
        )) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element);
    }

    callingElements.listItems.appendChild(fragment); // document fragment for add. book elements
    page += 1; // increments the pagr number
});

// Book selection
function selectedBook() { // handles selection of books
    callingElements.listItems.addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath()); // (pathArray) array of nodes in the events path
    let active = null; 

    for (const node of pathArray) {
        if (active) break;

        if (node?.dataset?.preview) {
            let result = null;
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook;
            } 
        
            active = result;
        }
    }
    
    // modal comes up after book is clicked
    if (active) {  // updates the UI with the details if a book is selected
        callingElements.activeList.open = true;
        callingElements.listBlur.src = active.image;
        callingElements.listImage.src = active.image;
        callingElements.listTitle.innerText = active.title;
        callingElements.listSubtitel.innerText = `${
          authors[active.author]
        } (${new Date(active.published).getFullYear()})`;
        callingElements.listDescription.innerText = active.description;
    }
});
}

selectedBook();