function createNewElements(type) {
    return document.createElement(type);
  }
  
  // Object for fetched DOM nodes
  const callingElements = {
    listItems: document.querySelector("[data-list-items]"), //data list of different books
    searchGenres: document.querySelector("[data-search-genres]"), //searches through books to find different genres
    searchAuthors: document.querySelector("[data-search-authors]"), //searches through books to find different authors
    settingsThemes: document.querySelector("[data-settings-theme]"), //adjusts page between dark and light mode
    listButtons: document.querySelector("[data-list-button]"), //all clickable nuttons on the page
    cancelButton: document.querySelector("[data-search-cancel]"), //search data cancel button on modal
    settingsCancel: document.querySelector("[data-settings-cancel]"), //cancels search settings modal
    searchOverlay: document.querySelector("[data-search-overlay]"), //search data input
    settingsOverlay: document.querySelector("[data-settings-overlay]"), //displays all settings on modal
    headerSearch: document.querySelector("[data-header-search]"), //displays search button
    searchTitle: document.querySelector("[data-search-title]"), //displays header svg
    headerSettings: document.querySelector("[data-header-settings]"), //displays all header svgs and buttons
    listClose: document.querySelector("[data-list-close]"), //displays closed button on modal
    activeList: document.querySelector("[data-list-active]"), //opens a list of data to be displayed
    settingsForm: document.querySelector("[data-settings-form]"), //displays a form with previous data on it
    searchForm: document.querySelector("[data-search-form]"), //displays search field on form
    listMessage: document.querySelector("[data-list-message]"), //
    listBlur: document.querySelector("[data-list-blur]"), //blurs background when a book is selected
    listImage: document.querySelector("[data-list-image]"), //displays books image after clicked
    listTitle: document.querySelector("[data-list-title]"), //displays book titel in bold
    listSubtitel: document.querySelector("[data-list-subtitle]"), //displays author's name as a subtitel in modal
    listDescription: document.querySelector("[data-list-description]"), //displays a description of the book selected
  };
  
  const newDocument = document.createDocumentFragment();
  
  export { callingElements, createNewElements, newDocument };