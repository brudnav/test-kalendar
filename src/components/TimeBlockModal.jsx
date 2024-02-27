import { useState } from "react";
import { findBlock, saveTimeBlock } from "../util/timeBlock";
import styles from "../css/TimeBlockModal.module.css";
import moment from "moment";
import { findById, isChild } from "../util/contract";
import toast from 'react-hot-toast';

function TimeBlockModal({ setTimeBlocks, selectedContractId, setSelectedContractId }) {
    const [blockStart, setBlockStart] = useState(moment().format('YYYY-MM-DD'));
    const [blockEnd, setBlockEnd] = useState(moment().add(1, 'days').format('YYYY-MM-DD'));
    const [blockState, setBlockState] = useState("new");

    const [btnIsDisabled, setBtnIsDisabled] = useState(false);
    const [isEndDisabled, setIsEndDisabled] = useState(false);

    const blockStartHandler = (e) => {

        setBlockStart(e.target.value);
        const contract = findById(selectedContractId);
        const startMoment = moment(e.target.value, "YYYY-MM-DD");
        const endMoment = moment(findBlock(contract.higherCode)[0].end, "YYYY-MM-DD");


        if (!startMoment.isSame(endMoment, 'day')) {
            setBlockEnd(moment(e.target.value).add(1, 'days').format('YYYY-MM-DD'));
            setIsEndDisabled(false);
        }
        else {
            setBlockEnd(e.target.value)
            setIsEndDisabled(true);
        }
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

        const startMoment = moment(blockStart, "YYYY-MM-DD");
        const endMoment = moment(blockEnd, "YYYY-MM-DD");

        if (startMoment.isAfter(endMoment)) {
            alert("Nesmí být datum konce dřív než samotný start");
            return
        }


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

    const validationMinTime = () => {

        const contract = findById(selectedContractId);
        if (contract.higherCode) {

            return findBlock(contract.higherCode)[0].start
        }

        return "";
    }

    const validationMaxTime = () => {


        const contract = findById(selectedContractId);

        // const startMoment = moment(blockStart, "YYYY-MM-DD");
        // const endMoment = moment(findBlock(contract.higherCode)[0].end, "YYYY-MM-DD");



        if (contract.higherCode) {
            return findBlock(contract.higherCode)[0].end
        }

        return "";
    }

    return (
        <div className={styles.container}>
            <label htmlFor="blockStart">Start</label>
            <input
                className="input"
                id="blockStart"
                type="date"
                value={blockStart}
                min={validationMinTime()}
                max={validationMaxTime()}
                onChange={blockStartHandler}
            />
            <label htmlFor="blockEnd">Konec</label>
            <input
                className="input"
                id="blockEnd"
                type="date"
                value={blockEnd}
                min={validationMinTime()}
                max={validationMaxTime()}
                onChange={blockEndHandler}
                disabled={isEndDisabled}
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