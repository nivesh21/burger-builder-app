import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-api-practice-d1f6e-default-rtdb.firebaseio.com/'
});



export default instance;
