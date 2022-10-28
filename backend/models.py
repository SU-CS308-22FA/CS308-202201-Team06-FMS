# Models file for database Team 06 - FMS
# 
# @zgr2788
#
# Description:
# Includes the tables to be used in backend.


import datetime as dt
from operator import index

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database

class TeamAcc(_database.Base):
    
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

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.pass_hash)


class Admin(_database.Base):

    # Name
    __tablename__ = "admins"

    # Cols
    id = _sql.Column(_sql.Integer, primary_key = True, index = True)  # Unique admin id - pkey
    email = _sql.Column(_sql.String, unique = True, index = True)     # E-mail for admin
    ssn = _sql.Column(_sql.Integer, Unique = True, index = True)      # SSN (SGK) No.
    pass_hash = _sql.Column(_sql.String)

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.pass_hash)
