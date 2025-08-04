


import axios from "axios";

// === BASE URL CONFIGURATION ===
const BASE_URL = 'https://z48fp069-5000.inc1.devtunnels.ms'; // Replace with your backend URL
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.silent = true;

// === REQUEST INTERCEPTOR ===
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR ===
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized – clearing token and redirecting');
      localStorage.removeItem('access_token');
      // Optional: redirect to login if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Universal API Request
 * 
 * @param {string} path - Full or relative endpoint (e.g. '/users')
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method - HTTP method
 * @param {Object} data - Request body (for POST/PUT)
 * @param {Object} params - Query parameters
 * @param {number} wait - Optional artificial delay (ms)
 * @param {string|number|null} id - Optional ID for path param
 * @param {string} subPath - Optional sub-path
 * @returns {Promise<any>}
 */
export async function makeRequest(
  path,
  method = 'GET',
  data = {},
  params = {},
  wait = 0,
  id = null,
  subPath = ''
) {
  try {
    if (!path) throw new Error('Path is required');

    if (wait > 0) {
      await new Promise(resolve => setTimeout(resolve, wait));
    }

    // Construct URL
    let url = path.startsWith('http') ? path : `${BASE_URL}/${path}`;
    if (subPath) url += `${subPath}`;
    if (id) url += `/${id}`;

    const response = await axios({
      url,
      method: method.toUpperCase(),
      data,
      params
    });

    return response.data;
  } catch (error) {
    console.error(`[${method}] Request failed at ${path}`, error);
    throw error;
  }
}

export { BASE_URL };
