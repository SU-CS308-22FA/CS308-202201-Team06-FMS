# Main API for database Team 06 - FMS
#
# @zgr2788
#
# Description:
# Includes the driver code for the backend.

from email import iterators
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
        email = "a@a", 
        first_name = "admin", 
        last_name = "admin", 
        pass_hash = _hash.bcrypt.hash("123")
    )

    if not await _services.get_admin_by_email(superAdmin.email, _database.SessionLocal()):
        return await _services.create_master(superAdmin, _database.SessionLocal())
    
    return 0

#*************************
#       ROOT
#*************************
@app.get("/api")
async def root():
    return {"message" : "Welcome to the Financial Management System by Team 06"}


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
    return await _services.create_admin(admin, db)

# Get current admin user
@app.get("/api/admins/me", response_model=_schemas.Admin)
async def get_admin(admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin)):
    return admin

# Create Team user
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
    return await _services.create_team(team, db)

    #return await _services.create_team_token(teamObj)

# Get Team user
@app.get("/api/admins/{team_name}", status_code = 200)
async def admin_get_team(team_name: str, admin : _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_team_admin(team_name = team_name, db = db)

@app.get("/api/admins/getteams/", status_code=200)
async def get_teams(admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_all_teams(db=db)


# Update Team user
@app.put("/api/admins/updateteam/{team_name}", status_code = 200)
async def admin_update_team(team_name : str, team: _schemas.TeamCreate, admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.update_team_admin(team_name = team_name, team = team, db = db)

# Delete Team user
@app.delete("/api/admins/deleteteam/{team_name}", status_code = 204)
async def admin_delete_team(team_name: str, admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    await _services.delete_team_admin(team_name = team_name, db = db)
    return {"message" : "Successfully Deleted"}

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
    return await _services.create_budget_item(budgetItem, db)

# Get all budget items - Admin
@app.get("/api/admins/getallitems/", status_code=200)
async def get_all_items(admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_all_items(db = db)

# Get a specific budget item - Admin
@app.get("/api/admins/getspecificitem/{team_name}/{item_name}", status_code=200)
async def admin_get_item(team_name: str, item_name : str , admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_item_admin(item_name = item_name, team_name = team_name, db = db)

# Delete a specific budget item - Admin
@app.delete("/api/admins/deleteitem/{team_name}/{item_name}", status_code = 204)
async def admin_delete_item(team_name: str, item_name : str, admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    await _services.delete_item_admin(team_name = team_name, item_name = item_name, db = db)
    return {"message" : "Successfully Deleted"}

# Update a specific budget item - Admin
@app.put("/api/admins/updateitem/{team_name}/{item_name}", status_code = 200)
async def admin_update_item(team_name : str, item_name : str, budgetItem: _schemas._BudgetItemBase, admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.update_item_admin(team_name = team_name, item_name = item_name, budgetItem = budgetItem, db = db)

# Download item - Admin
@app.get("/api/admins/getdocs/{team_name}/{item_name}")
async def admin_get_docs(item_name : str, team_name : str, admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_docs_admin(item_name = item_name, team_name = team_name, db = db)

# Verify item - Admin
@app.put("/api/admins/verifydocs/{team_name}/{item_name}")
async def admin_verify_docs(item_name : str, team_name : str, admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.verify_docs_admin(item_name = item_name, team_name = team_name, db = db)

# Reject item - Admin
@app.put("/api/admins/rejectdocs/{team_name}/{item_name}")
async def admin_reject_docs(item_name : str, team_name : str, admin: _schemas.Admin = _fastapi.Depends(_services.get_current_admin), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.reject_docs_admin(item_name = item_name, team_name = team_name, db = db)

#*************************
#       TEAM
#*************************


# Get current team user
@app.get("/api/teams/me", response_model=_schemas.Team)
async def get_team(team: _schemas.Team = _fastapi.Depends(_services.get_current_team)):
    return team

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
    return await _services.create_budget_item(budgetItem, db)

# Get all budget items - Team
@app.get("/api/teams/getitems", response_model= List[_schemas.BudgetItem])
async def team_get_items(db:_orm.Session = _fastapi.Depends(_services.get_db), team: _schemas.Team = _fastapi.Depends(_services.get_current_team)):
    return await _services.get_items_team(team = team, db = db)

# Get a specific budget item - Team
@app.get("/api/teams/getspecificitem/{team_name}/{item_name}", status_code=200)
async def team_get_item(item_name : str, team_name: str, team: _schemas.Team = _fastapi.Depends(_services.get_current_team), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_item_team(item_name = item_name, team = team, db = db)

# Delete a specific budget item - Team
@app.delete("/api/teams/deleteitem/{team_name}/{item_name}", status_code = 204)
async def team_delete_item(item_name : str, team_name: str, team: _schemas.Team = _fastapi.Depends(_services.get_current_team), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    await _services.delete_item_team(item_name = item_name, team = team, db = db)
    return {"message" : "Successfully Deleted"}

# Update a specific budget item - Team
@app.put("/api/teams/updateitem/{team_name}/{item_name}", status_code = 200)
async def team_update_item(item_name : str, team_name: str, budgetItem: _schemas._BudgetItemBase, team: _schemas.Team = _fastapi.Depends(_services.get_current_team), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.update_item_team(item_name = item_name, budgetItem = budgetItem, team = team, db = db)

# Upload supporting docs for a specific budget item - Team
@app.post("/api/teams/docs/{team_name}/{item_name}")
async def team_add_docs(item_name : str, team_name : str, file : _fastapi.UploadFile, team: _schemas.Team = _fastapi.Depends(_services.get_current_team), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.add_docs_team(item_name = item_name, file = file, team = team, db = db)

# Download supporting docs for a specific budget item - Team
@app.get("/api/teams/getdocs/{team_name}/{item_name}")
async def team_get_docs(item_name : str, team_name : str, team: _schemas.Team = _fastapi.Depends(_services.get_current_team), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_docs_team(item_name = item_name, team = team, db = db)

# Get specific budget item by id - Team
@app.get("/api/teams/getspecificitembyid/{team_name}/{id}", status_code=200)
async def team_get_item_id(team_name : str, id: int, team: _schemas.Team = _fastapi.Depends(_services.get_current_team), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_item_id(team = team, id = id, db = db)

# Update specific budget item by id - Team
# Update a specific budget item - Team
@app.put("/api/teams/updateitembyid/{team_name}/{id}", status_code = 200)
async def team_update_item_id(id : int, team_name: str, budgetItem: _schemas._BudgetItemBase, team: _schemas.Team = _fastapi.Depends(_services.get_current_team), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.update_item_id(id = id, budgetItem = budgetItem, team = team, db = db)

# Export table - Team
@app.get("/api/teams/exporttable/{team_name}")
async def team_export_table(team_name : str, team : _schemas.Team = _fastapi.Depends(_services.get_current_team), db : _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.export_table_team(team = team, db = db)

# Import table - Team
@app.post("/api/teams/importtable/{team_name}")
async def team_import_table(team_name : str, file : _fastapi.UploadFile, team : _schemas.Team = _fastapi.Depends(_services.get_current_team), db : _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.import_table_team(team = team, db = db, file=file)

# Private item - Team
@app.put("/api/teams/setprivate/{team_name}/{id}", status_code = 200)
async def team_private_toggle(id : int, team_name: str, team: _schemas.Team = _fastapi.Depends(_services.get_current_team), db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.private_item_id(id = id, team = team, db = db)
