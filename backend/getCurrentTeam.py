

import sqlalchemy.orm as _orm
import fastapi as _fastapi
import models as _models
import schemas as _schemas
import services as _services
import jwt as _jwt
import fastapi.security as _security


JWT_SECRET_TEAM = "RONALDOSUPPORTSFINANCIALMANAGEMENTSYSTEM"
oauth2scheme = _security.OAuth2PasswordBearer(tokenUrl = "/api/tokens")

# === Query Function for getting logged Team ===

async def get_current_team( db: _orm.Session = _fastapi.Depends(_services.get_db), token: str = _fastapi.Depends(oauth2scheme)):
    """ Gets the current team. This team is required to login
        to system in order to have a team token. Otherwise,
        there will be an exception.

    Parameters
    ----------

    db: {list of tables}
        An instance of the current database. The instance required
        for reaching particular data tuple in a table. 
        It can be empty instance. If any value is not given, default value is taken
        from get_db function.

    token: {string}
        A string variable which are unique for each team indicating
        login session of the team. Each token is given after an succesful
        login. If any value is not given, the default value will be taken 
        according to oauth2scheme.

    Returns
    -------
    team: {Team Object}
        A schema of a particular team representing corresponding
        values for a team object.
    
    Raises
    ------
    Exception: {HTTP Exception}
        If this function called by a unauthenticated user, an error
        will raise stating the situtation with a 401 http status code
    """

    # tries to decode given token according to jwt code
    try:
        payload = _jwt.decode(token, JWT_SECRET_TEAM, algorithms=["HS256"])
        team = db.query(_models.Team).get(payload["id"])
    except:
        raise _fastapi.HTTPException(status_code = 401, detail = "Your account is not authorized for this action!")

    return _schemas.Team.from_orm(team)