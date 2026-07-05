from fastapi import Query
from typing import Optional

class PaginationParams:
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        size: int = Query(50, ge=1, le=100, description="Items per page")
    ):
        self.page = page
        self.size = size
        self.offset = (page - 1) * size
        self.limit = size

class SortParams:
    def __init__(
        self,
        sort_by: Optional[str] = Query(None, description="Field to sort by"),
        order: str = Query("desc", regex="^(asc|desc)$", description="Sort order (asc or desc)")
    ):
        self.sort_by = sort_by
        self.order = order

class FilterParams:
    def __init__(
        self,
        search: Optional[str] = Query(None, description="Global text search"),
        status: Optional[str] = Query(None, description="Filter by status")
    ):
        self.search = search
        self.status = status
