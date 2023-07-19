import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCollection } from './js/pixabey';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.img a', {
  captionsData: 'alt',
});
import { createMarkup } from './js/markup';
import { refs } from './js/refs';

const { searchForm, searchBTN, gallery, guard } = refs;

let page = 1;
const perPage = 40;

const paramsForNotify = {
  position: 'right-top',
  timeout: 2000,
  width: '250px',
};

// Безкінечний скрол
const options = {
  root: null,
  rootMargin: '400px',
  threshold: 0,
};

const observer = new IntersectionObserver(handlerPagination, options);

function handlerPagination(entries) {
  console.log(entries);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchCollection((searchNameForPhotos = 'dog'), page, perPage)
        .then(data => {
          console.dir(data);
          const searchResults = data.hits;
          createMarkup(searchResults);
          lightbox.refresh();
          if (data.totalHits / 40 < page) {
            observer.unobserve(guard);
            Notify.failure(
              "We're sorry, but you've reached the end of search results.",
              {
                position: 'right-bottom',
                timeout: 2000,
                width: '250px',
              }
            );
          }
        })
        .catch(err => console.log(err));
    }
  });
}

// прослуховувач подій

searchForm.addEventListener('submit', handlerFormCollection);

function handlerFormCollection(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  let page = 1;
  const searchNameForPhotos = evt.srcElement[0].value.trim().toLowerCase();
  if (!searchNameForPhotos) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      paramsForNotify
    );
    return;
  }
  fetchCollection(searchNameForPhotos, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          paramsForNotify
        );
      } else {
        Notify.info(
          `Hooray! We found ${data.totalHits} images.`,
          paramsForNotify
        );

        createMarkup(searchResults);
        lightbox.refresh();
        observer.observe(guard);
      }
    })
    .catch(fetchError)
    .finally(() => {
      searchForm.reset();
    });
}

function fetchError() {
  Notify.failure('Oops! Something went wrong!', paramsForNotify);
}
