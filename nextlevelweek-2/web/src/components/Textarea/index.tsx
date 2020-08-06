import React, {TextareaHTMLAttributes} from 'react';

import './styles.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string
    label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, name, ...textareaHtmlProperties}) => {
    return (
        <div className="textarea-block">
            <label htmlFor="{name}">{label}</label>
            <textarea name="subject" id="subject" {...textareaHtmlProperties}/>
        </div>
    );
}

export default Textarea;
