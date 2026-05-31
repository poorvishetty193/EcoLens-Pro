// Simple in-memory cache as fallback, could be replaced with ioredis for Upstash Redis
const cache = new Map();

const get = async (key) => {
    try {
        const item = cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            cache.delete(key);
            return null;
        }
        return item.value;
    } catch (error) {
        console.error('Cache get error:', error);
        return null;
    }
};

const set = async (key, value, ttlSeconds = 3600) => {
    try {
        const expiry = Date.now() + (ttlSeconds * 1000);
        cache.set(key, { value, expiry });
        return true;
    } catch (error) {
        console.error('Cache set error:', error);
        return false;
    }
};

module.exports = {
    get,
    set
};
