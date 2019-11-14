const {
    DocTypeModel,
    DocumentModel,
    ExtrafieldModel,
    UserFieldModel
} = require('../models');

const users = [
    {
        name: 'Вадим Удачин',
        id: 1,
        city_of_obtaining: {
            id: 77,
            name: 'Moscow'
        }
    },
    {
        name: 'Степан Войцинский',
        id: 2,
        city_of_obtaining: {
            id: 77,
            name: 'Moscow'
        }
    },
]

const documents = [
    {
        doctype_id: 1,
        person_id: 1,
        date_create: Date.now(),
        date_destroy: new Date(Date.now() + 4 * 12 * 30 * 24 * 3600 * 1000),
        city_of_obtaining_id: 77
    },
    {
        doctype_id: 1,
        person_id: 2,
        date_create: Date.now(),
        date_destroy: new Date(Date.now() + 4 * 12 * 30 * 24 * 3600 * 1000),
        city_of_obtaining_id: 77
    }
]

const docTypes = [
    {name: 'Passport'},
    {name: 'Student ticket'},
]

const extraFields = [
    {name: 'Выдан', doctype_id: 1},
    {name: "Национальность", doctype_id: 1}
]

const fields = [
    {
        extrafield_id: 1,
        person_id: 1
    },
    {
        extrafield_id: 2,
        person_id: 1
    },
    {
        extrafield_id: 1,
        person_id: 2
    },
    {
        extrafield_id: 2,
        person_id: 2
    }
]

const fieldValues = [
    {
        field_id: 1,
        value: 'Отделом УФМС по Волгоградской области Красноармейского района города Волгограда'
    },
    {
        field_id: 2,
        value: 'Русский'
    },
    {
        field_id: 2,
        value: 'Джигит'
    },
    {
        field_id: 3,
        value: 'Украиной'
    },
    {
        field_id: 4,
        value: 'Украинец'
    },
    {
        field_id: 4,
        value: 'Хлопец'
    }
]

const seedDB = async function () {
    await DocTypeModel.bulkCreate(docTypes);
    await ExtrafieldModel.bulkCreate(extraFields);
    await DocumentModel.bulkCreate(documents);
    await UserFieldModel.bulkCreate(fields);

}

module.exports = seedDB;
