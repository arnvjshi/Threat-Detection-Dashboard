import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";

const ASSEMBLY_API_KEY = process.env.ASSEMBLYAI_API_KEY;

if (!ASSEMBLY_API_KEY) {
  throw new Error("Missing AssemblyAI API key in environment variables.");
}

// Upload the audio file to AssemblyAI
async function uploadToAssembly(filePath: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const uploadRes = await axios.post("https://api.assemblyai.com/v2/upload", formData, {
    headers: {
      ...formData.getHeaders(),
      authorization: ASSEMBLY_API_KEY,
    },
  });

  return uploadRes.data.upload_url;
}

// Transcribe the uploaded audio
export async function transcribeWithAssembly(filePath: string): Promise<string> {
  try {
    const uploadUrl = await uploadToAssembly(filePath);

    // Submit transcription request
    const transcriptRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: uploadUrl,
      },
      {
        headers: {
          authorization: ASSEMBLY_API_KEY,
        },
      }
    );

    const transcriptId = transcriptRes.data.id;

    // Polling until transcription is complete
    let status = "processing";
    let transcriptionText = "";

    while (status !== "completed" && status !== "error") {
      const polling = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          authorization: ASSEMBLY_API_KEY,
        },
      });

      status = polling.data.status;

      if (status === "completed") {
        transcriptionText = polling.data.text;
        break;
      } else if (status === "error") {
        throw new Error(`Transcription failed: ${polling.data.error}`);
      }

      await new Promise((r) => setTimeout(r, 3000)); // Wait 3 seconds before next poll
    }

    return transcriptionText;
  } catch (error) {
    console.error("AssemblyAI transcription failed:", error);
    throw new Error("Transcription failed");
  }
}
