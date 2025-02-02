import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books;


//Populates the card window with book previews//

function populateCardWindow(data) {
    if (data === null) {
        throw new Error('No data provided to populateCardWindow');
    }

    const starting = document.createDocumentFragment()

    for (const { author, id, image, title } of data) {
        if (typeof author !== 'string' || typeof id !== 'string' || typeof image !== 'string' || typeof title !== 'string') {
            throw new Error('Invalid data provided to populateCardWindow');
        }

        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)

        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author] || 'Unknown'}</div>
            </div>
        `

        starting.appendChild(element)
    }

    if (!document.querySelector('[data-list-items]')) {
        throw new Error('Could not find element with data-list-items attribute');
    }

    document.querySelector('[data-list-items]').appendChild(starting)
}


 // Populates a selection dropdown menu with options //
 
function populateSelectionMenu(selector, options, defaultOptionText) {
    const fragment = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = 'any';
    defaultOption.innerText = defaultOptionText;
    fragment.appendChild(defaultOption);

    for (const [id, name] of Object.entries(options)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        fragment.appendChild(element);
    }

    document.querySelector(selector).appendChild(fragment);
}


 //Sets the initial theme based on the user's preferences (dark or light) // 
 
function setInitialTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.querySelector('[data-settings-theme]').value = 'night'
        setTheme('night')
    } else {
        document.querySelector('[data-settings-theme]').value = 'day'
        setTheme('day');
    }
}


 // Sets the website theme based on the user's selection //
 
function setTheme(mode) {
    if (mode === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
}

// Function
(function() {
    populateCardWindow(matches.slice(0, BOOKS_PER_PAGE));

    populateSelectionMenu('[data-search-genres]', genres, 'All Genres');
    populateSelectionMenu('[data-search-authors]', authors, 'All Authors');

    setInitialTheme();
})()

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0;

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`


 // Closes a modal window when clicked // 
 
function closeWindowHandler(attachTag, modelTag) {
    document.querySelector(attachTag).addEventListener('click', () => {
        document.querySelector(modelTag).open = false;
    })
}


 // Opens a modal window when an element is clicked and optionally triggers a callback function // 
 
function openWindowHandler(attachTag, modelTag, func = null) {
    document.querySelector(attachTag).addEventListener('click', (event) => {
        document.querySelector(modelTag).open = true;
        if (typeof func === 'function') {
            func(event);
        }
    });
}

// Event listeners
closeWindowHandler('[data-search-cancel]', '[data-search-overlay]');

openWindowHandler('[data-header-search]', '[data-search-overlay]', ()=>{document.querySelector('[data-search-title]').focus()});


 // Handles the search form submission and filters books based on user input //

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    populateCardWindow(result.slice(0, BOOKS_PER_PAGE))

    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

// Event listeners
closeWindowHandler('[data-settings-cancel]', '[data-settings-overlay]')

openWindowHandler('[data-header-settings]', '[data-settings-overlay]')

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    setTheme(theme);
    
    document.querySelector('[data-settings-overlay]').open = false
})


// Event listeners
closeWindowHandler('[data-list-close]', '[data-list-active]');


 // Loads additional books when the "Show more" button is clicked //
 
const totalPages = Math.ceil(matches.length / BOOKS_PER_PAGE);

document.querySelector('[data-list-button]').addEventListener('click', () => {
  if (page < totalPages) {
    populateCardWindow(matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE));
    page += 1;
  } else {
    console.log('No more pages to load!');
  }
});


 // Opens the book detail view when a book preview is clicked //
 
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})