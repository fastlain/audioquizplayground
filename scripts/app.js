// set up references to DOM elements which control recording

const record = document.querySelector(".record");
const stop = document.querySelector(".stop");
const soundClips = document.querySelector(".sound-clips");
const mainSection = document.querySelector(".main-controls");

// disable stop button while not recording
stop.disabled = true;

// main block for doing the audio recording
// runs if user agent supports getUserMedia
if (navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported.");
 
  // create array to hold audio data recorded by the MediaRecorder
  let chunks = [];

  // function receives media stream created by getUserMedia 
  const onSuccess = function(stream) {
    
    // use MediaRecorder API to capture the media stream
    const mediaRecorder = new MediaRecorder(stream);

    // handle clicks on the record button
    record.onclick = function() {
      // start recording
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      // enable stop button and disable record button
      stop.disabled = false;
      record.disabled = true;
    }

    // handle clicks on the stop button
    stop.onclick = function() {
      // stop recording
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      // disable stop button and enable record button
      stop.disabled = true;
      record.disabled = false;
    }

    // handle audio processing once recoding has stopped
    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      // ask user to name the recording
      let clipName = prompt(
        "Enter a name for your sound clip?",
        "My unnamed clip"
      );
      console.log(clipName);

      /***** create HTML elements which control the recorded audio clip ****/
      
      // create container for audio clip
      const clipContainer = document.createElement("article");
      clipContainer.classList.add("clip");
      
      // create label for the audio clip based on user input (above)
      const clipLabel = document.createElement("p");
      if (clipName === null) {
        clipLabel.textContent = "My unnamed clip";
      } else {
        clipLabel.textContent = clipName;
      }

      // create <audio> HTML element with controls
      const audio = document.createElement("audio");
      audio.setAttribute("controls", "");
      audio.controls = true;

      // create button to delete audio clip
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete";

      // create button to get text prediction for audio clip
      // const predictBtn = document.createElement("button");
      // predictBtn.textContent = "Get Prediction";

      // add HTML elements to the DOM
      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      // clipContainer.appendChild(predictBtn);
      soundClips.appendChild(clipContainer);

      // create a Blob object with data recorded into the chunks array
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      console.log("Blob:" + blob);
      
      // clear the chunks variable for the next recording
      chunks = [];
      
      // create a URL to access the blob and point the audio element to it
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
     
      var fd = new FormData();
      fd.append('audio', blob);
      $.ajax({
          type: 'POST',
          url: 'http://localhost:8080/audio',
          data: fd,
          processData: false,
          contentType: false
      });
      
      console.log('posted data');
      
      console.log("recorder stopped");

      // handle delete button
      deleteButton.onclick = function(e) {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      // predictBtn.onclick = function(e) {
      //   evtTgt = e.target;
      // }

      // handle changing clip name
      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt("Enter a new name for your sound clip?");
        if (newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    // whenever data is generated, add it to the chunks array
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

   // set recording constraints: only request audio
  const constraints = {audio: true};

  // request access to record audio; Promise resolves to a MediaStream object
  navigator.mediaDevices.getUserMedia(constraints)
    .then(onSuccess)
    .catch(err => {
      console.log(`The following error occured: ${err}`);
    });

} else {
  console.log("getUserMedia not supported on your browser!");
}
