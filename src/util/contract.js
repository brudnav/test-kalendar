
export function saveContract({ name, code, higherCode }) {


    let contract = {
        name,
        code,
        higherCode,
        extra: []
    };

    let contracts = getContracts();
    contracts.push(contract);

    contracts = JSON.stringify(contracts);

    localStorage.setItem("contracts", contracts);

}

export function saveContracts(contracts) {

    contracts = JSON.stringify(contracts);

    localStorage.setItem("contracts", contracts);

}

export function getContracts() {
    let contracts = localStorage.getItem("contracts") ? localStorage.getItem("contracts") : [];

    if (localStorage.getItem("contracts")) {
        contracts = JSON.parse(contracts);
    }


    return contracts;
}

export function hasContractParent(contract) {
    for (const key in contract) {
        if (key == "higherCode" && contract[key] != null) {
            return true;
        }
    }
    return false;
}

export function pushExtraContract(contract) {

    const contracts = getContracts();
    for (const key in contracts) {
        console.log(contracts, key);
        console.log(contracts[key].code, contract.higherCode)
        if (contracts[key].code == contract.higherCode) {
            contracts[key].extra.push(contract);
            saveContracts(contracts);
        }
    }
}

export function deleteContract(id) {
    let contracts = getContracts();

    contracts = contracts.filter((contract) => contract.code != id)

    saveContracts(contracts);

    return contracts;
}

export function isChild(id, contracts = getContracts()) {

    for (const contract of contracts) {
        // Pokud najdeme kontrakt s daným ID
        if (contract.code === id) {
            // Vrátíme higherCode pokud existuje, jinak null
            return contract.higherCode ? contract.higherCode : null;
        }
        // Pokud má kontrakt vnořené kontrakty, rekurzivně hledáme v nich
        if (contract.extra && contract.extra.length > 0) {
            const higherCode = isChild(id, contract.extra);
            if (higherCode !== undefined) {
                return higherCode;
            }
        }
    }
    // Pokud kontrakt s daným ID nebyl nalezen ani na hlavní ani na vnořené úrovni
    return undefined;
}