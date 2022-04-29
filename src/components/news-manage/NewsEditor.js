import React, { useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw,ContentState,EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from 'html-to-draftjs'
export default function NewsEditor(props) {
    useEffect(() => {
        const html = props.content
        if (html === undefined || html.length === 0) return; 
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }

    }, [props.content])

    const [editorState, setEditorState] = useState('')
    return (
        <div>
            <Editor
                editorState={editorState} // 用户一开始看到的内容
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)} // 变成受控组件
                onBlur={() => { // 子传父，将输入的内容传给 父组件
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
            />
        </div>
    )
}
