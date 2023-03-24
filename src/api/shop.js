import api from './api'
export const getShop=()=>{
    return api("/shop","GET");
}