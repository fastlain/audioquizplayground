// Imports the Google Cloud client library
const speech = require("@google-cloud/speech")
const fs = require("fs")

const express = require("express")
const app = express()

app.use(express.static("."))

app.post((req, res) => {
  const audioBytes = req.body.file
  // Creates a client
  const client = new speech.SpeechClient()

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes
  }
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 44100,
    languageCode: "en-US"
  }
  const request = {
    audio: audio,
    config: config
  }

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0]
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join("\n")
      console.log(`Transcription: ${transcription}`)
    })
    .catch(err => {
      console.error("ERROR:", err)
    })
})

app.listen(8080, () => {
  console.log("Running")
})
