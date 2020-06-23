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
    let totalAmount = 0;
    let comedyBonus = 0;
    let bonusAmount = 0;
    let result_tag = document.getElementById('result')
    let result = `Счет для ${invoice.customer}\n`;

    for (let perf of invoice.performance) {
        let play = perf.type;
        let thisAmount = 0;
        let volumeCredits = 0;
        switch (play) {
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
                comedyBonus++
                break;
            default:
                throw new Error(`неизвестный тип: ${play}`);
        }
        // Добавление бонусов
        volumeCredits += Math.max(perf.audience - 30, 0);
        bonusAmount += volumeCredits;

        // Дополнительный бонус за каждые 10 комедий
        if (play === "comedy" && comedyBonus === 10) {
            volumeCredits += Math.floor(perf.audience / 5);
            comedyBonus = 0;
        }
        play = (play === 'tragedy') ? 'Трагедия' : 'Комедия';
        // Вывод строки счета
        result = `${play}: ${FORMATTER(thisAmount)}<br>
            Количество мест - ${perf.audience}<br>
            Итого с вас - ${FORMATTER(totalAmount)}<br>
            Вы заработали - ${volumeCredits} бонусов <br>
            Всего бонусов - ${bonusAmount}<br>`
        result_tag.innerHTML += result + "<hr>"
    }

}

statement(invoices)
