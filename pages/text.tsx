import { Form, Upload } from '@arco-design/web-react';

export default function Test() {
    return (
        <Form>
            <Form.Item>
                <Upload
                    customRequest={async option => {
                        const { onProgress, onError, onSuccess, file } = option;
                        const formData = new FormData();

                        formData.append('name', file.name);
                        formData.append('size', file.size.toString());
                        formData.append('data', '');
                        formData.append('blob', file);
                        formData.append('type', file.type);
                        const res = await fetch('/api/qwen', {
                            method: 'POST',
                            body: formData,
                        });
                        return {
                            abort() {},
                        };
                    }}
                />
            </Form.Item>
        </Form>
    );
}
