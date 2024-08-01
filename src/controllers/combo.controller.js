const Combo = require('../models/combo.model');
const ComboDetail = require('../models/comboDetail.model');

Combo.hasMany(ComboDetail, { foreignKey: 'combo_id' });
ComboDetail.belongsTo(Combo, { foreignKey: 'combo_id' });

exports.getCombos = async (req, res) => {
    try {
        const combos = await Combo.findAll({
            include: [ComboDetail],
        });
        res.json(combos);
    } catch (error) {
        console.error('Error while getting combos:', error);
        res.status(500).json({ error: 'Error while getting combos' });
    }
};

