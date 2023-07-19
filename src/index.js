import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  selector: document.querySelector('.breed-select'),
  boxCatInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

console.dir(refs.selector);

refs.error.classList.add('is-hidden');
// refs.boxCatInfo.classList.add('is-hidden');

let selectorsName = [{ placeholder: true, text: '' }];

fetchBreeds()
  .then(date => {
    refs.loader.classList.add('is-hidden');

    date.forEach(element => {
      selectorsName.push({ text: element.name, value: element.id });
    });
    new SlimSelect({
      select: refs.selector,
      data: selectorsName,
    });
  })
  .catch(err => fetchError(err));

refs.selector.addEventListener('change', demonstrateBreed);

function demonstrateBreed(event) {
  event.preventDefault();
  const breedId = event.currentTarget.value;
  if (!breedId) {
    return;
  }
  refs.loader.classList.remove('is-hidden');
  refs.selector.hidden = true;
  refs.boxCatInfo.classList.add('is-hidden');

  fetchCatByBreed(breedId)
    .then(data => {
      refs.loader.classList.add('is-hidden');
      refs.selector.hidden = false;
      refs.boxCatInfo.classList.remove('is-hidden');
      refs.boxCatInfo.innerHTML = `<div>
      <img src="${data[0].url}" alt="${data[0].breeds[0].name}" width="400" heigth="400"/>
      </div>
      <div>
      <h1>${data[0].breeds[0].name}</h1>
      <p>${data[0].breeds[0].description}</p>
      <p><b>Temperament:</b> ${data[0].breeds[0].temperament}</p>
      </div>`;
    })
    .catch(err => fetchError(err));
}

function fetchError(error) {
  refs.selector.hidden = false;
  refs.loader.classList.add('is-hidden');
  refs.boxCatInfo.classList.add('is-hidden');

  Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!',
    {
      position: 'center-center',
      timeout: 3000,
      width: '400px',
      fontSize: '24px',
    }
  );
}
