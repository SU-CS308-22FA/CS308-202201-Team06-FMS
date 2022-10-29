# Main API for database Team 06 - FMS
#
# @zgr2788
#
# Description:
# Includes the driver code for the backend.

import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm
import services as _services, schemas as _schemas, models as _models, database as _database
import passlib.hash as _hash
from typing import List

app = _fastapi.FastAPI()

_services.create_database()


# Create master admin
@app.on_event("startup")
async def startup():
    # Add the superadmin account that can add others
    superAdmin = _models.Admin(
        email = "admin@admin.com", 
        first_name = "admin", 
        last_name = "admin", 
        pass_hash = _hash.bcrypt.hash("admin123")
    )

    if not await _services.get_admin_by_email(superAdmin.email, _database.SessionLocal()):
        return await _services.create_master(superAdmin, _database.SessionLocal())
    
    return 0



#*************************
#       ADMIN + TEAM
#*************************

@app.post("/api/tokens")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), 
    db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    team = await _services.authenticate_team(form_data.username, form_data.password, db)
    admin = await _services.authenticate_admin(form_data.username, form_data.password, db)


    if not team and not admin:
        raise _fastapi.HTTPException(status_code = 401, detail = "Invalid credentials!")

    if team:
        return await _services.create_team_token(team)

    elif admin:
        return await _services.create_admin_token(admin)

#*************************
#       ADMIN
#*************************

# Create admin user
@app.post("/api/admins")
async def create_admin(
    admin: _schemas.AdminCreate, db:_orm.Session = _fastapi.Depends(_services.get_db), adminAuth: _schemas.Admin = _fastapi.Depends(_services.get_current_admin)
):
    # Check if admin exists
    db_admin = await _services.get_admin_by_email(admin.email ,db)
    
    if db_admin:
        raise _fastapi.HTTPException(status_code = 400, detail = "Admin email already registered to database!")
    
    # If not, create new admin
    await _services.create_admin(admin, db)

    return await _services.create_admin_token(admin)

# Get current admin user
@app.get("/api/admins/me", response_model=_schemas.Admin)
async def get_admin(admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin)):
    return admin

#*************************
#       TEAM
#*************************

# Create team user
@app.post("/api/admins/createteam")
async def create_team(
    team: _schemas.TeamCreate, db:_orm.Session = _fastapi.Depends(_services.get_db), admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin)
):
    # Check if team exists
    db_team_name = await _services.get_team_by_name(team.name ,db)
    db_team_email = await _services.get_team_by_email(team.email, db)
    
    if db_team_name:
        raise _fastapi.HTTPException(status_code = 400, detail = "Team name already registered to database!")

    elif db_team_email:
        raise _fastapi.HTTPException(status_code = 400, detail = "Team email already registered to database!")

    # If not, create new team
    await _services.create_team(team, db)

    return await _services.create_team_token(team)


# Get current team user
@app.get("/api/teams/me", response_model=_schemas.Team)
async def get_team(team: _schemas.Team = _fastapi.Depends(_services.get_current_team)):
    return team

#*************************
#       BUDGET
#*************************

# Create budget item - Team
@app.post("/api/teams/createitem", response_model=_schemas.BudgetItem)
async def team_create_item(
    budgetItem: _schemas.BudgetItemCreate, db:_orm.Session = _fastapi.Depends(_services.get_db), team: _schemas.Team = _fastapi.Depends(_services.get_current_team)
):

     # Make sure the team is writing to itself
    if team.name != budgetItem.team_name:
        raise _fastapi.HTTPException(status_code = 401, detail = "You are not authorized to write this item!")
    

    # Check if budget item exists
    db_budget = await _services.get_budget_item(budgetItem.team_name, budgetItem.item_name, db)
    db_team = await _services.get_team_by_name(budgetItem.team_name, db)
    
    if db_budget:
        raise _fastapi.HTTPException(status_code = 400, detail = "Duplicate budget items are not allowed!")
    
    if not db_team:
        raise _fastapi.HTTPException(status_code = 400, detail = "Team does not exist in database!")
    

   
    
    # Query team to see if they will be overbudget, do not allow if so
    #Team = db.query(_models.Team).filter(_models.Team.name == budgetItem.team_name).first()
    #
    #if (Team.budget_rem < budgetItem.amount):
    #    raise _fastapi.HTTPException(status_code = 400, detail = "Budget will be exceeded, item not allowed!")
    
    # Amount should be above 0
    #if (budgetItem.amount <= 0):
    #    raise _fastapi.HTTPException(status_code = 400, detail = "Item amount should be larger than 0!")


    
 

    # Create new budget item
    return await _services.create_budgetItem(budgetItem, db)


# Create budget item - Admin
@app.post("/api/admins/createitem", response_model=_schemas.BudgetItem)
async def admin_create_item(budgetItem: _schemas.BudgetItemCreate, db:_orm.Session = _fastapi.Depends(_services.get_db), admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin)
):

    # Check if budget item exists
    db_budget = await _services.get_budget_item(budgetItem.team_name, budgetItem.item_name, db)
    db_team = await _services.get_team_by_name(budgetItem.team_name, db)
    
    if db_budget:
        raise _fastapi.HTTPException(status_code = 400, detail = "Duplicate budget items are not allowed!")
    
    if not db_team:
        raise _fastapi.HTTPException(status_code = 400, detail = "Team does not exist in database!")
    
    # Query team to see if they will be overbudget, do not allow if so
    #Team = db.query(_models.Team).filter(_models.Team.name == budgetItem.team_name).first()
    #
    #if (Team.budget_rem < budgetItem.amount):
    #    raise _fastapi.HTTPException(status_code = 400, detail = "Budget will be exceeded, item not allowed!")
    
    # Amount should be above 0
    #if (budgetItem.amount <= 0):
    #    raise _fastapi.HTTPException(status_code = 400, detail = "Item amount should be larger than 0!")


    # Admins can write to anyone, so no restrictions
 

    # Create new budget item
    return await _services.create_budgetItem(budgetItem, db)


# Get all budget items - Team
@app.get("/api/teams/getitem", response_model= List[_schemas.BudgetItem])
async def team_get_item(db:_orm.Session = _fastapi.Depends(_services.get_db), team: _schemas.Team = _fastapi.Depends(_services.get_current_team)):
    return await _services.get_items(team = team, db = db)


