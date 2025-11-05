import axios from 'axios';

let URL="http://localhost:5000/api/users/register"

const instance=axios.create({
    baseURL:URL
})
export default instance;