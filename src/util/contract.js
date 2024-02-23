
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

export function getContractsAll() {
    let contracts = localStorage.getItem("contracts") ? JSON.parse(localStorage.getItem("contracts")) : [];

    function findAllContracts(contracts, allContracts = []) {
        contracts.forEach(contract => {
            allContracts.push(contract); // Přidáme aktuální contract do výsledného pole
            if (contract.extra && contract.extra.length > 0) {
                // Pokud má contract další vnořené contracts, prohledáme i ty
                findAllContracts(contract.extra, allContracts);
            }
        });
        return allContracts;
    }

    return findAllContracts(contracts);
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

export function findById(code, contracts = getContracts(),) {

    // Procházení každého objektu v poli
    for (const contract of contracts) {
        // Pokud se kód shoduje, vrátit tento objekt
        if (contract.code === code) {
            return contract;
        }
        // Pokud má objekt pole 'extra', rekurzivně prohledat toto pole
        if (contract.extra.length > 0) {
            const found = findById(code, contract.extra);
            if (found) {
                return found;
            }
        }
    }
    // Pokud není nalezen žádný objekt s daným kódem, vrátit null
    return null;
}

