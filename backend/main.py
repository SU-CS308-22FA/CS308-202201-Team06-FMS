# Main API for database Team 06 - FMS
#
# @zgr2788
#
# Description:
# Includes the driver code for the backend.

import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm
import services as _services, schemas as _schemas

app = _fastapi.FastAPI()


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


# Create team user
@app.post("/api/teams")
async def create_team(
    team: _schemas.TeamCreate, db:_orm.Session = _fastapi.Depends(_services.get_db)
):
    # Check if admin exists
    db_team_name = await _services.get_team_by_name(team.name ,db)
    db_team_email = await _services.get_team_by_email(team.email, db)
    
    if db_team_name:
        raise _fastapi.HTTPException(status_code = 400, detail = "Team name already registered to database!")

    elif db_team_email:
        raise _fastapi.HTTPException(status_code = 400, detail = "Team email already registered to database!")



    # If not, create new admin
    return await _services.create_team(team, db)
