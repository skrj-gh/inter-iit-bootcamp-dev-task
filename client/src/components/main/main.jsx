import React, { useContext, useState, useEffect } from 'react'
import "./main.css"
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'
import PhotoPicker from '../PhotoPicker'
import hljs from "highlight.js";
import "highlight.js/styles/default.css";

const Main = () => {

    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input, setFile, currWord, profileImage, name} = useContext(Context)
    const [grabPhoto, setGrabPhoto] = useState(false);
    const [recordingAudio, setRecordingAudio] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

    const handleCopySpecific = (code) => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = code;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        alert('Code copied to clipboard!');
    };

    const photoPickerChange = async (event) => {
        event.preventDefault()
        const fileInput = document.getElementById("photo-picker")
        const file = fileInput.files[0];
        setFile(file);
    };

    useEffect(() => {
        if(grabPhoto){
            const data = document.getElementById("photo-picker")
            data.click();
            document.body.onfocus = (e) => {
                setTimeout(() => {
                setGrabPhoto(false);
                }, 1000);
            }
        }
    }, [grabPhoto]);


    const startRecording = async () => {
        try {
            // Ensure audio is requested in the constraints
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);   
                // Store recorder for reference
            setRecordingAudio(true); // Update recording state
        
            recorder.ondataavailable = (event) => {
                audioChunks.push(event.data); // Collect data chunks
                // console.log("Data received:", event.data.size); // Log chunk size
            };
        
            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                setFile(audioBlob)
                let ans = "";
                if(input===""){
                    ans = "";
                }
                else{
                    ans = input
                }
                // console.log("here"+ans)
                // console.log(file)
                onSent(ans, "audio", audioBlob);
                setInput("")
                // Handle recorded audio here (download, play, etc.)
                // console.log("Recording finished. Audio blob size:", audioBlob.size);
        
                // Reset recording state (optional):
                setAudioChunks([]);
                
            };
        
            recorder.start(); // Initiate recording
        } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Microphone access is required for recording.');
        }
    };
        
    const stopRecording = () => {
        if (mediaRecorder) {
            setRecordingAudio(false);
        mediaRecorder.stop();
        } else {
        console.warn("No media recorder instance found to stop.");
        }
    };

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            onSent();
            setInput("")
        }
    }

    const setupCopyButtons = () => {
        const codeBlocks = document.querySelectorAll("pre code");
        const copyButtons = document.querySelectorAll(".copy_btn");
        // console.log(copyButtons)
        codeBlocks.forEach((block) => {
            hljs.highlightBlock(block);
        });
        copyButtons.forEach((copyButton, index) => {
            copyButton.addEventListener("click", () => {
                const codeBlock = codeBlocks[index];
                const codeContent = codeBlock.textContent;

                // Use navigator.clipboard if available
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(codeContent)
                        .then(() => {
                            // console.log("Code copied successfully!");
                            copyButton.textContent = "Copied!";
                            setTimeout(() => copyButton.textContent = "Copy Code", 2000); // Reset button text
                        })
                        .catch((err) => {
                            console.error("Failed to copy code: ", err);
                        });
                } else {
                    // Fallback for browsers that don't support navigator.clipboard
                    const tempTextarea = document.createElement("textarea");
                    tempTextarea.value = codeContent;
                    document.body.appendChild(tempTextarea);
                    tempTextarea.select();
                    try {
                        document.execCommand("copy");
                        // console.log("Fallback: Code copied successfully!");
                        copyButton.textContent = "Copied!";
                        setTimeout(() => copyButton.textContent = "Copy Code", 2000);
                    } catch (err) {
                        console.error("Fallback: Failed to copy code: ", err);
                    }
                    document.body.removeChild(tempTextarea);
                }
            });
        });
    }

    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // console.log("DOM refreshed or child nodes changed!");
                setupCopyButtons()
            }
        }
    });
    
    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Function to stop the MutationObserver
    function stopObserver() {
        observer.disconnect();
        // console.log("MutationObserver stopped!");
    }

    // Stop observer when DOM is fully loaded
    document.addEventListener("DOMContentLoaded", () => {
        // console.log("DOM fully loaded. Stopping MutationObserver.");
        stopObserver(); // Stops the observer once the DOM is fully rendered
    });
    

    let mic = false;

    const speakText = () => {
        if(mic===false){
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(currWord);  // Create speech object
                utterance.pitch = 1;   // Range is 0 (low) to 2 (high)
                utterance.rate = 2;    // Speed (0.1 to 10)
                speechSynthesis.speak(utterance);
                mic = true

                // console.log("here")

                // Handle the end of speech
                utterance.onend = () => {
                    mic = false; // Reset mic state when speech ends
                };

                // Handle errors
                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event.error);
                    mic = false; // Reset mic state on error
                };
            }
            else {
                alert("Sorry, your browser doesn't support text-to-speech.");
            }
        }
        else{
            if (speechSynthesis.paused) {
                speechSynthesis.resume(); // Resumes the paused speech
            }
        }

    }

    const pauseSpeech = () => {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
          speechSynthesis.pause();
        }
    }


  return (
    <>
    <div className='main'>
        <div className='light-circle'></div>
        <div className="nav">
            <p>LazarusAi</p>
            <img src={profileImage} alt="" />
        </div>
        <div className='main-container'>

            {!showResult ? 
            <>
                <div className="greet">
                    <p><span>Hello, {name}</span></p>
                    <p>How can I help you today?</p>
                </div>
                <div className="cards">
                    <div className="card" onClick={() => {
                        onSent("Suggest beautiful places to see on an upcoming road trip?", "prompt")
                    }}>
                        <p>Suggest beautiful places to see on an upcoming road trip?</p>
                        <img src={assets.compass_icon} alt="" />
                    </div>
                    <div className="card" onClick={() => {
                        onSent("Briefly summarise this concept: urban planning", "prompt")
                    }}>
                        <p>Briefly summarise this concept: urban planning</p>
                        <img src={assets.bulb_icon} alt="" />
                    </div>
                    <div className="card" onClick={() => {
                        onSent("Brainstorm team bonding activities for our work retreat", "prompt")
                    }}>
                        <p>Brainstorm team bonding activities for our work retreat</p>
                        <img src={assets.message_icon} alt="" />
                    </div>
                    <div className="card" onClick={() => {
                        onSent("Improve the readibility of the following code", "prompt")
                    }}>
                        <p>Improve the readibility of the following code</p>
                        <img src={assets.code_icon} alt="" />
                    </div>
                </div>
            </> 
            : 
            <div className='result'>
                <div className="result-title">
                    <img src={profileImage} alt="" />
                    <p>{recentPrompt}</p>
                </div>
                <div className="result-data">
                    <img className='chat_logo' src={assets.logo} alt="" />
                    {loading ? 
                        <div className='loader'>
                            <hr />
                            <hr />
                            <hr />
                        </div>
                    :
                        <>
                            <div className='mic_controls'>
                                <div className='mic_wrapper' onClick={() => speakText()} >
                                    <img className='mic' src={assets.mic} id='start-speech'/>
                                </div>
                                <div className='mic_wrapper' onClick={() => pauseSpeech()} >
                                    <img className='mic' src={assets.mute_mic} id='stop-speech'/>
                                </div>
                            </div>
                            <p dangerouslySetInnerHTML={{__html: resultData}}></p>
                        </>
                    }
                </div>
            </div>
            }

            
            <div className='main-bottom'>
                <div className="search-box">
                    <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' onKeyDown={handleKeyDown} />
                    <div>
                        <img src={assets.gallery_icon} onClick={() => setGrabPhoto(true)} alt="" />
                        {recordingAudio?
                            <img src={assets.stop_icon} alt="" id='stopRecordBtn' onClick={stopRecording}/>
                            :
                            <img src={assets.mic_icon} alt="" id='startRecordBtn' onClick={startRecording}/>
                        }
                        {input ? 
                            <img onClick={() => onSent()} src={assets.send_icon} alt="" />
                            : 
                            null
                        }
                    </div>
                </div>
                <p className="bottom-info">
                    Lazarus may display inaccurate info, including about people, so double-check its responses. Your privacy and Lazarus Apps
                </p>
            </div>
        </div>
    </div>
    {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  )
}

export default Main
