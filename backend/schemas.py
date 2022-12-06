# Schemas file for database Team 06 - FMS
#
# @zgr2788
#
# Description:
# Includes the schemas to the tables used in backend.
# For further description on variables, refer to `models.py`

import datetime as _dt
import pydantic as _pydantic
from pydantic.schema import Optional

#*************************
#       TEAM
#*************************

# Team Schemas
## Base model
class _TeamBase(_pydantic.BaseModel):
    name: str

## Team create model - inherits TeamBase
class TeamCreate(_TeamBase):
    pass_hash: str
    budget_total: float
    email: str



    class Config:
        orm_mode = True

## Main Team schema - inherits TeamBase
class Team(_TeamBase):
    id: int
    budget_alloc: float
    budget_rem: float

    class Config:
        orm_mode = True


#*************************
#       ADMIN
#*************************

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

#*************************
#       BUDGET
#*************************

# Budget Schemas
## Base model
class _BudgetItemBase(_pydantic.BaseModel):
    item_name: str
    amount: float
    team_name: str


# Budget create model - inherits BudgetItemBase
class BudgetItemCreate(_BudgetItemBase):

    class Config:
        orm_mode = True

class BudgetItem(_BudgetItemBase):
    date_created: _dt.datetime
    date_last_updated: _dt.datetime
    support_docs: Optional[str]
    id: int
    doc_verified: bool
    doc_rejected: bool

    class Config:
        orm_mode = True
