import { useState } from "react";
import Modal from "./Modal";
import TimeBlockModal from "./TimeBlockModal";
import Form from "./Form";
import { deleteBlock } from "../util/timeBlock";
import { deleteContract } from "../util/contract";
import style from "../css/ContractList.module.css"

function ContractList({ contracts, setSelectedContractId, setTimeBlocks, selectedContractId, setContracts }) {

    const [isOpenForm, setIsOpenForm] = useState(false);

    const deleteHandler = (id) => {

        let blocks = deleteBlock(id);
        console.log(blocks);
        let contracts = deleteContract(id);
        console.log(contracts);

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
                                <div className={style.row}>
                                    <li key={contract.code}>
                                        {contract.name} ({contract.code})
                                    </li>
                                    <div className={style["close-icon"]} onClick={() => { deleteHandler(contract.code) }}>🦀</div>
                                </div>
                                {
                                    contract.extra.length > 0 && (
                                        <ul>
                                            {contract.extra.map((item) => (
                                                <div key={item.code} className={style.row}>
                                                    <li>{item.name} ({item.code})</li>
                                                    <div className={style["close-icon"]} onClick={() => { deleteHandler(item.code) }}>🦀</div>
                                                </div>
                                            ))}
                                        </ul>
                                    )
                                }
                            </div>
                        );
                    })
                }
            </ul>
            <Modal open={isOpenForm} onClose={() => setIsOpenForm(false)}>
                <Form setContracts={setContracts}></Form>
            </Modal>
        </div>
    )
}

export default ContractList