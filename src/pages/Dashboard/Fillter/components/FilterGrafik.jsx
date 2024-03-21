import { Button, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { Checkbox, Divider } from 'antd';
import '../../dashboard.css'

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['İş Emri Tipi Grafiği', 'İş Talebi Tipi Grafiği', 'Tamamlanmış İş talepleri ve İş Emirleri Oranları', 'Aylık Bakım Maliyetleri', 'Personel Bazında Harcanan İş Gücü', 'Bakım İşlemlerinin Zaman İçerisinde Dağılımı', 'Toplam Harcanan İş Gücü', 'Lokasyon Bazında İş talepleri / İş Emirleri Dağılımı', 'İş Emirleri Özet Tablosu', 'Arızalı Makineler', 'Makine Tiplerine Göre Envanter Dağılımı'];

const FilterGrafik = ({ onUpdateFilters, checkedList, setCheckedList }) => {
    // const [checkedList, setCheckedList] = useState(plainOptions);

    useEffect(() => {
        const savedGraphs = localStorage.getItem('filteredGraphs');
        if(savedGraphs) {
            setCheckedList(JSON.parse(savedGraphs))
        }
    }, [])

    const onChange = (checkedValues) => {
        setCheckedList(checkedValues);
        onUpdateFilters(checkedValues); // Send checked values to parent component
    };

    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
        onUpdateFilters(e.target.checked ? plainOptions : []); // Send all values if "Tümü" checked
    };

    const content = (
        <div className='filter'>
            <Checkbox indeterminate={checkedList.length > 0 && checkedList.length < plainOptions.length} onChange={onCheckAllChange} checked={checkedList.length === plainOptions.length}>
                Tümü
            </Checkbox>
            <Divider />
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} style={{ display: 'flex', flexDirection: 'column' }} />
        </div>
    );

    return (
        <Popover
            placement="bottom"
            content={content}
            trigger="click"
        >
            <Button>Filtrele</Button>
        </Popover>
    );
};

export default FilterGrafik;
