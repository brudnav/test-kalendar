import { useState } from "react";
import Modal from "./Modal";
import TimeBlockModal from "./TimeBlockModal";
import Form from "./Form";
import { deleteBlock } from "../util/timeBlock";
import { deleteContract } from "../util/contract";
import style from "../css/ContractList.module.css"

function ContractList({ contracts, setSelectedContractId, setTimeBlocks, selectedContractId, setContracts }) {

    const [isOpenForm, setIsOpenForm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const deleteHandler = (id) => {
        let blocks = deleteBlock(id);
        let contracts = deleteContract(id);
        setTimeBlocks(blocks)
        setContracts(contracts);
    }


    return (
        <div className={`box ${style.container}`}>
            <button className={`block button is-dark ${style["create-btn"]}`} onClick={() => { setIsOpenForm(true) }}>Vytvořit zakázku</button>
            <ul className="block">
                {
                    contracts.map((contract) => {
                        return (
                            <div key={contract.code} className={`content box ${style.item} `}>
                                <div>
                                    <li onClick={() => { setIsOpen(true); setSelectedContractId(contract.code) }} key={contract.code}>
                                        {contract.name} ({contract.code})
                                    </li>
                                    {
                                        contract.extra.length > 0 && (
                                            <ul>
                                                {contract.extra.map((item) => (
                                                    <li onClick={() => { setIsOpen(true); setSelectedContractId(item.code) }} key={item.code}>{item.name} ({item.code})</li>
                                                ))}
                                            </ul>
                                        )
                                    }
                                </div>
                                <div className={style["close-icon"]} onClick={() => { deleteHandler(contract.code) }}>🦀</div>
                            </div>
                        );
                    })
                }
            </ul>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <TimeBlockModal setSelectedContractId={setSelectedContractId} setTimeBlocks={setTimeBlocks} selectedContractId={selectedContractId} />
            </Modal>
            <Modal open={isOpenForm} onClose={() => setIsOpenForm(false)}>
                <Form setContracts={setContracts}></Form>
            </Modal>
        </div>
    )
}

export default ContractList