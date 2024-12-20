import User from "../models/Usermodels.js";

export const searchContacts= async (request,response)=>{
    try {
        
        const {searchTerm}=request.body;

        if(searchTerm === undefined || searchTerm === null){

            return response.status(400).send("Search Term is required.");
        }

        const sanitizedSearchTerm=searchTerm.replace(
            /[.*+?^${}()|[\][\\]]/g,
            "\\$&"
        );

        const regex=new RegExp(sanitizedSearchTerm,"i");

        const contacts= await User.find({
            $and:[{_id:{$ne:request.userId}},{
                $or:[{firstName:regex},{lastName:regex},{email:regex}],
            }], 
        });

        return response.status(200).json({contacts});

        
    } catch (error) {
        console.error("Error in removeProfileImage:", error);
        return response.status(500).send('Internal server error');
    }
}