import { user_store } from "./stores";

async function generateURLToUploadFile(type, version) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/new_signed_url_s3/bulles-bucket/user_${type}/${type}/${version}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(response.statusText);
    }

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function updateUserFilesInBackend(fileType: string, version: number) {
  try {
    const response = await fetch(`http://localhost:3000/api/update/${fileType}/${version}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(response.statusText);
    }

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function uploadToS3(url, file) {

  try {
    const response = await fetch(url.URL, {
      method: url.Method,
      body: file,
      headers: {
        "Content-Type": "image/webp",
      },
    });

    if (!response.ok) {
      console.error(response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function uploadFile(file: File, type: string, version: number): Promise<boolean | Error> {
  try {
    const { url } = await generateURLToUploadFile(type, version);

    if (url) {
      const success = await uploadToS3(url, file);
      if (success) {
        return true;
      } else {
        throw new Error('Upload to S3 failed')
      }
    } else {
      throw new Error('Failed to generate presigned URL')

    }
  } catch (err) {
    console.error(err)
    return false;
  }

}


export { uploadFile, updateUserFilesInBackend }


