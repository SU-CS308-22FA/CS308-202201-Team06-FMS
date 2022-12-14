import sqlalchemy.orm as _orm
import fastapi as _fastapi
import models as _models
import schemas as _schemas
import services as _services

# === Query function for all Teams ===

async def get_all_teams(db: _orm.Session = _fastapi.Depends(_services.get_db), skip: int= 0, limit: int = 100):
    """ Get all teams which are registered to database by a query

    Parameters
    ----------
    db: {list of tables} 
        An instance of the current database. The instance required
        for reaching particular data tuple in a table. 
        It can be empty instance. If any value given, default value is taken
        from get_db function.
    
    skip: {integer}
        The given integer represents the offset value for query. Database
        will start query from the position after skip index.
        The parameter may not be given, in this case it is taken as 0.

    limit: {integer}
        The given integer represents the limit for query response. Query
        will return data tuples as many as limit value.
        The parameter may not be given, in this case it is taken as 100

    Returns
    -------
    teams: {list of Team object}
        Contains list of the team object which taken from applied query
    """
    teams = db.query(_models.Team).offset(skip).limit(limit).all() # query is applied here aacording to skip and offset values
    return list(map(_schemas.Team.from_orm,teams))
