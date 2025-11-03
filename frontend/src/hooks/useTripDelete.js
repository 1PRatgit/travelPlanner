import { useState } from "react"
import api from "../api/axiosInstance"
export default function(){
    const[deleting, setDeleting] = useState(true);
    const [message, setMessage] = useState(null);

   const deleteTrip = async (trip_id) => {
    try{
    const response = await api.delete(`/trips/${trip_id}`);
    setMessage({
        type:"success",
        text:"Trip deleted succesfuly",
    });

    }catch{
        setMessage({
            type: "error",
            text:"failed to delete trip",
        });

    }finally{
        setDeleting(false);
    }
    
   }
   return {deleteTrip,message}
    

}