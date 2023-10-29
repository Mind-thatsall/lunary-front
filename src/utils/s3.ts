import { get } from "svelte/store";
import { new_server, server_list } from "./stores";

async function generateURLToUploadFile(entity, entityType, mediaType, version) {

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/new_signed_url_s3/${entity}/bulles-bucket/${entityType}_${mediaType}/${mediaType}/${version}`,
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/update/${fileType}/${version}`, {
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

async function uploadFile(file: File, entity: string, entityType: string, mediaType: string, version: number): Promise<boolean | Error> {
  try {
    const data = await generateURLToUploadFile(entity, entityType, mediaType, version);

    if (data.url) {
      const success = await uploadToS3(data.url, file);
      if (success) {
        server_list.update((servers) => [...servers, get(new_server)])
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


