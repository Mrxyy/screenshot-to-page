import { NextApiRequest, NextApiResponse } from 'next';
import * as formidable from 'formidable';
import fs from 'fs';
import { client } from '@gradio/client';
import { get, isString, nth } from 'lodash';

export const config = {
    api: {
        bodyParser: false, // 禁用 Next.js 默认的 bodyParser
    },
};

function dataURLtoFile(base64String: string, filename = 'example.png') {
    var arr = base64String.split(','),
        mimeMatch = arr[0].match(/:(.*?);/),
        mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream',
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

/**
 * 从图片链接获取 Blob 对象
 * @param {string} imageUrl - 图片链接
 * @return {Promise<Blob>} - 返回包含 Blob 对象的 Promise
 */
async function fetchImageAsBlob(imageUrl: string) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const blob = await response.blob();
    const file = new File([blob], 'comfyci.png', { type: 'image/png' });
    return file;
}
const baseURL: string = process.env.QWEN_URL!;
async function handleOpenAi(messages: any) {
    const app = await client(baseURL);
    let data = [null];
    let resultDate: any = {};
    async function processContent(content: string | any[], role: string) {
        if (typeof content === 'string') {
            const result: any = await app.predict(0, [
                ...data, // any (any valid json) in 'Qwen-VL-Plus' Chatbot component
                content, // string  in 'Input' Textbox component
            ]);
            resultDate = await app.predict(1, result.data);
            console.log(1);
            data = result.data;
        } else if (Array.isArray(content)) {
            for (const item of content) {
                if (item.type === 'image_url') {
                    const file: File = dataURLtoFile(item.image_url.url);
                    const filePath = await app.upload_files(baseURL, [file]);
                    const FileResult: any = await app.predict(5, [
                        ...data,
                        [
                            {
                                size: file.size,
                                data: '',
                                orig_name: file.name,
                                name: filePath.files![0],
                                is_file: true,
                                blob: undefined,
                            },
                        ],
                    ]);
                    console.log(3);
                    data = FileResult.data;
                } else if (item.type === 'text') {
                    const result: any = await app.predict(0, [
                        ...data, // any (any valid json) in 'Qwen-VL-Plus' Chatbot component
                        item.text, // string  in 'Input' Textbox component
                    ]);
                    console.log(2);
                    resultDate = await app.predict(1, result.data);
                    data = result.data;
                }
            }
        }
    }
    for (const item of messages) {
        await processContent(item.content, item.role);
    }
    return nth(nth(get(resultDate, ['data', 0], []), -1), -1);
}

export async function useQwen(newFile: File | string) {
    const app = await client(baseURL);

    const file: File = isString(newFile) ? await fetchImageAsBlob(newFile) : newFile;
    const filePath = await app.upload_files(baseURL, [file]);

    const FileResult: any = await app.predict(5, [
        null,
        [
            {
                size: file.size,
                data: '',
                orig_name: file.name,
                name: filePath.files![0],
                is_file: true,
                blob: undefined,
            },
        ],
    ]);

    const result: any = await app.predict(0, [
        ...FileResult.data, // any (any valid json) in 'Qwen-VL-Plus' Chatbot component
        '图片中是什么', // string  in 'Input' Textbox component
    ]);

    // const resetResult: any = await app.predict(2, []);

    const result_predict = await app.predict(1, result.data);
    return result_predict.data;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err: any, fields: any, files: any) => {
            // fields 包含非文件字段
            // files 包含文件字段
            if (fields.messages) {
                res.json({
                    text: await handleOpenAi(JSON.parse(fields.messages)),
                });
            } else {
                const file = new File(
                    files.blob.map((b: any) => {
                        // 获取文件路径
                        const filePath = b.filepath;
                        // 读取文件数据并创建 Blob 对象
                        const fileData = fs.readFileSync(filePath);
                        return new Blob([fileData]);
                    }),
                    fields.name,
                    { type: fields.type }
                );
                res.json(await useQwen(file));
            }
        });
    } else {
        res.json(await useQwen(req.query.url as string));
    }
}

export default handler;
