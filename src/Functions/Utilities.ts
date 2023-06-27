import {createWriteStream } from "fs";
import { resolve } from "path";

export const PHOTO_UPLOAD = async(clound, file)=>{
     const {filename, createReadStream} = await file;
      //const filename = uuidv4(); // Generate a unique filename
      const stream = createReadStream()
  
       // Generate a temporary file path
      const filePath = resolve(`./upload/${filename}`);
    
    // Create a writable stream to save the file temporarily
      const writeStream = createWriteStream(filePath);
      await new Promise((resolve, reject) => {
        // Pipe the data from the ReadStream to the WriteStream
        stream.pipe(writeStream)
          .on('finish', resolve)
          .on('error', reject);
      });
  
    
     let photo = await clound.uploader.upload(filePath, {resource_type: "auto"})

     return photo.url
}

/**
 * This function update the hospital information
 * @param models the model containing the hospital
 * @param hospitalId the id to search the hospital
 * @param field the field to be updated
 * @param dataId the id of the field to be referenced
 */

export const ADD_UPDATE_HOSPITAL_INFO = async(models, hospitalId, field, dataId)=>{
    const Hospital = models.hospitals.findOne({_id: hospitalId})

    switch(field){
        case field === "patients":
            if(Hospital.patients === null){
                await models.hospitals.findOneAndUpdate({
                  _id: hospitalId
                },{
                  $set:{
                    patients: dataId
                  },
                },{
                    new: true
                  }
                )
            }else{
              Hospital.patients.push(dataId)
              await Hospital.save()
              console.log("patient updated")
            }
            break;
        case field === "user":
            if(Hospital.user === null){
                await models.hospitals.findOneAndUpdate({
                _id: hospitalId
                },{
                $set:{
                    user: dataId
                },
                },{
                    new: true
                }
                )
            }else{
            Hospital.user.push(dataId)
            await Hospital.save()
            }
            break;
        case field === "patientNotification":
            if(Hospital.patientNotification === null){
                await models.hospitals.findOneAndUpdate({
                _id: hospitalId
                },{
                $set:{
                    patientNotification: dataId
                },
                },{
                    new: true
                }
                )
            }else{
            Hospital.patientNotification.push(dataId)
            await Hospital.save()
            }
            break;
    }

}