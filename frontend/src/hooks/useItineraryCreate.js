import api from "../api/axiosInstance";
import { useState } from "react";
export function useItineraryCreate({onItineraryCreated, trip_id}){
     const [formData,setFormData] = useState({
            day_number: 1, //start day
            Date: "", 
            transport_id: 0,
            activities_in_day: [
                {
                title: "",
                category: "",
                start_time: "", 
                end_time: "", 
                location: "",
                notes: "",
                is_completed: false, // Hidden input or checkbox if needed
                activity_date: "", // Should usually match the main Date
                cost: 0,
                },
            ]
        })

     const [loading, setLoading] = useState(false);
     const [message, setMessage] = useState(null);

    const createNewItinerary = async() => {
        setLoading(true);
        setMessage(null); 
        const payload = {...formData,};

        try{
        console.log(trip_id)
        const response = await api.post(`/itineraries/trips/${trip_id}/`,payload);
        console.log("Creating itinery", response.data);
          setTimeout(() => {
            if (onItineraryCreated) {
            onItineraryCreated(response.data);  // ✅ will now call TripCard’s onSuccess
            }
        }, 1500);

        setMessage({ type: "success", text: "Itinerary created successfully!" });
        // Reset form data after success
            setFormData({
                day_number: formData.day_number + 1, // Suggest next day number
                Date: "", 
                transport_id: 0,
                activities_in_day: [
                    { title: "", category: "", start_time: "", end_time: "", location: "", notes: "", is_completed: false, activity_date: "", cost: 0 },
                ],
            });
          
        }catch{
            console.error("Error creating itinerary:");
            setMessage({
                type: "error",
                text: "Failed to create trip. Please try again.",
            });
            } finally {
            setLoading(false);
            }
        }



    // const handleMainChange = (e) => {
    // const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });

    // }
    const handleMainChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            // Auto-update activity_date when main Date changes
            if (name === "Date") {
                newState.activities_in_day = prev.activities_in_day.map(activity => ({
                    ...activity,
                    activity_date: value,
                }));
            }
            return newState;
        });
    };

  const handleAddActivity = () => {
        setFormData(prev => ({
            ...prev,
            activities_in_day: [
                ...prev.activities_in_day,
                {
                    title: "", category: "", start_time: "", end_time: "", location: "", notes: "",
                    is_completed: false, activity_date: prev.Date, cost: 0,
                },
            ],
        }));
    };
    //hte functional update (prev => ...) is primarily needed when your new state 
    // calculation depends on a state value that might have been updated by another action before your current function finishes.
    //In handleActivityChange, the update logic is contained entirely within the current execution block:
    const handleActivityChange = (index, e) => {
    const { name, value } = e.target;
    const newActivities = formData.activities_in_day.map((activity, i) => {
      if (index === i) {
        return { ...activity, [name]: value };
      }
      return activity;
    });
    setFormData({ ...formData, activities_in_day: newActivities });
    }
   

    const handleRemoveActivity = (index)=> {
        const activitiesToKeep = formData.activities_in_day.filter((_,i)=>i!==index);
        setFormData({...formData,activities_in_day:activitiesToKeep});

    }


    return {formData, 
        loading, 
        message,
        handleMainChange, 
        handleAddActivity, 
        handleActivityChange, 
        handleRemoveActivity, 
        createNewItinerary }

}