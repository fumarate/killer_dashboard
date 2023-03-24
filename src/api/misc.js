import api from "./api"
export const getRecommendedKeywords = ()=>{
    return api("/getRecommendedKeywords","GET")
}