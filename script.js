let prompt = document.querySelector("#prompt")
let chatContainer = document.querySelector(".chat-container")
let imagebtn = document.querySelector("#image")
let imageinput = document.querySelector("#image input")
const Api_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyASBGx1hcsxImAnYBs2qJ4u7k2neOYBGFM"
let user={
    message:null,
    file:{
         mime_type:null,
          data: null
    }
}
async function generateResponse(aiChatBox) {
let text = aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify({
            
                "contents": [{
                  "parts":[
                    {"text": user.message},
                    ...(user.file.data?[{"inline_data":user.file}]:[])

                  ]
                  }]
                 
        })
    }
    try{
        let response=await fetch(Api_URL,RequestOption)
        let data=await response.json()
        console.log("API Response:",data);
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        text.innerHTML=apiResponse
    }
    catch(error){
        console.log(error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behaviour:"smooth"})
    }
   
}

function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}


function handlechatResponse(message){
    user.message=message
    let html = `<img src="user.png" alt="" id="userImage" width="50">
<div class="user-chat-area">
${user.message}
</div>`
    prompt.value=""
    let userChatBox=createChatBox(html,"user-chat-box")
    chatContainer.appendChild(userChatBox)
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behaviour:"smooth"})

      const greetings = ["hi", "hello", "hey"]
    if (greetings.includes(user.message.toLowerCase())) {
        setTimeout(() => {
            let greetingHtml = `<img src="ai.png" alt="" id="aiImage" width="70">
<div class="ai-chat-area">
Hi, how can I help you?
</div>`
            let aiChatBox = createChatBox(greetingHtml, "ai-chat-box")
            chatContainer.appendChild(aiChatBox)
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })
        }, 600)
        return
    }


    
    if (!user.message.toLowerCase().includes("gift","gifts")) {
        setTimeout(() => {
            let errorHtml = `<img src="ai.png" alt="" id="aiImage" width="70">
<div class="ai-chat-area">
Sorry could not find the gift, Please ask me anything related to the gift.
</div>`
            let aiChatBox = createChatBox(errorHtml, "ai-chat-box")
            chatContainer.appendChild(aiChatBox)
            chatContainer.scrollTo({top:chatContainer.scrollHeight,behaviour:"smooth"})
        }, 600)
        return
    }

    setTimeout(()=>{
        let html=`<img src="ai.png" alt="" id="aiImage" width="70">
<div class="ai-chat-area">
<img src="loading.webp" alt="" class="load" width="50px">
</div>`
        let aiChatBox=createChatBox(html,"ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        generateResponse(aiChatBox)
    },600)
}


prompt.addEventListener("keydown" , (e)=>{
    if(e.key=="Enter"){
       handlechatResponse(prompt.value)
    }
    
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return 
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            file:{
                mime_type:file.type,
                 data: base64string
           }
        }
    }
    reader.readAsDataURL(file)
})
imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})