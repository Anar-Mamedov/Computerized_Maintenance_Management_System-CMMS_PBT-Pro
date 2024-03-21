import { useState } from 'react';
import IsEmriTip from './IsEmriTip';
import IsEmriDurum from './IsEmriDurum';
import Lokasyon from './Lokasyon';

const GrupIsEmir = () => {
    const [graph, setGraph] = useState(1)

    const handleChange = (value) => {
        setGraph(value)
    };

    return (
        <div style={{ height: '100%', width: '100%' }} className='chart-container'>
            {graph === 1 && <IsEmriTip handleChange={handleChange}/>}
            {graph === 2 && <IsEmriDurum handleChange={handleChange}/>}
            {graph === 3 && <Lokasyon handleChange={handleChange} />}
        </div>
    );
}

export default GrupIsEmir;