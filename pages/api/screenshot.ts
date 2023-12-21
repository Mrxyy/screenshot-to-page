export const runtime = 'edge';

async function fetchAndConvertToBase64(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        // 将 ArrayBuffer 转换为 Buffer
        const buffer = Buffer.from(arrayBuffer);
        // 将 Buffer 转换为 Base64 字符串
        return buffer.toString('base64');
    } catch (error) {
        // console.error('Error fetching or converting data:', error);
        throw error;
    }
}

// 使用示例
export default async function handler(req: Request) {
    const urlObj = new URL(req.url);
    const url = urlObj.searchParams.get('url');
    let base64 = null;
    if (url) {
        base64 = await fetchAndConvertToBase64(url);
        console.log(base64);
    }
    return Response.json({ base64 });
}
