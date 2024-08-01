const { Sequelize } = require('sequelize');
const Order = require('../models/order.model');
const OrderDetail = require('../models/orderDetail.model');
const OrderDetailTopping = require('../models/orderDetailTopping.model');
const { sequelize } = require('../config/database');
const moment = require('moment-timezone');

class OrderService {
    async createOrder(orderData) {
        const transaction = await sequelize.transaction();
        try {
            const { totalPrice, note, orderDetails, status } = orderData;

            const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
            const orderDate = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            const order = await Order.create({
                orderDate,
                totalPrice,
                note,
                status
            }, { transaction });

            for (let detail of orderDetails) {
                const orderDetail = await OrderDetail.create({
                    orderId: order.id,
                    productId: detail.productId,
                    name: detail.name,
                    basePrice: detail.basePrice,
                    quantity: detail.quantity
                }, { transaction });

                if (detail.OrderDetailToppings && detail.OrderDetailToppings.length > 0) {
                    for (let topping of detail.OrderDetailToppings) {
                        await OrderDetailTopping.create({
                            orderDetailId: orderDetail.id,
                            toppingId: topping.toppingId,
                            name: topping.name,
                            basePrice: topping.basePrice,
                            quantity: topping.quantity
                        }, { transaction });
                    }
                }
            }

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error creating order: ${error.message}`);
        }
    }


    async updateOrder(orderId, orderData) {
        const transaction = await sequelize.transaction();
        try {
            const { totalPrice, note, orderDetails, status } = orderData;


            const order = await Order.findByPk(orderId, { transaction });
            if (!order) {
                throw new Error('Order not found');
            }

            await order.update({ totalPrice, note, status }, { transaction });


            const currentOrderDetails = await OrderDetail.findAll({ where: { orderId: order.id }, transaction });
            for (let detail of currentOrderDetails) {
                await OrderDetailTopping.destroy({ where: { orderDetailId: detail.id }, transaction });
                await detail.destroy({ transaction });
            }


            for (let detail of orderDetails) {
                const orderDetail = await OrderDetail.create({
                    orderId: order.id,
                    productId: detail.productId,
                    name: detail.name,
                    basePrice: detail.basePrice,
                    quantity: detail.quantity
                }, { transaction });

                if (detail.OrderDetailToppings && detail.OrderDetailToppings.length > 0) {
                    for (let topping of detail.OrderDetailToppings) {
                        await OrderDetailTopping.create({
                            orderDetailId: orderDetail.id,
                            toppingId: topping.toppingId,
                            name: topping.name,
                            basePrice: topping.basePrice,
                            quantity: topping.quantity
                        }, { transaction });
                    }
                }
            }

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error updating order: ${error.message}`);
        }
    }


    async getOrders() {
        try {
            const orders = await Order.findAll({
                include: [{
                    model: OrderDetail,
                    include: [{
                        model: OrderDetailTopping,
                    }]
                }]
            });
            return orders;
        } catch (error) {
            throw new Error(`Error fetching order: ${error.message}`);
        }
    }


    async getOrderById(orderId) {
        try {
            const order = await Order.findOne({
                where: { id: orderId },
                include: [{
                    model: OrderDetail,
                    include: [{
                        model: OrderDetailTopping,
                    }]
                }]
            });
            return order;
        } catch (error) {
            throw new Error(`Error fetching order: ${error.message}`);
        }
    }


    async deleteOrder(orderId) {
        const transaction = await sequelize.transaction();
        try {

            await OrderDetailTopping.destroy({
                where: {
                    orderDetailId: {
                        [Sequelize.Op.in]: Sequelize.literal(`(SELECT id FROM order_details WHERE orderId = ${orderId})`)
                    }
                },
                transaction
            });


            await OrderDetail.destroy({
                where: { orderId },
                transaction
            });


            const result = await Order.destroy({
                where: { id: orderId },
                transaction
            });

            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error deleting order: ${error.message}`);
        }
    }


    async getRevenue() {
        try {
            const today = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            const endOfToday = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            const result = await sequelize.query(`
                SELECT
                    COALESCE(SUM(totalPrice), 0) AS totalRevenue,
                    COALESCE(COUNT(id), 0) AS orderCount
                FROM orders
                WHERE orderDate BETWEEN :startDate AND :endDate
            `, {
                replacements: { startDate: today, endDate: endOfToday },
                type: Sequelize.QueryTypes.SELECT
            });

            return result[0];
        } catch (error) {
            throw new Error(`Error fetching revenue and order count for today: ${error.message}`);
        }
    }
}

module.exports = new OrderService();
