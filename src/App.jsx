import { useState } from 'react';
import { getContracts } from "./util/contract";
import { Toaster } from 'react-hot-toast';
import ContractList from './components/ContractList'
import { getTimeBlocks } from './util/timeBlock';
import Calendar from './components/Calendar';
import style from "./css/App.module.css";
import "bulma/css/bulma.min.css"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';




function App() {

  const [contracts, setContracts] = useState(getContracts());
  const [timeBlocks, setTimeBlocks] = useState(getTimeBlocks());
  const [selectedContractId, setSelectedContractId] = useState("");

  const states = ["new", "in-progress", "completed"];
  const [isOpen, setIsOpen] = useState(false);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );

  const countBlocksState = (state) => {
    return timeBlocks.filter(block => block.state === state).length;
  }

  console.log(timeBlocks);

  return (
    <div className={style.container}>
      <Toaster />
      <ContractList setContracts={setContracts} contracts={contracts} setTimeBlocks={setTimeBlocks} />
      <Calendar timeBlocks={timeBlocks} setSelectedContractId={setSelectedContractId} selectedContractId={selectedContractId} setTimeBlocks={setTimeBlocks} />

      <div onClick={() => { setIsOpen(!isOpen) }} className={style["close-btn"]}>
        {isOpen ? "➡️" : "⬅️"}
      </div>
      <div className={isOpen ? style["chart-container-open"] : style["chart-container-closed"]}>
        <h2>Přehled stavů zakázek</h2>
        <Doughnut
          data={{
            labels: ["Nová", "V Přípravě", "Hotová"],
            datasets: [
              {
                data: [countBlocksState(states[0]), countBlocksState(states[1]), countBlocksState(states[2])],
                backgroundColor: ["#36a2eb", "#ff9020", "#ff6384"]
              },

            ],
          }}

        />

      </div>

    </div>
  )
}

export default App
