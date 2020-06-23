const FORMATTER = new Intl.NumberFormat("ru-RU",
    {
        style: "currency", currency: "RUB",
        minimumFractionDigits: 2
    }).format;


let invoices = {
    "customer": "MDT",
    "performance": [
        {
            "playId": "Гамлет",
            "audience": 55,
            "type": "tragedy"
        },
        {
            "playId": "Ромео и Джульетта",
            "audience": 35,
            "type": "tragedy"
        },
        {
            "playId": "Отелло",
            "audience": 40,
            "type": "comedy"
        }
    ]
}

function statement(invoice) {
    /** Accept .json file with list of plays,
     *  calculate price for costumer and return
     *  to HTML page
     */
    let totalAmount = 0;
    let comedyBonusCounter = 0;
    let bonusAmount = 0;
    let result_tag = document.getElementById('result')
    let result;

    for (let perf of invoice.performance) {
        let play_type = perf.type;
        let thisAmount = 0;
        let volumeCredits = 0;
        switch (play_type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                    totalAmount += thisAmount;
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                totalAmount += thisAmount;
                comedyBonusCounter++
                break;
            default:
                throw new Error(`неизвестный тип: ${play_type}`);
        }
        // Add bonuses
        volumeCredits += Math.max(perf.audience - 30, 0);
        bonusAmount += volumeCredits;

        // Additional bonuses for even 10 comedy's
        if (play_type === "comedy" && comedyBonusCounter === 10) {
            volumeCredits += Math.floor(perf.audience / 5);
            comedyBonusCounter = 0;
        }
        // change variable name to more readable format
        play_type = (play_type === 'tragedy') ? 'Трагедия' : 'Комедия';

        // return result to HTML page
        result = `Счёт для ${invoice.customer}<br>
            ${play_type}: ${FORMATTER(thisAmount)}<br>
            Количество мест - ${perf.audience}<br>
            Итого с вас - ${FORMATTER(totalAmount)}<br>
            Вы заработали - ${volumeCredits} бонусов <br>
            Всего бонусов - ${bonusAmount}<br>`
        result_tag.innerHTML += result + "<hr>"
    }

}

statement(invoices)
