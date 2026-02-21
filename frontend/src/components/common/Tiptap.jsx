import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, 
  Undo, Redo, Image as ImageIcon 
} from 'lucide-react';
import './Tiptap.css';

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: '내용을 입력하세요' }),
    ],
    editorProps: {
      attributes: { class: 'tiptap-content' },
    },
  });

  if (!editor) return null;

  // 이미지 업로드 핸들러
  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          editor.chain().focus().setImage({ src: e.target.result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="tiptap-editor-container">
      <div className="tiptap-toolbar">
        <div className="toolbar-group">
          <button onClick={() => editor.chain().focus().undo().run()}><Undo size={18} /></button>
          <button onClick={() => editor.chain().focus().redo().run()}><Redo size={18} /></button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><Bold size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><Italic size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}><UnderlineIcon size={18} /></button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}><AlignLeft size={18} /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}><AlignCenter size={18} /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}><AlignRight size={18} /></button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button onClick={addImage}><ImageIcon size={18} /></button>
        </div>
      </div>

      <div className="tiptap-body">
        <input type="text" className="tiptap-title-input" placeholder="제목을 입력하세요" />
        <div className="title-body-divider"></div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;