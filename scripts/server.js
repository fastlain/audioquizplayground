// Imports the Google Cloud client library
const speech = require("@google-cloud/speech")
const fs = require("fs")
const path = require("path")
const express = require("express")
const app = express()

// for parsing multipart/form-data
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

app.use(express.static("."))

app.post("/audio", upload.single("audio"), (req, res) => {
  console.log("post received")
  console.log(req.file)

  const audioBytes = req.file
  debugger
  const content = fs.readFileSync(
    path.resolve(__dirname, `../${req.file.path}`)
  )

  // Creates a client
  const client = new speech.SpeechClient()

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: content
  }

  const config = {
    encoding: "ogg",
    sampleRateHertz: 48000,
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
