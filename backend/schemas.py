# Schemas file for database Team 06 - FMS
#
# @zgr2788
#
# Description:
# Includes the schemas to the tables used in backend.
# For further description on variables, refer to `models.py`

import datetime as _dt
import pydantic as _pydantic


# Team Schemas
## Base model
class _TeamBase(_pydantic.BaseModel):
    email: str
    name: str

## Team create model - inherits TeamBase
class TeamCreate(_TeamBase):
    pass_hash: str


    class Config:
        orm_mode = True

## Main Team schema - inherits TeamBase
class Team(_TeamBase):
    id: int
    budget_total: float
    budget_alloc: float
    budget_rem: float
    is_overlimit: bool

    class Config:
        orm_mode = True


# Admin Schemas
## Base model
class _AdminBase(_pydantic.BaseModel):
    email: str
    first_name: str
    last_name: str

## Admin create model - inherits AdminBase
class AdminCreate(_AdminBase):
    pass_hash: str

    class Config:
        orm_mode = True

## Main Admin schema - inherits AdminBase
class Admin(_AdminBase):
    id: int
    date_registered: _dt.datetime

    class Config:
        orm_mode = True


# Budget Schemas
## Base model
class _BudgetItemBase(_pydantic.BaseModel):
    team_name: str
    item_name: str
    amount: float

# Budget create model - inherits BudgetItemBase
class BudgetItemCreate(_BudgetItemBase):
    pass

class BudgetItem(_BudgetItemBase):
    date_created: _dt.datetime
    date_last_updated: _dt.datetime

    class Config:
        orm_mode = True
