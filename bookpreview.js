class BookPreview extends HTMLElement {
    // Constructor to set up the component
    constructor() {
        super();
        // Attach a shadow DOM to this element, keeping styles and structure encapsulated
        this.attachShadow({ mode: 'open' });
    }

    // This lifecycle method is called when the component is added to the DOM
    connectedCallback() {
        this.render(); // Render the component's HTML and CSS when added to the page
    }

    // Define the attributes that this component will react to
    static get observedAttributes() {
        return ['title', 'author', 'image', 'id'];
    }

    // Called whenever one of the observed attributes changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            // Update the corresponding property with the new value
            this[name] = newValue;
            // Re-render the component to reflect the updated attribute
            this.render();
        }
    }

    // Main render method for the component's HTML structure and styling
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Styling for the book preview container */
                .preview {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .preview:hover {
                    background-color: #f5f5f5;
                }

                /* Styling for the book image */
                .preview__image {
                    width: 48px;
                    height: 70px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-right: 1rem;
                }

                /* Container for the book's title and author */
                .preview__info {
                    flex-grow: 1;
                }

                /* Styling for the book title */
                .preview__title {
                    font-weight: bold;
                    margin: 0;
                    font-size: 1.1rem;
                }

                /* Styling for the author's name */
                .preview__author {
                    color: #777;
                    font-size: 0.9rem;
                }
            </style>

            <!-- HTML structure for the book preview -->
            <div class="preview" data-preview="${this.id}">
                <img class="preview__image" src="${this.image}" alt="Book Cover">
                <div class="preview__info">
                    <h3 class="preview__title">${this.title}</h3>
                    <div class="preview__author">${this.author}</div>
                </div>
            </div>
        `;
    }
}

// Register the new custom element with the browser
customElements.define('book-preview', BookPreview);