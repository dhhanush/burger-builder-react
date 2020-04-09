import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burgero.firebaseio.com/'
});

export default instance;
