
export function saveTimeBlock({ id, start, end, state, parent }) {

    let timeBlock = {
        id,
        start,
        end,
        state,
        parent
    };

    let timeBlocks = getTimeBlocks();
    timeBlocks.push(timeBlock);

    timeBlocks = JSON.stringify(timeBlocks);

    localStorage.setItem("timeBlocks", timeBlocks);

}

export function saveTimeBlocks(timeBlocks) {

    timeBlocks = JSON.stringify(timeBlocks);

    localStorage.setItem("timeBlocks", timeBlocks);

}

export function getTimeBlocks() {
    let timeBlocks = localStorage.getItem("timeBlocks") ? localStorage.getItem("timeBlocks") : [];

    if (localStorage.getItem("timeBlocks")) {
        timeBlocks = JSON.parse(timeBlocks);
    }


    return timeBlocks;
}

export function deleteBlock(id) {
    let timeBlocks = getTimeBlocks();

    timeBlocks = timeBlocks.filter((block) => block.id != id && block?.parent != id)

    saveTimeBlocks(timeBlocks);

    return timeBlocks;
}

export function findBlock(id) {

    let timeBlocks = getTimeBlocks();
    let timeBlock = timeBlocks.filter((block) => block.id == id)

    return timeBlock;

}

export function editBlock(id, newBlock) {
    let timeBlock = findBlock(id);
    let timeBlocks = getTimeBlocks();

    timeBlock = { ...timeBlock[0], ...newBlock }
    timeBlocks = timeBlocks.filter((block) => block.id != id)

    timeBlocks.push(timeBlock);

    saveTimeBlocks(timeBlocks);

    return timeBlocks;
}




