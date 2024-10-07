import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from "dotenv"
dotenv.config()


const apiKey = process.env.GEMINI_API_KEY;
// console.log(apiKey)
const genAI = new GoogleGenerativeAI(apiKey);

const fileManager = new GoogleAIFileManager(apiKey);


const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  
]

async function run(prompt, fileContent, fileType, mimeType) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,// Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
    ],
  });

  if(fileContent){
    if(fileType==="pdf"){
      const uploadResponse = await fileManager.uploadFile(fileContent, {
        mimeType: mimeType,
        displayName: "file",
      });
    
      // console.log(
      //   `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
      // );
  
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        { text: prompt },
      ]);
  
      return result.response.text();
    }
    else if(fileType==="audio"){

      if(mimeType==="audio/mpeg"){
        mimeType = "audio/mp3"
      }

      const uploadResult = await fileManager.uploadFile(fileContent,{
        mimeType: mimeType,
        displayName: "Audio",
      });
      
      // console.log(
      //   `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
      // );
  
      const result = await model.generateContent([
        {
          fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
          },
        },
        {text: prompt}
      ]);
      // console.log(result.response.text());
      return result.response.text();
    }
    else if(fileType==="img"){
      const uploadResult = await fileManager.uploadFile(fileContent,{
        mimeType: mimeType,
        displayName: "Image",
      });
      
      // console.log(
      //   `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
      // );
  
      const result = await model.generateContent([
        {
          fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
          },
        },
        {text: prompt}
      ]);
      // console.log(result.response.text());
      return result.response.text();
    }
  }
  

  const result = await chatSession.sendMessage(prompt, {
    data: fileContent ? {content: fileContent} : undefined,
  });
  const response = result.response;
  // console.log(response.text());
  return response.text();
}

export default run;