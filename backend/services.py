# Services file for database Team 06 - FMS
#
# @zgr2788
#
# Description:
# Includes the services provided by the backend.


from curses import use_default_colors
import database as _database
import models as _models
import schemas as _schemas
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import jwt as _jwt
import json as _json
import fastapi as _fastapi
import fastapi.security as _security
import fastapi.responses as _resp
import datetime as _dt
from dateutil import tz as _tz
import PyPDF2 as _pdf
from ast import literal_eval
import os



# Define timezones
from_zone = _tz.gettz('UTC')
to_zone = _tz.gettz('Turkey')

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

# Get team info - Admin
async def get_team_admin(team_name : str, db: _orm.Session):
    team = await get_team_by_name(team_name, db)

    if team is None:
        raise _fastapi.HTTPException(status_code=404, detail="Team not found in database!")
    
    return team

# Update team info - Admin
async def update_team_admin(team_name : str, team : _schemas.TeamCreate, db : _orm.Session):
    
    # Check if new team name is unique
    team_db = await get_team_by_name(team.name, db)
    mail_db = await get_team_by_email(team.email, db)
    
    if team_db:
        raise _fastapi.HTTPException(status_code = 400, detail = "A team with the same name exists!")
    
    if mail_db:
        raise _fastapi.HTTPException(status_code = 400, detail = "A team with the same email exists!")
    

    # Update all items belonging to team
    items = db.query(_models.BudgetItem).filter_by(team_name=team_name)

    for item in items:
        item.team_name = team.name
        item.date_last_updated = _dt.datetime.utcnow().replace(tzinfo=from_zone).astimezone(to_zone)

        # File update
        if item.support_docs:
            newFileName = "supportfiles/" + team.name + "_" + item.item_name + ".pdf"
            os.rename(item.support_docs, newFileName)
            item.support_docs = newFileName 

        db.commit()
        db.refresh(item)

    # Now update the team
    team_db = await get_team_by_name(name = team_name, db = db)


    if team_db is None:
        raise _fastapi.HTTPException(status_code=404, detail = "Team not found in database!")

    team_db.name = team.name
    team_db.email = team.email
    team_db.budget_total = team.budget_total
    team_db.pass_hash = _hash.bcrypt.hash(team.pass_hash)

    db.commit()
    db.refresh(team_db)

    return _schemas.Team.from_orm(team_db)

# Delete team info - Admin
async def delete_team_admin(team_name : str, db : _orm.Session):
    
    # Delete all items belonging to team
    items = db.query(_models.BudgetItem).filter_by(team_name=team_name)

    for item in items:
        await update_team_budget(name = team_name, change = -item.amount, db = db)

        # Delete docs
        if item.support_docs:
            os.remove(item.support_docs)

        db.delete(item)
        db.commit()
    
    # Now delete the team
    team_db = await get_team_by_name(name = team_name, db = db)

    if team_db is None:
        raise _fastapi.HTTPException(status_code=404, detail = "Team not found in database!")

    db.delete(team_db)
    db.commit()

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

# Get Items - Admin
async def get_all_items(db: _orm.Session,  skip: int= 0, limit: int = 100):
    items = db.query(_models.BudgetItem).all()
    return list(map(_schemas.BudgetItem.from_orm, items))


# Item selector - Admin
async def _item_selector_admin(item_name: str, team_name: str, db: _orm.Session):
    item = (

        db.query(_models.BudgetItem)
        .filter(_models.BudgetItem.item_name == item_name, _models.BudgetItem.team_name == team_name)
        .first()
    )

    if item is None:
        raise _fastapi.HTTPException(status_code=404, detail= "Budget item does not exist!")
    
    return item

# Get item - Admin
async def get_item_admin(item_name: str, team_name: str, db: _orm.Session):
    item = await _item_selector_admin(item_name = item_name, team_name = team_name, db = db)

    return _schemas.BudgetItem.from_orm(item)

# Delete item - Admin
async def delete_item_admin(team_name : str, item_name: str, db: _orm.Session):
    item = await _item_selector_admin(item_name = item_name, team_name = team_name, db = db)

    # Update team budget as well
    await update_team_budget(name = team_name, change = -item.amount, db = db)

    db.delete(item)
    db.commit()

# Update item - Team
async def update_item_admin(team_name : str, item_name: str, budgetItem: _schemas._BudgetItemBase, db: _orm.Session):
    item = await _item_selector_admin(item_name = item_name, team_name = team_name, db = db)

    item.item_name = budgetItem.item_name
    change = budgetItem.amount - item.amount 
    item.amount = budgetItem.amount
    item.date_last_updated = _dt.datetime.utcnow().replace(tzinfo=from_zone).astimezone(to_zone)

    # Update team budget as well
    await update_team_budget(name = team_name, change = change, db = db)

    # Update item info
    if item.support_docs:
        newFileName = "supportfiles/" + team_name + "_" + budgetItem.item_name + ".pdf"
        os.rename(item.support_docs, newFileName)
        item.support_docs = newFileName



    db.commit()
    db.refresh(item)

    return _schemas.BudgetItem.from_orm(item)

# Admin download item docs
async def get_docs_admin(item_name : str, team_name : str, db: _orm.Session):
    # Filename format is supportfiles/team_name/item_name.pdf
    filepath = "supportfiles/" + team_name + "_" + item_name + ".pdf"
    filename = team_name + "_" + item_name + ".pdf"

    # Make sure the doc exists
    if not os.path.exists(filepath):
        raise _fastapi.HTTPException(status_code=404, detail= "No supporting document exists for this item!")
    
    return _resp.FileResponse(path=filepath, filename=filename, media_type='application/pdf')

# Admin verify item docs
async def verify_docs_admin(item_name : str, team_name : str, db : _orm.Session):
    item = await _item_selector_admin(item_name = item_name, team_name = team_name, db = db)

    # Verify / unverify the item
    item.doc_verified = not item.doc_verified

    # Commit
    db.commit()
    db.refresh(item)

    return {"detail" : "Item " + item_name +  " for team " + team_name + " was verified successfully."}

async def reject_docs_admin(item_name : str, team_name : str, db : _orm.Session):
    item = await _item_selector_admin(item_name = item_name, team_name = team_name, db = db)

    # Mark item as rejected, forces replace
    item.doc_rejected = True

    # Commit
    db.commit()
    db.refresh(item)

    return {"detail" : "Item " + item_name +  " for team " + team_name + " was rejected successfully."}


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

#Get all teams
async def get_all_teams(db: _orm.Session = _fastapi.Depends(get_db), skip: int= 0, limit: int = 100):
    teams = db.query(_models.Team).all()
    return list(map(_schemas.Team.from_orm,teams))

# Get Items - Team
async def get_items_team(team: _schemas.Team, db: _orm.Session):
    items = db.query(_models.BudgetItem).filter_by(team_name=team.name)

    return list(map(_schemas.BudgetItem.from_orm, items))

# Item selector - Team
async def _item_selector(item_name: str, team: _schemas.Team, db: _orm.Session):
    item = (

        db.query(_models.BudgetItem)
        .filter_by(team_name = team.name)
        .filter(_models.BudgetItem.item_name == item_name)
        .first()
    )

    if item is None:
        raise _fastapi.HTTPException(status_code=404, detail= "Budget item does not exist!")
    
    return item

# Item selector by id - Team
async def _item_selector_id(id: int, team: _schemas.Team, db: _orm.Session):
    item = (

        db.query(_models.BudgetItem)
        .filter_by(team_name = team.name)
        .filter(_models.BudgetItem.id == id)
        .first()
    )

    if item is None:
        raise _fastapi.HTTPException(status_code=404, detail= "Budget item does not exist!")
    
    return item

# Get item - Team
async def get_item_team(item_name: str, team: _schemas.Team, db: _orm.Session):
    item = await _item_selector(item_name = item_name, team = team, db = db)

    return _schemas.BudgetItem.from_orm(item)

# Delete item - Team
async def delete_item_team(item_name: str, team: _schemas.Team, db: _orm.Session):
    item = await _item_selector(item_name = item_name, team = team, db = db)

    # Update team budget as well
    await update_team_budget(name = team.name, change = -item.amount, db = db)

    db.delete(item)
    db.commit()

# Update item - Team
async def update_item_team(item_name: str, budgetItem: _schemas._BudgetItemBase, team: _schemas.Team, db: _orm.Session):
    
    item = await _item_selector(item_name = item_name, team = team, db = db)

    item.item_name = budgetItem.item_name
    change = budgetItem.amount - item.amount 
    item.amount = budgetItem.amount
    item.date_last_updated = _dt.datetime.utcnow().replace(tzinfo=from_zone).astimezone(to_zone)

    # Update team budget as well
    await update_team_budget(name = team.name, change = change, db = db)

    # Update item info
    if item.support_docs:
        newFileName = "supportfiles/" + team.name + "_" + budgetItem.item_name + ".pdf"
        os.rename(item.support_docs, newFileName)
        item.support_docs = newFileName


    try:
        db.commit()
        db.refresh(item)

    except:
        raise _fastapi.HTTPException(status_code=401, detail= "Item names must be unique for teams!")
    
    return _schemas.BudgetItem.from_orm(item)

# Update item by id - Team
async def update_item_id(id : int, budgetItem: _schemas._BudgetItemBase, team: _schemas.Team, db: _orm.Session):
    item = await _item_selector_id(id = id, team = team, db = db)

    item.item_name = budgetItem.item_name
    change = budgetItem.amount - item.amount 
    item.amount = budgetItem.amount
    item.date_last_updated = _dt.datetime.utcnow().replace(tzinfo=from_zone).astimezone(to_zone)

    # Update team budget as well
    await update_team_budget(name = team.name, change = change, db = db)

    # Update item info
    if item.support_docs:
        newFileName = "supportfiles/" + team.name + "_" + budgetItem.item_name + ".pdf"
        os.rename(item.support_docs, newFileName)
        item.support_docs = newFileName




    try:
        db.commit()
        db.refresh(item)
    
    except:
        raise _fastapi.HTTPException(status_code=401, detail= "Item names must be unique for teams!")


    return _schemas.BudgetItem.from_orm(item)

# Add docs - Team - Check security later
async def add_docs_team(item_name: str, file: _fastapi.UploadFile, team: _schemas.Team, db: _orm.Session):
        
        item = await _item_selector(item_name=item_name, team=team, db=db)
        filename_temp = "supportfiles/" + team.name + "_" + item_name + "_temp.pdf"
        filename = "supportfiles/" + team.name + "_" + item_name + ".pdf"
        
        # Try upload
        try:
            contents = file.file.read()
            with open(filename_temp, 'wb') as f:
                f.write(contents)

        except:
            os.remove(filename_temp)
            raise _fastapi.HTTPException(status_code=500, detail= "There was an error during file upload, please try again...")
        
        # Check if pdf is valid
        try:
            _pdf.PdfFileReader(open(filename_temp, "rb"))
        
        except:
            os.remove(filename_temp)
            raise _fastapi.HTTPException(status_code=415, detail= "The uploaded file is not a valid pdf file!")

        
        # If so, replace file
        if os.path.isfile(filename):
            os.remove(filename)
        
        os.rename(filename_temp, filename)
        


        item.date_last_updated = _dt.datetime.utcnow().replace(tzinfo=from_zone).astimezone(to_zone)
        item.support_docs = filename
        item.doc_verified = False
        item.doc_rejected = False

        db.commit()
        db.refresh(item)

        return _schemas.BudgetItem.from_orm(item)

# Get docs - Team - Check security later
async def get_docs_team(item_name: str, team: _schemas.Team, db: _orm.Session):
        
    # Filename format is supportfiles/team_name/item_name.pdf
    filepath = "supportfiles/" + team.name + "_" + item_name + ".pdf"
    filename = team.name + "_" + item_name + ".pdf"

    # Make sure the doc exists
    if not os.path.exists(filepath):
        raise _fastapi.HTTPException(status_code=404, detail= "No supporting document exists for this item!")
    
    return _resp.FileResponse(path=filepath, filename=filename, media_type='application/pdf')

#*************************
#       BUDGET
#*************************

# Get Budget through team & item names
async def get_budget_item(team_name: str, item_name: str, db: _orm.Session):
    return db.query(_models.BudgetItem).filter(_models.BudgetItem.team_name == team_name, _models.BudgetItem.item_name == item_name).first()

# Get Budget through id
async def get_item_id(team : _schemas.Team, id : int, db : _orm.Session):
    db_item = db.query(_models.BudgetItem).filter(_models.BudgetItem.id == id, _models.BudgetItem.team_name == team.name).first()

    if db_item is None:
        raise _fastapi.HTTPException(status_code=404, detail= "Budget item does not exist!")
    
    else:
        return db_item

# Create new BudgetItem
async def create_budget_item(budgetItem: _schemas.BudgetItemCreate, db: _orm.Session):
    
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






