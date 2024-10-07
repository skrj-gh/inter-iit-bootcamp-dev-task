import { createContext, useState } from "react";
import axios from "axios"
import { assets } from "../assets/assets";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompts, setPrevPrompts] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")
    const [file, setFile] = useState();
    const [codeBlocks, setCodeBlocks] = useState([]);
    const [currWord, setCurrWord] = useState("");
    const [profileImage, setProfileImage] = useState(assets.user_icon);
    const [name, setName] = useState("User");
    const [email, setEmail] = useState("");
    

    const delayPara = (index, nextWord) => {
        setTimeout(function (){
            setResultData(prev => prev+nextWord)
        }, 75*index)
    }
    
    const newChat = () => {
        setCurrWord("")
        setLoading(false)
        setShowResult(false)
    }

    const getData = async (prompt, data) => {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('email', email);
        if(data){
            if(data.size > 104857600){
                alert("File is too large");
                return;
            }
            formData.append("file", data)
        }
        else if (file) {
            if(file.size > 104857600){
                alert("File is too large");
                return;
            }
            formData.append('file', file);
        }

        try{
            const response = await axios.post("https://lazarusai.onrender.com/run", formData, {
                headers: {
                    "Content-Type" : "multipart/form-data"
                },
            });
            // console.log(response.data)
            return response.data;
        }
        catch(error){
            console.error("Eror:", error);
            throw error;
        }
    }

    const onSent = async (prompt,type, data) => {
        setResultData("")
        setCurrWord("")
        setCodeBlocks("")
        setLoading(true)
        setShowResult(true)

        let response;
        if(prompt !== undefined && (type===undefined || type==="prompt")){
            // response = await run(prompt)
            response = await getData(prompt)
            if(!response){
                return;
            }
            setRecentPrompt(prompt)
        }
        else{
            if(prompt !==undefined && type!==undefined){
                setPrevPrompts(prev => [...prev, prompt])
                setRecentPrompt(prompt)
                // response = await run(input);
                if(data){
                    response = await getData(prompt, data)
                }
                else{
                    response = await getData(prompt)
                }
            }
            else{
                setPrevPrompts(prev => [...prev, input])
                setRecentPrompt(input)
                // response = await run(input);
                if(data){
                    response = await getData(input, data)
                }
                else{
                    response = await getData(input)
                }
            }
            // console.log(response)
        }

        if(!response){
            return;
        }

        if(response[0]==='#' && response[1]==='#'){
            response = response.slice(2)
        }

        // let codeBlocks = [];
        let formattedResponse = "";
        // console.log(response)

        const respArray = response.split(/```/);

        let ident = 0;

        respArray.forEach((response, index) => {
            if(index===0 || index%2===0){
                let responseArray = response.split("**");
                let newResponse = "";
                for(let i=0;i<responseArray.length;i++){
                    if(i===0 || i%2!==1){
                        newResponse += responseArray[i];
                    }
                    else{
                        newResponse += "<b>"+responseArray[i]+"</b>";
                    }
                }
                let newResponse2 = newResponse.split("*").join("</br>"); 
                formattedResponse += newResponse2
            }
            else{
                // codeBlocks.push(response);
                setCodeBlocks((prev) => [...prev, response])
                formattedResponse += `~~~<div class="code-block-container"><pre><code>${response}</code></pre><button class="copy_btn">Copy Code</button></div>~~~`
                ident++;
            }
        })

        // console.log(newResponse2)
        setCurrWord(formattedResponse)
        // console.log(formattedResponse)
        
        let newSplitArray = formattedResponse.split("~~~");
        // console.log(newSplitArray)
        
        let newResponseArray = [];
        for(let i=0;i<newSplitArray.length;i++){
            if(i===0 || i%2===0){
                let partSplitArray = newSplitArray[i].split(" ");
                newResponseArray.push(...partSplitArray);
            }
            else{
                newResponseArray.push(newSplitArray[i]);
            }
        }

        // console.log(newResponseArray)
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord+" ")
        }

        setLoading(false)
        setInput("")
        setFile("")
    }

    

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        setFile,
        codeBlocks,
        currWord,
        setCurrWord,
        profileImage,
        setProfileImage,
        name,
        setName,
        email,
        setEmail,
        file
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;