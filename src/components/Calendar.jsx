import moment from "moment";
import 'moment/dist/locale/cs';
import { useState } from "react";
import style from "../css/Calendar.module.css"
import Modal from "./Modal";
import TimeBlockEditModal from "./TimeBlockEditModal";
import { findById, getContractsAll, isChild } from "../util/contract";
import TimeBlockCreateModal from "./TimeBlockCreateModal";
import { findBlock } from "../util/timeBlock";

function Calendar({ setSelectedContractId, selectedContractId, setTimeBlocks, timeBlocks }) {

    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('week'));
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);


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

    const clickCreateHandler = (id) => {

        if (findBlock(id).length > 0) {
            return;
        }

        const contract = findById(id);

        if (contract.higherCode && findBlock(contract.higherCode).length == 0) {
            alert("Nejdříve vytvoř časový úsek pro hlavní zakázku");
            return;
        }

        setIsOpenCreateModal(true);
    }

    return (
        <>
            <div className={`box ${style.box}`}>
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
                        getContractsAll().map((contract) => {
                            return (
                                <div key={contract.code} className={`${style.row} ${isChild(contract.code) ? style["child-row"] : ''}`} >
                                    {daysOfWeek.map((day, index) => {
                                        const key = `${contract.code}-${index}`;
                                        const events = findEvent(day, contract.code);

                                        // Pokud pro tento contract a den je událost, zobrazí se barevná buňka
                                        if (events.length > 0) {
                                            const state = events[0].state;
                                            return (
                                                <div
                                                    key={key}
                                                    onClick={() => { setSelectedContractId(contract.code); setIsOpenEditModal(true); }}
                                                    className={`${style[pickStyle(state)]}`}
                                                >
                                                    {contract.code}
                                                </div>
                                            );
                                        }
                                        else {

                                            return <div onClick={() => { clickCreateHandler(contract.code); setSelectedContractId(contract.code) }} key={key} className={`${style["empty-box"]}`}>{contract.code}</div>;

                                        }
                                    })}
                                </div>
                            );
                        })
                    }
                </div>
            </div >
            <Modal open={isOpenEditModal} onClose={() => setIsOpenEditModal(false)}>
                <TimeBlockEditModal selectedContractId={selectedContractId} setTimeBlocks={setTimeBlocks} />
            </Modal>
            <Modal open={isOpenCreateModal} onClose={() => setIsOpenCreateModal(false)}>
                <TimeBlockCreateModal setSelectedContractId={setSelectedContractId} setTimeBlocks={setTimeBlocks} selectedContractId={selectedContractId} />
            </Modal>
        </>
    );
}

export default Calendar