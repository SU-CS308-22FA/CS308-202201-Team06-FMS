# Services file for database Team 06 - FMS
#
# @zgr2788
#
# Description:
# Includes the services provided by the backend.


import database as _database
import models as _models
import schemas as _schemas
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import jwt as _jwt
import json as _json
import fastapi as _fastapi
import fastapi.security as _security

# Secrets and oauth2 schemas
JWT_SECRET_ADMIN = "MESSISUPPORTSFINANCIALMANGEMENTSYSTEM"
JWT_SECRET_TEAM = "RONALDOSUPPORTSFINANCIALMANAGEMENTSYSTEM"
oauth2scheme = _security.OAuth2PasswordBearer(tokenUrl = "/api/tokens")

# Create
def create_database():
    return _database.Base.metadata.create_all(bind = _database.engine)

# Get db
def get_db():
    db = _database.SessionLocal()
    
    try:
        yield db
    finally:
        db.close()



#*************************
#       ADMIN
#*************************

# Create Master Admin
async def create_master(admin: _models.Admin, db: _orm.Session):

    # Write to db
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

# Get Admin through email
async def get_admin_by_email(email: str, db: _orm.Session):
    return db.query(_models.Admin).filter(_models.Admin.email == email).first()

# Create new Admin user
async def create_admin(admin: _schemas.AdminCreate, db: _orm.Session):
    
    # New admin object
    adminObj = _models.Admin(
        email = admin.email, 
        first_name = admin.first_name, 
        last_name = admin.last_name, 
        pass_hash = _hash.bcrypt.hash(admin.pass_hash)
    )

    # Write to db
    db.add(adminObj)
    db.commit()
    db.refresh(adminObj)
    return adminObj

# Authenticate Admin
async def authenticate_admin(email: str, password: str, db: _orm.Session):
    admin = await get_admin_by_email(email, db)

    # Check if admin in database
    if not admin:
        return False
    
    # Check if password matches
    if not admin.verify_password(password):
        return False

    return admin

# Generate Admin token
async def create_admin_token(admin: _models.Admin):
    adminObj = _schemas.Admin.from_orm(admin)

    token = _jwt.encode(_json.loads(_json.dumps(adminObj.dict(), indent = 4, sort_keys=True, default=str)), JWT_SECRET_ADMIN)

    return dict(access_token = token, token_type = "bearer")

# Get current Admin user
async def get_current_admin( db: _orm.Session = _fastapi.Depends(get_db), token: str = _fastapi.Depends(oauth2scheme)):
    try:
        payload = _jwt.decode(token, JWT_SECRET_ADMIN, algorithms=["HS256"])
        admin = db.query(_models.Admin).get(payload["id"])
    except:
        raise _fastapi.HTTPException(status_code = 401, detail = "Your account is not authorized for this action!")

    return _schemas.Admin.from_orm(admin)

#*************************
#       TEAM
#*************************

# Get Team through name
async def get_team_by_name(name: str, db: _orm.Session):
    return db.query(_models.Team).filter(_models.Team.name == name).first()

# Get Team through e-mail
async def get_team_by_email(email: str, db: _orm.Session):
    return db.query(_models.Team).filter(_models.Team.email == email).first()

# Update Team budget
async def update_team_budget(name: str, change: float, db: _orm.Session):
    return db.query(_models.Team).filter(_models.Team.name == name).update({'budget_alloc' : _models.Team.budget_alloc + change})

# Create new Team user
async def create_team(team: _schemas.TeamCreate, db: _orm.Session):
    
    # New Team object
    teamObj = _models.Team(
        email = team.email, 
        name = team.name,
        budget_total = team.budget_total,  
        pass_hash = _hash.bcrypt.hash(team.pass_hash)
    )

    # Write to db
    db.add(teamObj)
    db.commit()
    db.refresh(teamObj)
    return teamObj

# Authenticate Team
async def authenticate_team(email: str, password: str, db: _orm.Session):
    team = await get_team_by_email(email, db)

    # Check if team in database
    if not team:
        return False
    
    # Check if password matches
    if not team.verify_password(password):
        return False

    return team

# Generate Team token
async def create_team_token(team: _models.Team):
    teamObj = _schemas.Team.from_orm(team)

    token = _jwt.encode(teamObj.dict(), JWT_SECRET_TEAM)

    return dict(access_token = token, token_type = "bearer")

# Get current Team user
async def get_current_team( db: _orm.Session = _fastapi.Depends(get_db), token: str = _fastapi.Depends(oauth2scheme)):
    try:
        payload = _jwt.decode(token, JWT_SECRET_TEAM, algorithms=["HS256"])
        team = db.query(_models.Team).get(payload["id"])
    except:
        raise _fastapi.HTTPException(status_code = 401, detail = "Your account is not authorized for this action!")

    return _schemas.Team.from_orm(team)

#*************************
#       BUDGET
#*************************

# Get Budget through team & item names
async def get_budget_item(team_name: str, item_name: str, db: _orm.Session):
    return db.query(_models.BudgetItem).filter(_models.BudgetItem.team_name == team_name, _models.BudgetItem.item_name == item_name).first()

# Create new BudgetItem
async def create_budgetItem(budgetItem: _schemas.BudgetItemCreate, db: _orm.Session):
    
    # Update Team Budget
    await update_team_budget(budgetItem.team_name, budgetItem.amount, db)

    # New Team object
    budgetObj = _models.BudgetItem(
        team_name = budgetItem.team_name, 
        item_name = budgetItem.item_name,
        amount = budgetItem.amount,  
    )

    # Write to db
    db.add(budgetObj)
    db.commit()
    db.refresh(budgetObj)
    return budgetObj

# Get Items
async def get_items(team: _schemas.Team, db: _orm.Session):
    items = db.query(_models.Team).filter_by(team_name=team.name)

    return list(map(_schemas.BudgetItem.from_orm, items))