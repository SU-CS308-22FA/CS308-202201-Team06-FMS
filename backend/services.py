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


# Get Team through name
async def get_team_by_name(name: str, db: _orm.Session):
    return db.query(_models.Team).filter(_models.Team.name == name).first()

# Create new Team user
async def create_team(team: _schemas.TeamCreate, db: _orm.Session):
    
    # New Team object
    teamObj = _models.Team(
        email = team.email, 
        name = team.first_name,  
        pass_hash = _hash.bcrypt.hash(team.pass_hash)
    )

    # Write to db
    db.add(teamObj)
    db.commit()
    db.refresh(teamObj)
    return teamObj
