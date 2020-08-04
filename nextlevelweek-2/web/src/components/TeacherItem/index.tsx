import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

function TeacherItem() {
    return (
        <article className="teacher-item">
            <header>
                <img src="https://media-exp1.licdn.com/dms/image/C4D03AQHKZKmeRKgKsw/profile-displayphoto-shrink_400_400/0?e=1602115200&v=beta&t=XmPXpGELmUG_yFNE7Q1AxVcYwTrRpcM4J-DH4n-aIao" alt="Caique Borges" />
                <div>
                    <strong>Caique Borges</strong>
                    <span>Java</span>

                </div>
            </header>

            <p>Entusiasta por tecnologias backend e frontend.<br /> Tentando aprender tudo ao seu alcance!</p>

            <footer>
                <p>
                    Preço/hora
                            <strong>R$ 100,00</strong>
                </p>
                <button type="button">
                    <img src={whatsappIcon} alt="Whatsapp" />
                            Entrar em contato
                        </button>
            </footer>
        </article>
    );
}

export default TeacherItem;