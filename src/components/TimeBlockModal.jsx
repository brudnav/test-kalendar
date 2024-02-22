import { useState } from "react";
import { saveTimeBlock } from "../util/timeBlock";
import styles from "../css/TimeBlockModal.module.css";
import moment from "moment";
import { isChild } from "../util/contract";
import toast from 'react-hot-toast';

function TimeBlockModal({ setTimeBlocks, selectedContractId, setSelectedContractId }) {
    const [blockStart, setBlockStart] = useState(moment().format('YYYY-MM-DD'));
    const [blockEnd, setBlockEnd] = useState(moment().add(1, 'days').format('YYYY-MM-DD'));
    const [blockState, setBlockState] = useState("new");
    const [btnIsDisabled, setBtnIsDisabled] = useState(false);

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

    const handleClick = () => {
        setBtnIsDisabled(true);

        setTimeout(() => {
            setBtnIsDisabled(false);
        }, 3000);
    }


    const createTimeBlock = () => {
        const notify = () => toast.success("Úspěšně jsi vytvořil blok");
        let timeBlock = {
            id: selectedContractId,
            start: blockStart,
            end: blockEnd,
            state: blockState,
            parent: isChild(selectedContractId)
        };

        saveTimeBlock(timeBlock);
        setTimeBlocks((prev) => {
            return [...prev, timeBlock];
        });
        setSelectedContractId("");
        handleClick();
        notify();
    };

    return (
        <div className={styles.container}>
            <label htmlFor="blockStart">Start</label>
            <input
                className="input"
                id="blockStart"
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
                min={moment().add(1, 'days').format('YYYY-MM-DD')}
                onChange={blockEndHandler}
            />

            <label htmlFor="blockState">Stav</label>
            <select className="select" id="blockState" value={blockState} onChange={blockStateHandler}>
                <option value="new">Nová</option>
                <option value="in-progress">V Přípravě</option>
                <option value="completed">Hotová</option>
            </select>
            <button disabled={btnIsDisabled} className="button is-light" onClick={createTimeBlock}>Vytvořit blok</button>
        </div>
    )
}

export default TimeBlockModal