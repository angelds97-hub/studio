'use client';

import React, { forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
];


// We need to wrap ReactQuill in a forwardRef to make it compatible with React Hook Form
const QuillEditor = forwardRef((props: RichTextEditorProps, ref: React.Ref<ReactQuill>) => {
    return (
        <ReactQuill
            ref={ref}
            theme="snow"
            value={props.value}
            onChange={props.onChange}
            modules={modules}
            formats={formats}
            placeholder="Escriu aquí el teu article..."
        />
    )
})
QuillEditor.displayName = 'QuillEditor';


export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <QuillEditor
      value={value}
      onChange={onChange}
    />
  );
}
