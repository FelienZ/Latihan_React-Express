exports.shorthands = undefined;
exports.up = (pgm) => {
    pgm.createTable('items', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        name: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        category: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        price: {
            type: 'INT',
            notNull: true
        },
        stock: {
            type: 'INT',
            notNull: true
        },
        description: {
            type: 'TEXT'
        }
    })
};
exports.down = (pgm) => {
    pgm.dropTable('items')
};
