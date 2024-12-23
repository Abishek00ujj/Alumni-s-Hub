let completeUser=false;


export const IscompleteUser=()=>{
    return completeUser;
}


export const SetcompleteUser=(x)=>{
    completeUser=true;
}


export default{
    IscompleteUser,SetcompleteUser
}