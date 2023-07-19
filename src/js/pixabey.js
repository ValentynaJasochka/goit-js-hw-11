import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38351175-155fd4149cf6b138ffaa93d1f';

export async function fetchCollection(q, page, perPage) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await axios.get(url);
  return response.data;
}
