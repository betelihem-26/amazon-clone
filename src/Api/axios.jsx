import axios from "axios";

// const axiosInstance = axios.create({
//   //local instance of firebase functions
//   baseURL: "http://127.0.0.1:5001/clone-ad381/us-central1/api",
// });
const axiosInstance = axios.create({
  baseURL: "https://amazon-api-deploy-ctkc.onrender.com", 
});


export { axiosInstance };
