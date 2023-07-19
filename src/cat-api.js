import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_hMwAj5iZeyhCNGQcucJ5otAa3kzSqxIrDnJTbvPXE829zMM8NA1FUCcgksbpHnzt';

const BASE_URL = 'https://api.thecatapi.com/v1/';
const END_POINT = '/breeds/';

axios.defaults.baseURL = BASE_URL;

export function fetchBreeds() {
  return axios
    .get(END_POINT)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.message);
      }

      return resp.data;
    })
    .catch(err => console.error(err));
}

export function fetchCatByBreed(breedId) {
  return axios
    .get(`/images/search?breed_ids=${breedId}`)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.message);
      }

      return resp.data;
    })
    .catch(err => console.error(err));
}
