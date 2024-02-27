import { useState } from "react";
import styles from "../css/Form.module.css";
import {
  saveContract,
  pushExtraContract,
  getContracts,
  findById,
} from "../util/contract";
import toast from "react-hot-toast"

function Form({ setContracts }) {
  const [contractName, setContractName] = useState("");
  const [contractCode, setContractCode] = useState("");
  const [higherContractCode, setHigherContractCode] = useState("");
  const [btnIsDisabled, setBtnIsDisabled] = useState(false);

  const contractNameHandler = (e) => {
    setContractName(e.target.value);
  };
  const contractCodeHandler = (e) => {
    setContractCode(e.target.value);
  };
  const higherContractCodeHandler = (e) => {
    setHigherContractCode(e.target.value);
  };

  const handleClick = () => {
    setBtnIsDisabled(true);

    setTimeout(() => {
      setBtnIsDisabled(false);
    }, 3000);
  }

  const createContract = () => {

    const notify = () => toast.success("Úspěšně jsi vytvořil zakázku");

    if (contractName == "") {
      alert("Nezadal jsi \"Název\"")
      return;
    }

    if (contractCode == "") {
      alert("Nezadal jsi \"Kód Zakázky\"")
      return;
    }

    if (findById(contractCode)) {
      alert("Tento kód zakázky již používáš");
      return;
    }

    if (!findById(higherContractCode) && higherContractCode != "") {
      alert("Kód nadřazené zakázky neexistuje")
      return;
    }

    if (findById(higherContractCode)?.higherCode != null && higherContractCode != "") {
      alert("Kód nadřazené zakázky obsahuje kód podzakázky")
      return;
    }


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

    handleClick();
    notify();
  };

  return (
    <>
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
        <button disabled={btnIsDisabled} className="button is-light" onClick={createContract}>Vytvořit zakázku</button>
      </div>
    </>
  );
}

export default Form;
