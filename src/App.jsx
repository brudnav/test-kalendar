import { useState } from 'react';
import { getContracts } from "./util/contract";
import { Toaster } from 'react-hot-toast';
import ContractList from './components/ContractList'
import { getTimeBlocks } from './util/timeBlock';
import OriginalCalendar from './components/OriginalCalendar';
import style from "./css/App.module.css";
import "bulma/css/bulma.min.css"

function App() {

  const [contracts, setContracts] = useState(getContracts());
  const [timeBlocks, setTimeBlocks] = useState(getTimeBlocks());
  const [selectedContractId, setSelectedContractId] = useState("");

  return (
    <div className={style.container}>
      <Toaster />
      <ContractList setContracts={setContracts} contracts={contracts} setSelectedContractId={setSelectedContractId} selectedContractId={selectedContractId} setTimeBlocks={setTimeBlocks} />
      <OriginalCalendar timeBlocks={timeBlocks} setSelectedContractId={setSelectedContractId} selectedContractId={selectedContractId} setTimeBlocks={setTimeBlocks} />
    </div>
  )
}

export default App