import { useState } from 'react';
import IsTalepTip from './IsTalepTip';
import IsTalepDurum from './IsTalepDurum';
import Lokasyon from './Lokasyon';


const GrupIsTaleb = () => {
    const [graph, setGraph] = useState(1)

    const handleChange = (value) => {
        setGraph(value)
    };

    return (
        <div style={{ height: '100%', width: '100%' }} className='chart-container'>
            {graph === 1 && <IsTalepTip handleChange={handleChange}/>}
            {graph === 2 && <IsTalepDurum handleChange={handleChange}/>}
            {graph === 3 && <Lokasyon handleChange={handleChange} />}
        </div>
    );
}

export default GrupIsTaleb;