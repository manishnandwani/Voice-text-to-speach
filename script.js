// DOM Elements
const textInput = document.getElementById("textInput");

const rateInput = document.getElementById("rateInput");
const rateContent = document.getElementById("rateContent");

const pitchInput = document.getElementById("pitchInput");
const pitchContent = document.getElementById("pitchContent");

const voiceSelect = document.getElementById("selectInput");

const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("form");

const recordBtn = document.getElementById('recordBtn')
const listenBtn = document.getElementById('listenBtn')

//On Submit form: speak
form.addEventListener("submit", (e) => {
  e.preventDefault();
  speak();
});

// Init SpeechSynth API
const synth = window.speechSynthesis;

let voices = [];

//Get voices and add it in select
const getVoices = () => {
  //get the voices from synth api
  voices = synth.getVoices();
  // Loop through voices and create an option for each one
  voices.forEach((voice, index) => {
    let option = document.createElement("option");

    // Set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    option.setAttribute("data-index", index);

    // Fill option with voice and language
    option.textContent = `${voice.name} ${voice.lang}`;
    voiceSelect.appendChild(option);
  });
};

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// For different browsers
if (isFirefox) {
  getVoices();
}else {
  if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = getVoices;
  }
}

// Speak Method
const speak = () => {
  // If synth is already speaking then return
  if (synth.speaking) {
    console.error("Already speaking...");
    return;
  }

  //if textInput is not empty
  if (textInput.value !== "") {
    let speakText = new SpeechSynthesisUtterance(textInput.value);

    //Speak end
    speakText.onend = () => {
      console.log("Done speaking");
    };

    //Speak error
    speakText.onerror = () => {
      console.error("Something went wrong");
    };

    // Get selected voice index
    const selectedVoiceIndex = voiceSelect.selectedOptions[0].getAttribute(
      "data-index"
    );

    //set the voice, rate, pitch
    speakText.voice = voices[selectedVoiceIndex];
    speakText.rate = rateInput.value;
    speakText.pitch = pitchInput.value;

    //speak
    synth.speak(speakText);
  }
};

// show pitch number
pitchInput.addEventListener("change", (e) => {
  pitchContent.textContent = e.target.value;
});

// show rate number
rateInput.addEventListener("change", (e) => {
  rateContent.textContent = e.target.value;
});

//Speak when voice is changed
voiceSelect.addEventListener("change", (e) => {
  speak();
});

// Either of them will work as speech recognition
const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition

// Creating an instance of speechRecognition
const recognition = new SpeechRecognition();

// true : Realtime show data while speaking, false :  will show data post speaking
recognition.interimResults = true;

// Check the result after speaking
recognition.addEventListener('result',(e) =>{
  // get the text from results
  const text = Array.from(e.results)
                .map(result => result[0])         // return array with all 0th elements []
                .map(result => result.transcript) // return string with transcript:  'hello My name is Manish'
                .join('')                         // return array with transcript ['hello','My name is', 'Manish']

  textInput.value = text                          // assign text to input
})

recordBtn.addEventListener('click',(e)=>{
  //start recognition
  recognition.start()

  //show listen btn
  recordBtn.classList.add('hide')
  listenBtn.classList.remove('hide')
})

recognition.addEventListener('end',(e) =>{
  //show record btn
  recordBtn.classList.remove('hide')
  recordBtn.classList.add('show')
  listenBtn.classList.add('hide')
})