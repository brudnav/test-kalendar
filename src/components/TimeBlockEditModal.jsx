import { useEffect, useState } from "react";
import { editBlock, findBlock } from "../util/timeBlock";
import styles from "../css/TimeBlockModal.module.css";
import moment from "moment";
import { findById, isChild } from "../util/contract";
import toast from 'react-hot-toast';

function TimeBlockEditModal({ setTimeBlocks, selectedContractId }) {

    const [timeBlock, setTimeBlock] = useState(findBlock(selectedContractId));

    useEffect(() => {
        setTimeBlock(findBlock(selectedContractId));
    }, [selectedContractId]);

    const [blockStart, setBlockStart] = useState('');
    const [blockEnd, setBlockEnd] = useState('');
    const [blockState, setBlockState] = useState('');
    const [btnIsDisabled, setBtnIsDisabled] = useState(false);

    useEffect(() => {
        if (timeBlock.length != 0) {
            setBlockStart(timeBlock[0].start);
            setBlockEnd(timeBlock[0].end);
            setBlockState(timeBlock[0].state);
        }
    }, [timeBlock]);

    const handleClick = () => {
        setBtnIsDisabled(true);

        setTimeout(() => {
            setBtnIsDisabled(false);
        }, 3000);
    }


    const blockStartHandler = (e) => {
        setBlockStart(e.target.value);
        setBlockEnd(moment(e.target.value).add(1, 'days').format('YYYY-MM-DD'));
    };
    const blockEndHandler = (e) => {
        setBlockEnd(e.target.value);
    };
    const blockStateHandler = (e) => {
        setBlockState(e.target.value);
    };



    const editHandler = () => {

        const notify = () => toast.success("Úspěšně jsi upravil blok");

        let timeBlock = {
            start: blockStart,
            end: blockEnd,
            state: blockState,
            parent: isChild(selectedContractId)
        };
        timeBlock = editBlock(selectedContractId, timeBlock);
        setTimeBlocks(timeBlock);
        handleClick();
        notify();
    };

    return (
        <div className={styles.container}>
            <h3>Aktuálně upravuješ: {findById(selectedContractId).name}</h3>
            <label htmlFor="blockStart">Start</label>
            <input
                id="blockStart"
                className="input"
                type="date"
                value={blockStart}
                min={moment().format('YYYY-MM-DD')}
                onChange={blockStartHandler}
            />
            <label htmlFor="blockEnd">Konec</label>
            <input
                className="input"
                id="blockEnd"
                type="date"
                value={blockEnd}
                min={moment().format('YYYY-MM-DD')}
                onChange={blockEndHandler}
            />

            <label htmlFor="blockState">Stav</label>
            <select className="select" id="blockState" value={blockState} onChange={blockStateHandler}>
                <option value="new">Nová</option>
                <option value="in-progress">V Přípravě</option>
                <option value="completed">Hotová</option>
            </select>
            <button disabled={btnIsDisabled} className="button is-light" onClick={editHandler}>Editovat blok</button>
        </div>
    )
}

export default TimeBlockEditModal