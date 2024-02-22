import { useEffect, useState } from "react";
import { editBlock, findBlock } from "../util/timeBlock";
import styles from "../css/TimeBlockModal.module.css";
import moment from "moment";
import { isChild } from "../util/contract";

function TimeBlockEditModal({ setTimeBlocks, selectedContractId }) {

    const [timeBlock, setTimeBlock] = useState(findBlock(selectedContractId));

    useEffect(() => {
        setTimeBlock(findBlock(selectedContractId));
    }, [selectedContractId]);

    const [blockStart, setBlockStart] = useState('');
    const [blockEnd, setBlockEnd] = useState('');
    const [blockState, setBlockState] = useState('');

    useEffect(() => {
        if (timeBlock.length != 0) {
            setBlockStart(timeBlock[0].start);
            setBlockEnd(timeBlock[0].end);
            setBlockState(timeBlock[0].state);
        }
    }, [timeBlock]);


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
        let timeBlock = {
            start: blockStart,
            end: blockEnd,
            state: blockState,
            parent: isChild(selectedContractId)
        };
        timeBlock = editBlock(selectedContractId, timeBlock);
        setTimeBlocks(timeBlock);

    };

    return (
        <div className={styles.container}>
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
            <button className="button is-light" onClick={editHandler}>Editovat blok</button>
        </div>
    )
}

export default TimeBlockEditModal