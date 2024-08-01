const syncService = require('../sync/syncService');

exports.sync = async (req, res) => {
    {
        try {
            await syncService.syncCategories();
            await syncService.syncProducts();
            res.status(200).json({ message: 'Sync job initiated successfully' });
        } catch (error) {
            console.error('Error initiating sync job:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}


