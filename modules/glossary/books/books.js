let booksData = [
    {
        id: "alchemist_vol1",
        title: "Приключения алхимика. Том 1",
        author: "Мартин Лортекс",
        description: "Первая книга о странствиях алхимика...",
        file: "modules/glossary/books/alchemist_vol1.html"
    },
    {
        id: "alchemist_vol2",
        title: "Приключения алхимика. Том 2",
        author: "Мартин Лортекс",
        description: "Продолжение истории...",
        file: "modules/glossary/books/alchemist_vol2.html"
    },
    {
        id: "alchemist_vol3",
        title: "Приключения алхимика. Том 3",
        author: "Мартин Лортекс",
        description: "Завершающая часть...",
        file: "modules/glossary/books/alchemist_vol3.html"
    },
    {
        id: "geographica_aldanara_vol1",
        title: "Том I. Географика Альданара",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Географический трактат о континенте Альданар: его размерах, климате, магии и государствах.",
        file: "modules/glossary/books/geographica_aldanara_vol1.html"
    },
    {
        id: "empire_ruda_vol1",
        title: "Империя Руда. Том I. Основание",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Общие сведения об Империи Руда, её географии, климате и вулкане Игнис-Монс.",
        file: "modules/glossary/books/empire_ruda_vol1.html"
    },
    {
        id: "empire_ruda_vol2",
        title: "Империя Руда. Том II. Структура",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Административное деление, вертикаль власти и древние руины Империи Руда.",
        file: "modules/glossary/books/empire_ruda_vol2.html"
    },
    {
        id: "empire_ruda_vol3",
        title: "Империя Руда. Том III. Династия",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Совет Империи, императорская семья Корнелов и знатные роды.",
        file: "modules/glossary/books/empire_ruda_vol3.html"
    },
    {
        id: "empire_ruda_vol4",
        title: "Империя Руда. Том IV. Запреты",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Магические запреты, законы Империи и магические кланы.",
        file: "modules/glossary/books/empire_ruda_vol4.html"
    },
    {
        id: "empire_ruda_vol5",
        title: "Империя Руда. Том V. Приговоры",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Судебная система, таблица преступлений и наказаний, городская стража.",
        file: "modules/glossary/books/empire_ruda_vol5.html"
    },
    {
        id: "empire_ruda_vol6",
        title: "Империя Руда. Том VI. Время",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Календарь Империи, праздники и религия.",
        file: "modules/glossary/books/empire_ruda_vol6.html"
    },
    {
        id: "empire_ruda_vol7",
        title: "Империя Руда. Том VII. Быт",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Народ и его облик, одежда, кухня и вино, манера речи и поговорки, армия.",
        file: "modules/glossary/books/empire_ruda_vol7.html"
    },
    {
        id: "empire_ruda_vol8",
        title: "Империя Руда. Том VIII. Наследие",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Похоронные обряды, валюта и сферы, флот и Тёмные воды.",
        file: "modules/glossary/books/empire_ruda_vol8.html"
    },
    {
        id: "empire_ruda_left_vol1",
        title: "Империя Руда. Левая часть. Том I. Основание",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Общие сведения о левой части Империи Руда, её географии, климате и чудесах.",
        file: "modules/glossary/books/empire_ruda_left_vol1.html"
    },
    {
        id: "empire_ruda_left_vol2",
        title: "Империя Руда. Левая часть. Том II. Структура",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Административное деление левой части, префекты и столица Прима.",
        file: "modules/glossary/books/empire_ruda_left_vol2.html"
    },
    {
        id: "empire_ruda_left_vol3",
        title: "Империя Руда. Левая часть. Том III. Голосование",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Сенат, партии, выборы и знатные роды левой части Империи.",
        file: "modules/glossary/books/empire_ruda_left_vol3.html"
    },
    {
        id: "empire_ruda_left_vol4",
        title: "Империя Руда. Левая часть. Том IV. Хозяйство",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Бюджет и налоги, городская стража и армия левой части Империи.",
        file: "modules/glossary/books/empire_ruda_left_vol4.html"
    },
    {
        id: "empire_ruda_left_vol5",
        title: "Империя Руда. Левая часть. Том V. Запреты",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Магические запреты и законы левой части Империи.",
        file: "modules/glossary/books/empire_ruda_left_vol5.html"
    },
    {
        id: "empire_ruda_left_vol6",
        title: "Империя Руда. Левая часть. Том VI. Приговоры",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Судебная система, смертная казнь и городская стража левой части Империи.",
        file: "modules/glossary/books/empire_ruda_left_vol6.html"
    },
    {
        id: "empire_ruda_left_vol7",
        title: "Империя Руда. Левая часть. Том VII. Династия",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Император Луций Корнел, его семья и флот левой части Империи.",
        file: "modules/glossary/books/empire_ruda_left_vol7.html"
    },
    {
        id: "empire_ruda_left_vol8",
        title: "Империя Руда. Левая часть. Том VIII. Сады",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Сенаторы, здание Сената — Висячие сады Примы, и отношения Империи с соседями.",
        file: "modules/glossary/books/empire_ruda_left_vol8.html"
    },
    {
        id: "gods_and_mortals_vol1",
        title: "Боги и Смертные: Айоры и Атевры — Рождение Богов",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "О том, что было до богов, первом звуке Айо, рождении Айоров и Атевров, их вечном конфликте и посмертии.",
        file: "modules/glossary/books/gods_and_mortals/gods_and_mortals_vol1.html"
    },
    {
        id: "gods_and_mortals_vol2",
        title: "Боги и Смертные: Айоры и Атевры — Созидатели",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Подробно о каждом из Айоров: Альвия, Кайрос, Торвин, Селина, Илоран — их заповеди, подношения, жрецы и общие обряды.",
        file: "modules/glossary/books/gods_and_mortals/gods_and_mortals_vol2.html"
    },
    {
        id: "gods_and_mortals_vol3",
        title: "Боги и Смертные: Айоры и Атевры — Отступники",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Подробно о каждом из Атевров: Моргат, Некрут, Лилит, Сайлен, Вальгор — их заповеди, подношения, культы и обряды.",
        file: "modules/glossary/books/gods_and_mortals/gods_and_mortals_vol3.html"
    },
    {
        id: "gods_and_mortals_vol4",
        title: "Боги и Смертные: Айоры и Атевры — Храмы, Культы и Обряды",
        author: "Магистр-картограф Линней из Дома Странствий",
        description: "Храмы и жрецы Айоров, святилища, праздники, обряды жизненного цикла, тайные культы Атевров и отношение к вере.",
        file: "modules/glossary/books/gods_and_mortals/gods_and_mortals_vol4.html"
    }
];
