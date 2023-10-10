import { user_store } from "./stores";

async function generateURLToUploadFile(entityType, mediaType, version) {

  try {
    const response = await fetch(
      `http://localhost:3000/api/new_signed_url_s3/${entityType}/bulles-bucket/${entityType}_${mediaType}/${mediaType}/${version}`,
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

async function uploadFile(file: File, entityType: string, mediaType: string, version: number): Promise<boolean | Error> {
  try {
    const data = await generateURLToUploadFile(entityType, mediaType, version);

    if (data.url) {
      const success = await uploadToS3(data.url, file);
      if (success && data.server_id) {
        return data.server_id;
      } else if (success) {
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


