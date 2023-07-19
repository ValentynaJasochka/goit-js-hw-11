import { refs } from './refs';
const { gallery } = refs;

export function createMarkup(arrForGalery) {
  const arrForMarkup = arrForGalery.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card">
  <div class="img">
            <a class="img-link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" width="400" loading="lazy" />
            </a>
        </div>
  <div class="info">
    <p class="info-item">
      <span>Likes:</span><span> ${likes}</span>
    </p>
    <p class="info-item">
      <span>Views:</span><span> ${views}</span>
    </p>
    <p class="info-item">
      <span>Comments:</span><span> ${comments}</span>
    </p>
    <p class="info-item">
      <span>Downloads:</span><span> ${downloads}</span>
    </p>
  </div>
</div>`;
    }
  );
  gallery.insertAdjacentHTML('beforeend', arrForMarkup.join(''));
}
