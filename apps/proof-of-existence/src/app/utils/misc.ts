import { Utils } from '@secretarium/connector'

function base64ToHex(content : string) : string {
    const raw = atob(content);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result.toUpperCase();
  }

// Function to calculate the hash of a file's content
export async function getFileHash(fileContent: string): Promise<string> {
    // Calculate the hash in Base64 of the file
    const hashBase64 = await Utils.hashBase64(fileContent);
    // Convert the hash to a hexadecimal string
    const hashHex = base64ToHex(hashBase64);

    return hashHex;
}

export const idCollapser = (i?: string) => {
    if (!i)
        return '000-000-000';
    const h = Array.from(i.replace(/[\W_]+/g, "").toUpperCase().padEnd(40, '0')).map(c => c.charCodeAt(0) % 10);
    return `${h[0]}${h[3]}${h[6]}-${h[10]}${h[15]}${h[20]}-${h[6]}${h[12]}${h[30]}`
}