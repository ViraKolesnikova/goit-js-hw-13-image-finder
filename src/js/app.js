import PicturesAPI from './apiService.js';
import formTemplate from '../templates/form.handlebars';
import galleryTemplate from '../templates/gallery.handlebars';
import cardTemplate from '../templates/card.handlebars';
import { debounce } from 'lodash';
import refs from './refs.js';

const { containerRef } = refs;

const picturesAPI = new PicturesAPI();


insertTemplate(formTemplate);

function insertTemplate(template, data) {
  const markup = template(data);
  containerRef.insertAdjacentHTML('beforeend', markup);  
}

const inputRef = document.querySelector('.search-input');

inputRef.addEventListener('input', debounce(onInputSubmit, 1500))
function onInputSubmit(event) {
  picturesAPI.query = event.target.value;
  
  renderByFetch()
}

async function renderByFetch() {
  try {
    const promise = await picturesAPI.fetchPictures();
    const data = promise.hits;

    insertTemplate(galleryTemplate, data)
  } catch (error) {
    console.log('ОШИБКА!!!', error.name);
  }  
}

function clearPage() {
}
 
    