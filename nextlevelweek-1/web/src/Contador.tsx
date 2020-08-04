import React, { useState } from 'react';

const Contador = () => {

    const [counter, setCounter] = useState(0);

    function handleButtonClick() {
        setCounter(counter + 1);
    }

    return (
        <div>
            <h1>{`Contador: ${counter}`}</h1>
            <h1>{counter}</h1>
            <button type="button" onClick={handleButtonClick}>Aumentar</button>
        </div>
    )

}

export default Contador;