'use client';
import MDEditor from '@uiw/react-md-editor';

export interface IGenerateContentProps {
    data: IPost;
}

export default function GenerateContent({ data }: IGenerateContentProps) {
    return (
        <div data-color-mode="light" id="post-content">
            <MDEditor.Markdown source={data.content} />
        </div>
    );
}
