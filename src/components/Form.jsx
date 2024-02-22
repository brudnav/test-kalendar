import { useState } from "react";
import styles from "../css/Form.module.css";
import {
  saveContract,
  pushExtraContract,
  getContracts,
} from "../util/contract";

function Form({ setContracts }) {
  const [contractName, setContractName] = useState("");
  const [contractCode, setContractCode] = useState("");
  const [higherContractCode, setHigherContractCode] = useState("");

  const contractNameHandler = (e) => {
    setContractName(e.target.value);
  };
  const contractCodeHandler = (e) => {
    setContractCode(e.target.value);
  };
  const higherContractCodeHandler = (e) => {
    setHigherContractCode(e.target.value);
  };

  const createContract = () => {
    let contract = {
      name: contractName,
      code: contractCode,
      higherCode: higherContractCode.length == 0 ? null : higherContractCode,
      extra: [],
    };

    if (contract.higherCode != null) {
      pushExtraContract(contract);
      setContracts(getContracts());
      setContractName("");
      setContractCode("");
      setHigherContractCode("");
      return;
    }

    saveContract(contract);
    setContracts((prev) => {
      return [...prev, contract];
    });

    setContractName("");
    setContractCode("");
    setHigherContractCode("");
  };

  return (
    <div className={styles.container}>
      <label htmlFor="contractName">Název</label>
      <input
        className="input"
        id="contractName"
        type="text"
        value={contractName}
        onChange={contractNameHandler}
      />
      <label htmlFor="contractCode">Kód Zakázky</label>
      <input
        className="input"
        id="contractCode"
        type="text"
        value={contractCode}
        onChange={contractCodeHandler}
      />

      <label htmlFor="higherContractCode">Kód Nadřazené Zakázky</label>
      <input
        className="input"
        id="higherContractCode"
        type="text"
        value={higherContractCode}
        onChange={higherContractCodeHandler}
      />
      <button className="button is-light" onClick={createContract}>Vytvořit zakázku</button>
    </div>
  );
}

export default Form;
