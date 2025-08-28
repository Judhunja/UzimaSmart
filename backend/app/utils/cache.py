"""
Redis cache utilities
"""
import os
import json
import redis.asyncio as redis
from typing import Any, Optional
from dotenv import load_dotenv

load_dotenv()

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Global redis client
redis_client: Optional[redis.Redis] = None

async def init_cache():
    """Initialize Redis connection"""
    global redis_client
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    try:
        await redis_client.ping()
        print("Cache connected successfully")
    except Exception as e:
        print(f"Cache connection failed: {e}")

async def get_cache(key: str) -> Optional[Any]:
    """Get value from cache"""
    if not redis_client:
        return None
    
    try:
        value = await redis_client.get(key)
        if value:
            return json.loads(value)
    except Exception as e:
        print(f"Cache get error: {e}")
    return None

async def set_cache(key: str, value: Any, ttl: int = 3600) -> bool:
    """Set value in cache with TTL"""
    if not redis_client:
        return False
    
    try:
        await redis_client.setex(key, ttl, json.dumps(value, default=str))
        return True
    except Exception as e:
        print(f"Cache set error: {e}")
        return False

async def delete_cache(key: str) -> bool:
    """Delete key from cache"""
    if not redis_client:
        return False
    
    try:
        await redis_client.delete(key)
        return True
    except Exception as e:
        print(f"Cache delete error: {e}")
        return False

async def clear_cache_pattern(pattern: str) -> int:
    """Clear cache keys matching pattern"""
    if not redis_client:
        return 0
    
    try:
        keys = await redis_client.keys(pattern)
        if keys:
            return await redis_client.delete(*keys)
    except Exception as e:
        print(f"Cache clear error: {e}")
    return 0
