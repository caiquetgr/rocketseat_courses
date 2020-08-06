import React, {InputHTMLAttributes} from 'react';

import './styles.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string;
}

const Input: React.FC<InputProps> = ({ label, name, ...inputHtmlProperties}) => {
    return (
        <div className="input-block">
            <label htmlFor="{name}">{label}</label>
            <input type="text" name="subject" id="subject" {...inputHtmlProperties}/>
        </div>
    );
}

export default Input;
