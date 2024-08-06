const ToppingService = require('../services/topping.service.js');



exports.getTopping = async (req, res) => {
    try {
        const toppings = await ToppingService.getTopping();
        res.json(toppings);
    } catch (error) {
        console.error('Error while getting topping: ', error);
        res.status(500).json({ error: 'Error while getting topping' });
    }
};


exports.getToppingsByProductId = async (req, res) => {
    try {
        const productId = req.params.productId;
        const toppings = await ToppingService.getToppingsByProductId(productId);
        if (toppings.length > 0) {
            res.json(toppings);
        } else {
            res.status(404).json({ error: 'Topping not found' });
        }
    } catch (error) {
        console.error('Error while getting toppings by product: ', error);
        res.status(500).json({ error: 'Error while getting toppings by product' });
    }
};


exports.createTopping = async (req, res) => {
    try {
        const newTopping = await ToppingService.createTopping(req.body);
        res.status(201).json(newTopping);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.updateTopping = async (req, res) => {
    try {
        const { id } = req.params;
        const toppingData = req.body;

        const updateTopping = await ToppingService.updateTopping(id, toppingData);

        if (updateTopping) {
            res.json(updateTopping);
        } else {
            res.status(404).json({ error: 'Topping not found' });
        }
    } catch (error) {
        console.error('Error while updating topping: ', error);
        res.status(500).json({ error: 'Error while updating topping' });
    }
}

exports.deleteTopping = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await ToppingService.deleteTopping(id);
        if (result) {
            res.json({ message: `Xóa topping thành công topping có id ${id}` });
        } else {
            res.status(404).json({ error: 'Topping không tồn tại' });
        }
    } catch (error) {
        console.error('Error deleting topping', error);
        res.status(500).json({ error: 'Error deleting topping' });
    }
}