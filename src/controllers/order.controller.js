const OrderService = require('../services/order.service');

exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const order = await OrderService.createOrder(orderData);
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ error: error.message });
    }
};


exports.updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderData = req.body;
        const updatedOrder = await OrderService.updateOrder(orderId, orderData);
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(400).json({ error: error.message });
    }
};


exports.getOrders = async (req, res) => {
    try {
        const orders = await OrderService.getOrders();
        res.json(orders);
    } catch (error) {
        console.error('Error while getting orders:', error);
        res.status(500).json({ error: 'Error while getting orders' });
    }
}


exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderService.getOrderById(orderId);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(400).json({ error: error.message });
    }
};


exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await OrderService.deleteOrder(orderId);
        if (result) {
            res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(400).json({ error: error.message });
    }
};


exports.getRevenue = async (req, res) => {
    try {
        const result = await OrderService.getRevenue();
        res.json(result);
    } catch (error) {
        console.error('Error fetching revenue and order count for today:', error);
        res.status(500).json({ error: error.message });
    }
};

