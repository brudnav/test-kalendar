import moment from "moment";
import 'moment/dist/locale/cs';
import { useState } from "react";
import style from "../css/OriginalCalendar.module.css"
import Modal from "./Modal";
import TimeBlockEditModal from "./TimeBlockEditModal";

function OriginalCalendar({ setSelectedContractId, selectedContractId, setTimeBlocks, timeBlocks }) {

    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('week'));
    const [isOpen, setIsOpen] = useState(false);

    // Vypočet začátku a konce týdne pro zobrazení
    const weekStart = currentWeekStart.format('DD.MM.');
    const weekEnd = currentWeekStart.clone().endOf('week').format('DD.MM.YYYY');

    const daysOfWeek = Array.from({ length: 7 }).map((_, index) => {
        return currentWeekStart.clone().add(index, 'days')
    }
    );

    const findEvent = (day, id) => {

        const eventsForDay = timeBlocks.filter(event => {
            const startDate = moment(event.start);
            const endDate = moment(event.end);
            const currentDate = moment(day);
            return currentDate.isSameOrAfter(startDate) && currentDate.isSameOrBefore(endDate) && event.id == id;
        });

        return eventsForDay;

    }

    function generateHierarchy(blocks) {
        const childrenMap = new Map();
        const output = [];
        const visited = new Set();

        // Vytvoření mapy pro děti
        blocks.forEach(block => {
            if (block.parent) {
                if (!childrenMap.has(block.parent)) {
                    childrenMap.set(block.parent, []);
                }
                childrenMap.get(block.parent).push(block);
            }
        });

        // Funkce pro generování bloků rekurzivně
        const generateBlocks = (blockId) => {
            if (visited.has(blockId)) return;
            const block = blocks.find(b => b.id === blockId);
            if (block) {
                output.push(block.id);
                visited.add(blockId);
                if (childrenMap.has(blockId)) {
                    childrenMap.get(blockId).forEach(child => generateBlocks(child.id));
                }
            }
        };

        // Procházení všech bloků a generování těch bez rodiče
        blocks.forEach(block => {
            if (block.parent === null) {
                generateBlocks(block.id);
            }
        });

        return output;
    }

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


    return (
        <>
            <div className="box">
                <nav>
                    <button className="button is-light is-small" onClick={() => setCurrentWeekStart(prev => prev.clone().subtract(1, 'week'))}>←</button>
                    <span>{weekStart} - {weekEnd}</span>
                    <button className="button is-light is-small" onClick={() => setCurrentWeekStart(prev => prev.clone().add(1, 'week'))}>→</button>
                </nav>

                <div className={style.calendar}>
                    <div className={`${style.header} block`}>
                        {
                            daysOfWeek.map((day, index) => (
                                <div key={index} className={style["day-cell"]}>
                                    <h4 className={style["title"]}>{day.format('ddd')}</h4>
                                    <h4 className={style["title"]}>{day.format('D.M.')}</h4>
                                </div>
                            ))
                        }
                    </div>
                    {
                        generateHierarchy(timeBlocks).map((block) => (
                            <div key={block} className={style.row}>
                                {daysOfWeek.map((day, index) => {

                                    const key = `${block}-${index}`;

                                    if (findEvent(day, block).length === 0) {
                                        return <div key={key} className={style["empty-box"]}></div>;
                                    }
                                    const state = timeBlocks.filter((item) => item.id == block)[0].state;
                                    return <div key={key} onClick={() => { setIsOpen(true); setSelectedContractId(block) }} className={style[pickStyle(state)]}>{block}</div>;
                                })}
                            </div>
                        ))
                    }
                </div>
            </div>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <TimeBlockEditModal selectedContractId={selectedContractId} setTimeBlocks={setTimeBlocks} />
            </Modal>
        </>
    );
}

export default OriginalCalendar