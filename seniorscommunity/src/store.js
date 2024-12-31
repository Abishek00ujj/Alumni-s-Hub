let completeUser=false;


export const IscompleteUser=()=>{
    return completeUser;
}


export const SetcompleteUser=(x)=>{
    completeUser=true;
}

let userData=null;
export const Gitdata=()=>{
    return userData;
}

export const Setgitdata=(x)=>{
    userData=x;
}

export default{
    IscompleteUser,SetcompleteUser,Gitdata,Setgitdata
}



