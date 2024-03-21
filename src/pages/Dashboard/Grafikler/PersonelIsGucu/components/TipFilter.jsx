import { Button, Popover, Divider, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import styled from "styled-components";
import { usePersonel } from '../PersonelContext';

const StyledButton = styled(Button)`
    border: none !important;
    box-shadow: none !important;
`;

const CheckboxGroup = Checkbox.Group;

const TipFilter = () => {
    const { personels, setPersonels, checkedList, setCheckedList } = usePersonel();
    const [allPersonels, setAllPersonels] = useState(personels)

    useEffect(() => {
        const savedPersonels = localStorage.getItem('personels');
        if (savedPersonels) {
            setCheckedList(JSON.parse(savedPersonels));
        } else {
            setCheckedList(personels);
            localStorage.setItem('personels', JSON.stringify(personels));
        }
    }, [])

    const onChange = (checkedValues) => {
        setCheckedList(checkedValues);
        setPersonels(checkedValues);
        localStorage.setItem('personels', JSON.stringify(checkedValues));
    };

    const onCheckAllChange = (e) => {
        const allPersonelsChecked = e.target.checked ? allPersonels : [];
        setCheckedList(allPersonelsChecked);
        setPersonels(allPersonelsChecked);
        localStorage.setItem('personels', JSON.stringify(allPersonelsChecked)); // Save to local storage
    };
    

    const content = (
        <div className='personel' style={{maxHeight: 400, overflow: 'auto'}}>
            <Checkbox indeterminate={checkedList.length > 0 && checkedList.length < allPersonels.length} onChange={onCheckAllChange} checked={checkedList.length === allPersonels.length}>
                Tümü
            </Checkbox>
            <Divider />
            <CheckboxGroup options={allPersonels} value={checkedList} onChange={onChange} style={{ display: 'flex', flexDirection: 'column' }} />
        </div>
    );

    return (
        <Popover placement="rightTop" content={content} style={{ border: 0 }}>
            <StyledButton>Personeli düzenle</StyledButton>
        </Popover>
    );
};

export default TipFilter;
