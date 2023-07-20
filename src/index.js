import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCollection } from './js/pixabey';
import { createMarkup } from './js/markup';
import { refs } from './js/refs';

//simpleightbox library connection
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let lightbox = new SimpleLightbox('.img a', {
  captionsData: 'alt',
});

//variables initialization
const { searchForm, gallery, guard } = refs;
let searchNameForPhotos = '';
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

async function handlerPagination(entries) {
  //   console.log(entries);

  if (entries[0].isIntersecting) {
    page += 1;
    try {
      const collection = await fetchCollection(
        searchNameForPhotos,
        page,
        perPage
      );
      const searchResults = collection.hits;
      const numberOfPage = Math.ceil(collection.totalHits / perPage);
      createMarkup(searchResults);
      lightbox.refresh();
      if (numberOfPage === page) {
        observer.unobserve(guard);
        Notify.failure(
          "We're sorry, but you've reached the end of search results.",
          {
            position: 'right-bottom',
            timeout: 4000,
            width: '250px',
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
}

// прослуховувач подій

searchForm.addEventListener('submit', handlerFormCollection);

async function handlerFormCollection(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  let page = 1;
  searchNameForPhotos = evt.srcElement[0].value.trim().toLowerCase();
  if (!searchNameForPhotos) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      paramsForNotify
    );
    return;
  }
  try {
    const collection = await fetchCollection(
      searchNameForPhotos,
      page,
      perPage
    );

    const searchResults = collection.hits;
    if (collection.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        paramsForNotify
      );
    } else {
      Notify.info(
        `Hooray! We found ${collection.totalHits} images.`,
        paramsForNotify
      );

      createMarkup(searchResults);
      lightbox.refresh();
      observer.observe(guard);
    }
  } catch {
    fetchError();
  }

  searchForm.reset();
}

function fetchError() {
  Notify.failure('Oops! Something went wrong!', paramsForNotify);
}
