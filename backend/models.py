# Models file for database Team 06 - FMS
# 
# @zgr2788
#
# Description:
# Includes the tables to be used in backend.


import datetime as _dt
from dateutil import tz as _tz
import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import database as _database

# Define timezones
from_zone = _tz.gettz('UTC')
to_zone = _tz.gettz('Turkey')


class Team(_database.Base):
    
    # Name
    __tablename__ = "teams"
    
    # Cols
    id = _sql.Column(_sql.Integer, primary_key = True, index = True)  # Unique team id - pkey
    email = _sql.Column(_sql.String, unique = True, index = True)     # General manager e-mail
    name = _sql.Column(_sql.String, unique = True, index = True)      # Name of the team
    budget_total = _sql.Column(_sql.Float)                            # Total budget
    budget_alloc = _sql.Column(_sql.Float)                            # Used budget
    budget_rem = _sql.Column(_sql.Float)                              # Remaining budget
    is_overlimit = _sql.Column(_sql.Boolean)                          # Is over the budget
    pass_hash = _sql.Column(_sql.String)                              # Password hash

    
    #Establish relationship
    owner  = _orm.relationship("BudgetItem", back_populates = "teams")
    
    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.pass_hash)


class Admin(_database.Base):

    # Name
    __tablename__ = "admins"

    # Cols
    id = _sql.Column(_sql.Integer, primary_key = True, index = True)                                                             # Unique admin id - pkey
    email = _sql.Column(_sql.String, unique = True, index = True)                                                                # E-mail for admin
    ssn = _sql.Column(_sql.Integer, Unique = True, index = True)                                                                 # SSN (SGK) No.
    pass_hash = _sql.Column(_sql.String)                                                                                         # Password hash
    first_name = _sql.Column(_sql.String, index = True)                                                                          # Name
    last_name = _sql.Column(_sql.String, index = True)                                                                           # Surname
    date_registered = _sql.Column(_sql.DateTime, default = _dt.datetime.utcnow().replace(tzinfo=from_zone).astimezone(to_zone))  # Date of entry creation

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.pass_hash)

class BudgetItem(_database.Base):

    #Name
    __tablename__ = "budgetitems"

    # Cols
    team_name = _sql.Column(_sql.String, _sql.ForeignKey("teams.name"), primary_key = True)                                       # Team name
    item_name = _sql.Column(_sql.String, primary_key = True, index = True)                                                        # Budget item name
    amount = _sql.Column(_sql.Float)                                                                                              # Amount of the item
    date_created = _sql.Column(_sql.DateTime, default = _dt.datetime.utcnow().replace(tzinfo=from_zone).astimezone(to_zone))      # Date of entry creation
    date_last_updated = _sql.Column(_sql.DateTime, default = _dt.datetime.utcnow().replace(tzinfo=from_zone).astimezone(to_zone)) # Date of last entry update

    # Establish relation with TeamAcc
    teams = _orm.relationship("Team", back_populates = "owner")

    # TODO : Add file verification

