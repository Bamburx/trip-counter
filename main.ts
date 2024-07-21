interface Spending {
    id: string;
    name: string;
    amount: number;
    payerId: string;
}

interface User {
    id: string;
    email: string;
}

interface UserBalance {
    userId: string;
    balance: number;
}

interface Transation {
    from: string;
    to: string;
    amount: number;
}

const users: User[] = [
    { email: 'michal@wp.pl', id: 'dd35' },
    { email: 'danio@wp.pl', id: 'dd36' },
    { email: 'piotras@wp.pl', id: 'dd3g' },
    { email: 'kamson@wp.pl', id: 'dc33' },
];

const spendings: Spending[] = [
    {
        id: '111231',
        name: 'lody',
        amount: 10,
        payerId: 'dd35',
    },
    {
        id: '112231',
        name: 'parówki',
        amount: 10,
        payerId: 'dd35',
    },
    {
        id: '112231',
        name: 'woda',
        amount: 20,
        payerId: 'dc33',
    },
    {
        id: '111233',
        name: 'gała',
        amount: 20,
        payerId: 'dd36',
    },
    {
        id: '111234',
        name: 'bulka',
        amount: 40,
        payerId: 'dd35',
    },
    {
        id: '111237',
        name: 'kebab',
        amount: 90,
        payerId: 'dd35',
    },
    {
        id: '111234',
        name: 'bulka',
        amount: 10,
        payerId: 'dc33',
    },
];


const getBalance = (spendings: Spending[], users: User[]) => {
    const balanceList: { [key: string]: number } = {};
    let totalExpenses = 0;
    users.forEach(user => {
        balanceList[user.id] = 0;
    })
    spendings.forEach(spending => {
        const { payerId, amount } = spending;
        balanceList[payerId] += amount;
        totalExpenses += amount;
    });
    return { balanceList, totalExpenses };
}

const getAverage = (spendings: Spending[], users: User[]) => {
    let sum: number = 0

    spendings.forEach(spending => {
        const { amount } = spending;
        sum += amount;
    })
    let average = sum / users.length
    return average;
}

function getTransactions(spendings: Spending[], users: User[]) {
    const { balanceList, totalExpenses } = getBalance(spendings, users);
    const average = getAverage(spendings, users);
    const creditors: UserBalance[] = [];
    const debtors: UserBalance[] = [];
    const transationList: Transation[] = [];

    users.forEach(user => {
        const balance = balanceList[user.id] - average;

        if (balance > 0) {
            creditors.push({ userId: user.id, balance })
        } else if (balance < 0) {
            debtors.push({ userId: user.id, balance })
        }
    });

    creditors.sort((a, b) => a.balance - b.balance);
    debtors.sort((a, b) => a.balance - b.balance);
    const creditorList = creditors.map(creditor => ({ ...creditor }));
    const debtorList = debtors.map(debtor => ({ ...debtor }));

    while (creditors.length > 0 && debtors.length > 0) {
        const creditor = creditors[0];
        const debtor = debtors[0];
        const payoff = Math.min(creditor.balance, -debtor.balance);

        transationList.push({
            from: debtor.userId,
            to: creditor.userId,
            amount: payoff
        });

        creditor.balance -= payoff;
        debtor.balance += payoff;

        if (creditor.balance === 0) {
            creditors.shift();
        }

        if (debtor.balance === 0) {
            debtors.shift();
        }
    }
    return { totalExpenses, creditorList, debtorList, transationList  };
}

const result = getTransactions(spendings, users);
console.log(result)




// https://pl.wikipedia.org/wiki/Problem_wydawania_reszty
// ang. debt settlement algorithm