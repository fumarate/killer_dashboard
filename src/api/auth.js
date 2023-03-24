import api from "./api";
export const auth=()=>{
    const token="12345"
    return api("/auth","POST",{token:token})
}