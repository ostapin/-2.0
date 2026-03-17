// Данные по магии
const magicData = {
    spells: {
        fire: {
            name: "Огонь",
            schools: {}
        },
        earth: {
            name: "Земля",
            schools: {}
        },
        water: {
            name: "Вода",
            schools: {
                moisture: {
                    name: "Влага",
                    level: 1,
                    type: "Точечное заклятие",
                    effect: "Создает тонкую водяную пленку на теле и одежде, предотвращая иссушение организма в пустыне или океане. Альтернативно, генерирует влагу из ничего на поверхности в указанной точке.",
                    cast_time: "1 магический жест (1 секунда)",
                    duration: "1 час",
                    cooldown: "Можно применять повторно сразу после рассеивания",
                    cost: "30 маны",
                    enhancement: "При усилении заклинания увеличивается время действия и уровень охлаждения."
                }
            }
        },
        // остальные школы пока пустые
        air: { name: "Воздух", schools: {} },
        metal: { name: "Металл", schools: {} },
        nature: { name: "Природа", schools: {} },
        light: { name: "Свет", schools: {} },
        dark: { name: "Тьма", schools: {} },
        inferno: { name: "Инферно", schools: {} },
        chaos: { name: "Хаос", schools: {} },
        mind: { name: "Разум", schools: {} },
        life: { name: "Жизнь", schools: {} },
        death: { name: "Смерть", schools: {} },
        void: { name: "Пустота", schools: {} },
        blood: { name: "Кровь", schools: {} },
        energy: { name: "Энергия", schools: {} },
        ether: { name: "Эфир", schools: {} }
    },
    formation: {},
    runes: {}
};
