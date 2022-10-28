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

@app.post("/api/users")

# Create admin user
async def create_admin(
    admin: _schemas.AdminCreate, db:_orm.Session = _fastapi.Depends(_services.get_db)
):
    # Check if admin exists
    db_admin = await _services.get_admin_by_email(admin.email ,db)
    
    if db_admin:
        raise _fastapi.HTTPException(status_code = 400, detail = "Email already registered to database!")
    
    # If not, create new admin
    return await _services.create_admin(admin, db)
   


