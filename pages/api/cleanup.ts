// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import FormData from 'form-data';
import axios from "axios";
import formidable from "formidable";
const fs = require('fs');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const form = formidable({ multiples: true });

    const formData = new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          reject("error");
        }
        resolve({ fields, files });
      });
    });

    const imgData = new FormData();

    const { fields, files } = await formData;

    for (const [key, file] of Object.entries(files)) {
      imgData.append(key, fs.createReadStream(file.filepath), file.originalFilename);
    }

    const response = await axios.post(
      "https://clipdrop-api.co/cleanup/v1",
      imgData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "f5660a2675c9d8160f87e592d0e3ba830d3f7f200770f02e989fc5bec6dbaca2c1f724b98e75f0bb0d27f7c5aa1469a0",
        },
        responseType: "arraybuffer",
      }
    );

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', response.data.length);
  
    res.send(response.data);
  } catch(e) {
    console.log(e)
    res.status(400).send({ status: "Invalid Request" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};