import React from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './TextEditor.module.scss';

type TextEditorProps = {
  value?: string;
  placeholder?: string;
  label?: string;
  error?: string;
} & ReactQuillProps;

export const TextEditor = ({
  placeholder,
  label,
  error,
  onChange,
  value,
  ...props
}: TextEditorProps) => {
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }]
    ]
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link'
  ];

  return (
    <div className={styles.container}>
      <div>{label}</div>
      <ReactQuill
        theme="snow"
        onChange={onChange}
        value={value}
        modules={modules}
        formats={formats}
        bounds=".app"
        placeholder={placeholder}
        tabIndex={-1}
        className={styles.textEditor}
        {...props}
      />
      {error && <div className="text-color-error font-small">{error}</div>}
    </div>
  );
};
