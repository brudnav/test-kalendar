import TimeBlock from "./TimeBlock"

function Calendar({ timeBlocks, setTimeBlocks, setContracts }) {
    return (
        <div>
            <h1>Kalendář</h1>
            <ul>
                {
                    timeBlocks.map((block, key) => {
                        return (
                            <TimeBlock setContracts={setContracts} setTimeBlocks={setTimeBlocks} block={block} key={key} />
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Calendar