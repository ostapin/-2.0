const creaturesData = {
    cow: {
        id: "cow",
        name: "Корова",
        description: "Крупный рогатый скот. Даёт молоко, используется для разведения. Мясо, шкура и кости ценятся в хозяйстве.",
        price_carcass: "65 серебряных",
        price_alive: "200 серебряных"
    },
    bull: {
        id: "bull",
        name: "Бык",
        description: "Самец коровы. Используется для разведения и как тягловая сила. Мясо грубее, но шкура крупная.",
        price_carcass: "90 серебряных",
        price_alive: "150 серебряных"
    },
    calf: {
        id: "calf",
        name: "Теленок",
        description: "Молодняк крупного рогатого скота. Выращивается для получения мяса или пополнения стада.",
        price_carcass: "20 серебряных",
        price_alive: "60 серебряных"
    },
    work_horse: {
        id: "work_horse",
        name: "Лошадь рабочая",
        description: "Выносливая лошадь, предназначенная для сельскохозяйственных работ и перевозки грузов.",
        price_carcass: "40 серебряных",
        price_alive: "300 серебряных"
    },
    riding_horse: {
        id: "riding_horse",
        name: "Лошадь верховая",
        description: "Благородное животное для верховой езды. Ценится за скорость, выносливость и стать.",
        price_carcass: "3 золотые",
        price_alive: "30 золотых"
    },
    foal: {
        id: "foal",
        name: "Жеребенок",
        description: "Детеныш лошади. Выращивается для последующего использования или продажи.",
        price_carcass: "1 золотая",
        price_alive: "8 золотых"
    },
    donkey: {
        id: "donkey",
        name: "Осел",
        description: "Выносливое вьючное животное. Неприхотлив в еде, используется для перевозки грузов в горах.",
        price_carcass: "30 серебряных",
        price_alive: "120 серебряных"
    },
    mule: {
        id: "mule",
        name: "Мул",
        description: "Помесь осла и лошади. Сочетает выносливость осла и силу лошади. Отличное вьючное животное.",
        price_carcass: "50 серебряных",
        price_alive: "180 серебряных"
    },
    pig: {
        id: "pig",
        name: "Свинья",
        description: "Домашнее животное, ценится за мясо и сало. Всеядна, быстро набирает вес.",
        price_carcass: "15 серебряных",
        price_alive: "60 серебряных"
    },
    piglet: {
        id: "piglet",
        name: "Поросенок",
        description: "Молодая свинья. Выращивается для получения мяса или разведения.",
        price_carcass: "4 серебряные",
        price_alive: "20 серебряных"
    },
    sheep: {
        id: "sheep",
        name: "Овца",
        description: "Домашнее животное, ценится за шерсть и мясо. Даёт молоко, из которого делают сыр.",
        price_carcass: "2 серебряные",
        price_alive: "15 серебряных"
    },
    ram: {
        id: "ram",
        name: "Баран",
        description: "Самец овцы с массивными рогами. Используется для разведения и получения шерсти.",
        price_carcass: "2 золотые 50 серебряных",
        price_alive: "12 серебряных"
    },
    lamb: {
        id: "lamb",
        name: "Ягненок",
        description: "Детеныш овцы. Мясо считается деликатесом, шерсть очень мягкая.",
        price_carcass: "80 медных",
        price_alive: "5 серебряных"
    },
    goat: {
        id: "goat",
        name: "Коза",
        description: "Домашнее животное, ценится за молоко и шерсть. Неприхотлива в еде.",
        price_carcass: "1 серебряная 50 медных",
        price_alive: "10 серебряных"
    },
    billy_goat: {
        id: "billy_goat",
        name: "Козел",
        description: "Самец козы, используется для разведения. Может быть агрессивным.",
        price_carcass: "2 серебряные",
        price_alive: "8 серебряных"
    },
    kid: {
        id: "kid",
        name: "Козленок",
        description: "Детеныш козы. Выращивается для получения молока, мяса или шерсти.",
        price_carcass: "70 медных",
        price_alive: "3 серебряные"
    },
    chicken: {
        id: "chicken",
        name: "Курица",
        description: "Домашняя птица, ценится за яйца и мясо. Самое распространённое сельскохозяйственное животное.",
        price_carcass: "12 медных",
        price_alive: "1 серебряная"
    },
    rooster: {
        id: "rooster",
        name: "Петух",
        description: "Самец курицы. Нужен для оплодотворения яиц и как «будильник».",
        price_carcass: "8 медных",
        price_alive: "60 медных"
    },
    chick: {
        id: "chick",
        name: "Цыпленок",
        description: "Детеныш курицы. Выращивается для получения мяса или пополнения стада.",
        price_carcass: "4 медные",
        price_alive: "30 медных"
    },
    duck: {
        id: "duck",
        name: "Утка",
        description: "Водоплавающая домашняя птица. Ценится за мясо, яйца и пух.",
        price_carcass: "15 медных",
        price_alive: "1 серебряная 20 медных"
    },
    duckling: {
        id: "duckling",
        name: "Утенок",
        description: "Детеныш утки. Выращивается для получения мяса и пуха.",
        price_carcass: "6 медных",
        price_alive: "50 медных"
    },
    goose: {
        id: "goose",
        name: "Гусь",
        description: "Крупная водоплавающая птица. Ценится за мясо, жир, перья и пух. Может быть агрессивным.",
        price_carcass: "30 медных",
        price_alive: "2 серебряные 50 медных"
    },
    gosling: {
        id: "gosling",
        name: "Гусенок",
        description: "Детеныш гуся. Выращивается для получения мяса и пуха.",
        price_carcass: "10 медных",
        price_alive: "1 серебряная"
    },
    pigeon: {
        id: "pigeon",
        name: "Голубь",
        description: "Птица, используемая для передачи почты. Мясо молодых голубей считается деликатесом.",
        price_carcass: "10 медных",
        price_alive: "40 медных"
    },
    rabbit: {
        id: "rabbit",
        name: "Кролик",
        description: "Небольшой грызун. Быстро размножается, ценится за диетическое мясо и мех.",
        price_carcass: "2 медные",
        price_alive: "20 медных"
    },
    mongrel_dog: {
        id: "mongrel_dog",
        name: "Собака дворняга",
        description: "Обычная деревенская собака. Используется для охраны двора и как компаньон.",
        price_carcass: "8 серебряных",
        price_alive: "25 серебряных"
    },
    hunting_dog: {
        id: "hunting_dog",
        name: "Собака охотничья",
        description: "Специально выведенная порода для охоты. Ценится за чутьё, скорость и послушание.",
        price_carcass: "70 серебряных",
        price_alive: "150 серебряных"
    },
    mongrel_puppy: {
        id: "mongrel_puppy",
        name: "Щенок дворняги",
        description: "Детеныш обычной собаки. Выращивается для охраны или как домашний любимец.",
        price_carcass: "3 серебряные",
        price_alive: "8 серебряных"
    },
    hunting_puppy: {
        id: "hunting_puppy",
        name: "Щенок охотничий",
        description: "Детеныш охотничьей собаки. Требует обучения, но в будущем станет ценным помощником.",
        price_carcass: "25 серебряных",
        price_alive: "50 серебряных"
    },
    cat: {
        id: "cat",
        name: "Кошка",
        description: "Домашнее животное, ценится за ловлю мышей и крыс. Независима и своенравна.",
        price_carcass: "4 серебряные",
        price_alive: "12 серебряных"
    },
    kitten: {
        id: "kitten",
        name: "Котенок",
        description: "Детеныш кошки. Выращивается для ловли грызунов или как домашний любимец.",
        price_carcass: "1 серебряная 50 медных",
        price_alive: "4 серебряные"
    },
    elk: {
        id: "elk",
        name: "Лось",
        description: "Крупный лесной зверь с ветвистыми рогами. Мясо ценится, рога используются в поделках.",
        price_carcass: "4 золотые",
        price_alive: "20 золотых"
    },
    reindeer: {
        id: "reindeer",
        name: "Северный олень",
        description: "Олень, приспособленный к холодному климату. Используется для транспорта, даёт молоко и шкуры.",
        price_carcass: "3 золотые 50 серебряных",
        price_alive: "15 золотых"
    },
    red_deer: {
        id: "red_deer",
        name: "Олень благородный",
        description: "Красивый лесной олень. Охота на него - привилегия знати. Рога ценятся как трофеи.",
        price_carcass: "5 золотых",
        price_alive: "25 золотых"
    },
    roe_deer: {
        id: "roe_deer",
        name: "Косуля",
        description: "Небольшой олень. Мясо нежное, шкура тонкая. Часто становится добычей охотников.",
        price_carcass: "2 золотые",
        price_alive: "12 золотых"
    },
    wild_boar: {
        id: "wild_boar",
        name: "Кабан",
        description: "Дикий лесной свин с клыками. Агрессивен, опасен для охотников. Мясо вкусное.",
        price_carcass: "3 золотые",
        price_alive: "15 золотых"
    },
    brown_bear: {
        id: "brown_bear",
        name: "Медведь бурый",
        description: "Крупный хищник. Очень опасен. Ценится за шкуру, мясо и жир, используемый в медицине.",
        price_carcass: "10 золотых",
        price_alive: "60 золотых"
    },
    wolf: {
        id: "wolf",
        name: "Волк",
        description: "Хищник, охотящийся стаями. Шкура тёплая, клыки используются в амулетах.",
        price_carcass: "2 золотые 50 серебряных",
        price_alive: "12 золотых"
    },
    lynx: {
        id: "lynx",
        name: "Рысь",
        description: "Крупная дикая кошка с кисточками на ушах. Ценится за красивый мех.",
        price_carcass: "3 золотые 50 серебряных",
        price_alive: "12 золотых"
    },
    fox: {
        id: "fox",
        name: "Лисица",
        description: "Хищник с красивым рыжим мехом. Хитра и осторожна. Мех ценится высоко.",
        price_carcass: "1 золотая 50 серебряных",
        price_alive: "8 золотых"
    },
    white_hare: {
        id: "white_hare",
        name: "Заяц-беляк",
        description: "Заяц, меняющий цвет на зиму. Мясо диетическое, шкурка идёт на шапки.",
        price_carcass: "6 медных",
        price_alive: "1 серебряная"
    },
    brown_hare: {
        id: "brown_hare",
        name: "Заяц-русак",
        description: "Крупный заяц, не меняющий цвет. Быстрее беляка. Ценится охотниками.",
        price_carcass: "10 медных",
        price_alive: "2 серебряные"
    },
    squirrel: {
        id: "squirrel",
        name: "Белка",
        description: "Маленький пушистый грызун. Ценится за мех, особенно зимний.",
        price_carcass: "20 серебряных",
        price_alive: "1 золотая 50 серебряных"
    },
    marten: {
        id: "marten",
        name: "Куница",
        description: "Небольшой хищник с ценным мехом. Мех куницы считается одним из лучших.",
        price_carcass: "1 золотая 50 серебряных",
        price_alive: "8 золотых"
    },
    badger: {
        id: "badger",
        name: "Барсук",
        description: "Крупный лесной хищник. Ценится за шкуру и жир, используемый в народной медицине.",
        price_carcass: "1 золотая",
        price_alive: "6 золотых"
    },
    beaver: {
        id: "beaver",
        name: "Бобр",
        description: "Грызун, строящий плотины. Ценится за мех и бобровую струю (выделения желёз).",
        price_carcass: "60 серебряных",
        price_alive: "1 золотая 50 серебряных"
    },
    otter: {
        id: "otter",
        name: "Выдра",
        description: "Водный хищник с ценным мехом. Мех очень тёплый и не промокает.",
        price_carcass: "50 серебряных",
        price_alive: "1 золотая 20 серебряных"
    },
    mink: {
        id: "mink",
        name: "Норка",
        description: "Небольшой хищник с очень ценным мехом. Разводится на фермах.",
        price_carcass: "40 серебряных",
        price_alive: "1 золотая"
    },
    ermine: {
        id: "ermine",
        name: "Горностай",
        description: "Маленький хищник. Зимой мех становится белым, высоко ценится.",
        price_carcass: "40 серебряных",
        price_alive: "1 золотая"
    },
    weasel: {
        id: "weasel",
        name: "Ласка",
        description: "Маленький хищник, полезен тем, что ловит мышей. Мех невысоко ценится.",
        price_carcass: "30 серебряных",
        price_alive: "1 золотая 50 серебряных"
    },
    capercaillie: {
        id: "capercaillie",
        name: "Глухарь",
        description: "Крупная лесная птица. Во время токования теряет слух, за что и получил название.",
        price_carcass: "40 серебряных",
        price_alive: "5 золотых"
    },
    black_grouse: {
        id: "black_grouse",
        name: "Тетерев",
        description: "Лесная птица. Токует весной на полянах. Мясо ценится.",
        price_carcass: "25 серебряных",
        price_alive: "3 золотые"
    },
    hazel_grouse: {
        id: "hazel_grouse",
        name: "Рябчик",
        description: "Небольшая лесная птица. Мясо считается деликатесом.",
        price_carcass: "15 серебряных",
        price_alive: "2 золотые"
    },
    partridge: {
        id: "partridge",
        name: "Куропатка",
        description: "Полевая птица. Часто становится добычей охотников. Яйца вкусные.",
        price_carcass: "20 серебряных",
        price_alive: "1 золотая 50 серебряных"
    },
    quail: {
        id: "quail",
        name: "Перепел",
        description: "Маленькая полевая птица. Яйца очень полезны, мясо нежное.",
        price_carcass: "25 серебряных",
        price_alive: "2 золотые"
    },
    pheasant: {
        id: "pheasant",
        name: "Фазан",
        description: "Красивая птица с длинным хвостом. Часто разводится в охотничьих угодьях.",
        price_carcass: "10 серебряных",
        price_alive: "1 золотая"
    },
    owl: {
        id: "owl",
        name: "Сова",
        description: "Ночная хищная птица. Используется для ловли мышей, а также как компаньон магов.",
        price_carcass: "1 золотая",
        price_alive: "5 золотых"
    },
    eagle_owl: {
        id: "eagle_owl",
        name: "Филин",
        description: "Крупная сова с «ушками». Редкая птица, ценится любителями.",
        price_carcass: "1 золотая 50 серебряных",
        price_alive: "8 золотых"
    },
    hawk: {
        id: "hawk",
        name: "Ястреб",
        description: "Хищная птица. Используется для соколиной охоты. Ценится за скорость.",
        price_carcass: "4 золотые",
        price_alive: "20 золотых"
    },
    eagle: {
        id: "eagle",
        name: "Орёл",
        description: "Крупная хищная птица. Символ власти и свободы. Охота с орлом - привилегия знати.",
        price_carcass: "6 золотых",
        price_alive: "40 золотых"
    },
    falcon: {
        id: "falcon",
        name: "Сокол",
        description: "Хищная птица, лучший охотник среди пернатых. Высоко ценится для соколиной охоты.",
        price_carcass: "8 золотых",
        price_alive: "30 золотых"
    },
    raven: {
        id: "raven",
        name: "Ворон",
        description: "Умная птица. Может обучаться речи. Считается спутником магов и тёмных сил.",
        price_carcass: "25 серебряных",
        price_alive: "1 золотая"
    },
    jay: {
        id: "jay",
        name: "Сойка",
        description: "Лесная птица с яркими перьями. Может подражать голосам других птиц.",
        price_carcass: "7 серебряных",
        price_alive: "1 золотая"
    },
    woodpecker: {
        id: "woodpecker",
        name: "Дятел",
        description: "Лесной лекарь. Долбит кору, поедая вредных насекомых. Редко содержится в неволе.",
        price_carcass: "6 серебряных",
        price_alive: "1 золотая"
    },
    crane: {
        id: "crane",
        name: "Журавль",
        description: "Крупная болотная птица. Красиво танцует во время брачных игр.",
        price_carcass: "1 золотая 30 серебряных",
        price_alive: "8 золотых"
    },
    stork: {
        id: "stork",
        name: "Аист",
        description: "Птица, приносящая детей. Гнездится рядом с людьми. Символ семейного счастья.",
        price_carcass: "1 золотая 20 серебряных",
        price_alive: "12 золотых"
    },
    heron: {
        id: "heron",
        name: "Цапля",
        description: "Болотная птица с длинными ногами и клювом. Охотится на рыбу и лягушек.",
        price_carcass: "1 золотая",
        price_alive: "6 золотых"
    },
    swan: {
        id: "swan",
        name: "Лебедь",
        description: "Красивая водоплавающая птица. Символ любви и верности. Перья используются для письма.",
        price_carcass: "3 золотые",
        price_alive: "15 золотых"
    },
    wild_duck: {
        id: "wild_duck",
        name: "Утка дикая",
        description: "Перелётная птица. Частая добыча охотников. Мясо вкусное.",
        price_carcass: "25 серебряных",
        price_alive: "2 золотые"
    },
    wild_goose: {
        id: "wild_goose",
        name: "Гусь дикий",
        description: "Крупная перелётная птица. Летит клином. Мясо и перья ценятся.",
        price_carcass: "50 серебряных",
        price_alive: "3 золотые"
    },
    camel: {
        id: "camel",
        name: "Верблюд одногорбый",
        description: "Пустынное животное. Долго может обходиться без воды. Используется как транспорт.",
        price_carcass: "8 золотых",
        price_alive: "60 золотых"
    },
    lion: {
        id: "lion",
        name: "Лев",
        description: "Царь зверей. Крупный хищник из жарких стран. Шкура и грива - символ власти.",
        price_carcass: "20 золотых",
        price_alive: "150 золотых"
    },
    tiger: {
        id: "tiger",
        name: "Тигр",
        description: "Крупный полосатый хищник. Очень опасен. Шкура бесценна, кости используются в медицине.",
        price_carcass: "80 золотых",
        price_alive: "500 золотых"
    },
    leopard: {
        id: "leopard",
        name: "Леопард",
        description: "Пятнистый хищник. Быстрый и ловкий. Шкура очень ценится.",
        price_carcass: "15 золотых",
        price_alive: "120 золотых"
    },
    cheetah: {
        id: "cheetah",
        name: "Гепард",
        description: "Самое быстрое наземное животное. Используется для охоты знатными особами.",
        price_carcass: "18 золотых",
        price_alive: "140 золотых"
    },
    elephant: {
        id: "elephant",
        name: "Слон",
        description: "Крупнейшее наземное животное. Бивни из слоновой кости - дорогой материал.",
        price_carcass: "80 золотых",
        price_alive: "500 золотых"
    },
    rhinoceros: {
        id: "rhinoceros",
        name: "Носорог",
        description: "Крупное животное с рогом на носу. Рог используется в магии и медицине.",
        price_carcass: "40 золотых",
        price_alive: "300 золотых"
    },
    hippo: {
        id: "hippo",
        name: "Бегемот",
        description: "Крупное водное животное. Очень опасно. Клыки ценятся как слоновая кость.",
        price_carcass: "45 золотых",
        price_alive: "300 золотых"
    },
    giraffe: {
        id: "giraffe",
        name: "Жираф",
        description: "Самое высокое животное. Пятнистая шкура ценится, мясо грубое.",
        price_carcass: "30 золотых",
        price_alive: "200 золотых"
    },
    zebra: {
        id: "zebra",
        name: "Зебра",
        description: "Полосатая лошадь. Не приручается. Шкура используется для ковров.",
        price_carcass: "7 золотых",
        price_alive: "45 золотых"
    },
    wildebeest: {
        id: "wildebeest",
        name: "Антилопа гну",
        description: "Крупная африканская антилопа. Совершает миграции. Мясо съедобно.",
        price_carcass: "6 золотых",
        price_alive: "30 золотых"
    },
    gazelle: {
        id: "gazelle",
        name: "Газель",
        description: "Стройная антилопа. Быстрая и пугливая. Мясо нежное.",
        price_carcass: "3 золотые",
        price_alive: "15 золотых"
    },
    ostrich: {
        id: "ostrich",
        name: "Страус",
        description: "Крупная нелетающая птица. Перья ценятся для украшений. Яйца огромные.",
        price_carcass: "8 золотых",
        price_alive: "40 золотых"
    },
    flamingo: {
        id: "flamingo",
        name: "Фламинго",
        description: "Розовая птица с длинными ногами. Перья используются для украшений.",
        price_carcass: "2 золотые",
        price_alive: "15 золотых"
    },
    peacock: {
        id: "peacock",
        name: "Павлин",
        description: "Птица с красивым хвостом. Перья - популярное украшение. Держат в садах знати.",
        price_carcass: "3 золотые",
        price_alive: "25 золотых"
    },
    parrot: {
        id: "parrot",
        name: "Попугай",
        description: "Яркая птица. Может обучаться человеческой речи. Ценится как домашний питомец.",
        price_carcass: "3 золотые",
        price_alive: "10 золотых"
    },
    monkey: {
        id: "monkey",
        name: "Обезьяна",
        description: "Забавное животное. Любит кривляться. Ценится как живой товар для развлечений.",
        price_carcass: "50 серебряных",
        price_alive: "5 золотых"
    },
    crocodile: {
        id: "crocodile",
        name: "Крокодил",
        description: "Крупный водный хищник. Шкура идёт на дорогие сапоги и сумки. Мясо съедобно.",
        price_carcass: "8 золотых",
        price_alive: "50 золотых"
    },
    turtle: {
        id: "turtle",
        name: "Черепаха",
        description: "Медлительное животное в панцире. Панцирь идёт на поделки. Некоторые виды живут очень долго.",
        price_carcass: "5 серебряных",
        price_alive: "2 золотые"
    },
    snake: {
        id: "snake",
        name: "Змея",
        description: "Пресмыкающееся. Некоторые виды ядовиты. Шкура используется, яд ценится в медицине.",
        price_carcass: "1 золотая",
        price_alive: "5 золотых"
    },
    python: {
        id: "python",
        name: "Питон",
        description: "Крупная неядовитая змея. Душит добычу. Шкура ценится, содержится в террариумах.",
        price_carcass: "4 золотые",
        price_alive: "30 золотых"
    },
    boa: {
        id: "boa",
        name: "Удав",
        description: "Крупная змея, как питон. Содержится в неволе. Шкура используется.",
        price_carcass: "4 золотые",
        price_alive: "25 золотых"
    },
    lizard: {
        id: "lizard",
        name: "Ящерица",
        description: "Маленькое пресмыкающееся. Многие виды продаются как домашние питомцы.",
        price_carcass: "2 серебряные",
        price_alive: "1 золотая"
    },
    hamster: {
        id: "hamster",
        name: "Хомяк",
        description: "Маленький грызун. Любит делать запасы. Часто продаётся как домашний питомец.",
        price_carcass: "3 серебряные",
        price_alive: "2 золотые"
    },
    guinea_pig: {
        id: "guinea_pig",
        name: "Морская свинка",
        description: "Небольшой грызун. Пищит. Часто держат как домашнее животное.",
        price_carcass: "10 серебряных",
        price_alive: "1 золотая"
    },
    ferret: {
        id: "ferret",
        name: "Хорёк",
        description: "Маленький хищник. Может охотиться на мышей. Ценится за мех.",
        price_carcass: "25 серебряных",
        price_alive: "3 золотые"
    },
    raccoon: {
        id: "raccoon",
        name: "Енот",
        description: "Полоскун. Моет еду в воде. Пушистый и любопытный. Держат как домашнего любимца.",
        price_carcass: "1 золотая",
        price_alive: "7 золотых"
    },
    skunk: {
        id: "skunk",
        name: "Скунс",
        description: "Чёрно-белый зверёк. При опасности брызгает вонючей жидкостью. Ради забавы держат редко.",
        price_carcass: "1 золотая",
        price_alive: "5 золотых"
    },
    porcupine: {
        id: "porcupine",
        name: "Дикобраз",
        description: "Грызун с иглами. Иглы используются для украшений и письма.",
        price_carcass: "1 золотая 50 серебряных",
        price_alive: "8 золотых"
    },
    lemming: {
        id: "lemming",
        name: "Лемминг",
        description: "Маленький грызун. Известен мифами о массовых самоубийствах. Используется как корм.",
        price_carcass: "1 серебряная",
        price_alive: "5 серебряных"
    }
};

// Для доступа из других модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = creaturesData;
}
