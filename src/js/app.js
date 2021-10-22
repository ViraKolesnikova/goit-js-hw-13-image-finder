import PicturesAPI from './apiService.js';
import formTemplate from '../templates/form.handlebars';
import galleryTemplate from '../templates/gallery.handlebars';
import { debounce } from 'lodash';
import { alert, notice, info, success, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';
import refs from './refs.js';

const { containerRef, resultRef, loadMoreBtnRef } = refs;

const picturesAPI = new PicturesAPI();

insertTemplate(formTemplate, containerRef);


const inputRef = document.querySelector('.search-input');
inputRef.addEventListener('input', debounce(onInputSearch, 1000));


function onInputSearch(event) {
  let searchValue = event.target.value;
  if (searchValue.trim() !== '') {
    clearPage();
    loadMoreBtnRef.removeEventListener('click', onLoadMoreClick);
    loadMoreBtnRef.classList.add('is-hidden');
    
    picturesAPI.query = searchValue;
    renderByFetch()   
  } return
}

function insertTemplate(template, place, data) {
  const markup = template(data);
  place.insertAdjacentHTML('beforeend', markup);  
}

async function renderByFetch() {
  try {
    const promise = await picturesAPI.fetchPictures();
    const data = promise.hits;
    if (data.length === 0) {
      showErrorMessage();
      return;
    }
    insertTemplate(galleryTemplate, resultRef, data);
    resultRef.addEventListener('click', onPictureClick)
    showLoadMoreBtn();
  } catch (error) {
    showErrorMessage();
  }  
}

function showLoadMoreBtn(){
  loadMoreBtnRef.classList.remove('is-hidden');
  loadMoreBtnRef.addEventListener('click', onLoadMoreClick)
}

function onLoadMoreClick(event) {
  if (picturesAPI.query === inputRef.value) {
    picturesAPI.page += 1;
    renderByFetch();
    setTimeout(() => {
      const elems = document.querySelectorAll('ul');
      
      elems[elems.length-1].scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 1000);    
  }
  return
}

function onPictureClick(event) {
  event.preventDefault();
  const instance = basicLightbox.create(`
  <img src='${event.target.dataset.source}' alt='${event.target.alt}'>
`)
  instance.show()
}

function clearPage() {
  resultRef.innerHTML= '';
}
 
function showErrorMessage() {
  error({
    text: 'Nothing was found by your query!',
    type: 'error',
    width: '600px',
    closer: false,
    sticker: false,
    delay: 2000
  })
}
    