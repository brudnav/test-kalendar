import style from "../css/TimeBlock.module.css"
import moment from "moment"
import { deleteBlock } from "../util/timeBlock";
import { deleteContract } from "../util/contract";

function TimeBlock({ block, setTimeBlocks, setContracts }) {
    const days = moment(block.end).diff(moment(block.start), "days")
    const pickStyle = (state) => {
        switch (state) {
            case "new":
                return "box-new"
            case "in-progress":
                return "box-progress"
            case "completed":
                return "box-completed"
        }
    };

    const deleteHandler = (id) => {
        let blocks = deleteBlock(id);
        let contracts = deleteContract(id);
        setTimeBlocks(blocks)
        setContracts(contracts);
    }

    const dayElements = Array.from({ length: days + 1 }, (_, i) => (
        <div key={i} className={style[pickStyle(block.state)]}></div>
    ));

    return (
        <div className={style.container}>
            <div className={style.main}>
                <div className={style[block.state]}> ID: {block.id} Start: {block.start} End: {block.end} State: {block.state}</div>
                <div className={style.days}>
                    {
                        dayElements
                    }
                </div>
            </div>

            <div onClick={() => { deleteHandler(block.id) }} className={style["close-icon"]}>🦀</div>
        </div>
    )
}

export default TimeBlock