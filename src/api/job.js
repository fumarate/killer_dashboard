import api from "./api"
export const getJobs = ()=>{
    return api("/job")
}

export const getJobById=(job_id)=>{
    return api("/job/"+job_id,"GET")
}

export const addJob=(job)=>{
    return api("/job","POST",job)
}

export const delJob=(job)=>{
    return api("/job","DELETE")
}
export const getJobAmount = ()=>{
    return api("/getJobAmount")
}