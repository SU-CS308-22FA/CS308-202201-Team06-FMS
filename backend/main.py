# Main API for database Team 06 - FMS
#
# @zgr2788
#
# Description:
# Includes the driver code for the backend.

import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm
import services as _services, schemas as _schemas, models as _models

app = _fastapi.FastAPI()

_services.create_database()
#*************************

# Create admin user
@app.post("/api/admins")
async def create_admin(
    admin: _schemas.AdminCreate, db:_orm.Session = _fastapi.Depends(_services.get_db)
):
    # Check if admin exists
    db_admin = await _services.get_admin_by_email(admin.email ,db)
    
    if db_admin:
        raise _fastapi.HTTPException(status_code = 400, detail = "Admin email already registered to database!")
    
    # If not, create new admin
    return await _services.create_admin(admin, db)


#*************************
#       TEAM
#*************************

# Create team user
@app.post("/api/teams")
async def create_team(
    team: _schemas.TeamCreate, db:_orm.Session = _fastapi.Depends(_services.get_db)
):
    # Check if team exists
    db_team_name = await _services.get_team_by_name(team.name ,db)
    db_team_email = await _services.get_team_by_email(team.email, db)
    
    if db_team_name:
        raise _fastapi.HTTPException(status_code = 400, detail = "Team name already registered to database!")

    elif db_team_email:
        raise _fastapi.HTTPException(status_code = 400, detail = "Team email already registered to database!")

    # If not, create new team
    return await _services.create_team(team, db)


#*************************
#       BUDGET
#*************************

# Create budget item
@app.post("/api/budgetitems")
async def create_item(
    budgetItem: _schemas.BudgetItemCreate, db:_orm.Session = _fastapi.Depends(_services.get_db)
):

    # Check if budget item exists
    db_budget = await _services.get_budget_item(budgetItem.team_name, budgetItem.item_name, db)
    db_team = await _services.get_team_by_name(budgetItem.team_name, db)
    
    if db_budget:
        raise _fastapi.HTTPException(status_code = 400, detail = "Duplicate budget items are not allowed!")
    
    if not db_team:
        raise _fastapi.HTTPException(status_code = 400, detail = "Team does not exist in database!")
    
    # Query team to see if they will be overbudget, do not allow if so
    Team = db.query(_models.Team).filter(_models.Team.name == budgetItem.team_name).first()
    
    if (Team.budget_rem < budgetItem.amount):
        raise _fastapi.HTTPException(status_code = 400, detail = "Budget will be exceeded, item not allowed!")
    
    # Amount should be above 0
    if (budgetItem.amount <= 0):
        raise _fastapi.HTTPException(status_code = 400, detail = "Item amount should be larger than 0!")


    
 

    # Create new budget item
    return await _services.create_budgetItem(budgetItem, db)