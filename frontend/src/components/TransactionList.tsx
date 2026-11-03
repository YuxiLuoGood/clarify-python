import { type Transaction } from "../types";

type TransactionListProps = {
    transactions:Transaction[]
}

function TransactionList({transactions}:TransactionListProps){
    return(
        <ul>
            {transactions.map((t) => (
            <li key={t.id}>
                Description: {t.description}
                amount: {t.amount}
                category: {t.category}
                date:{t.date}
            </li>
            ))}
        </ul>
    )
}

export default TransactionList