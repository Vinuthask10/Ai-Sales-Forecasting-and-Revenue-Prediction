from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(200))
    role = Column(String(20)) # "admin" or "manager"
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)

    branch = relationship("Branch", back_populates="users")

class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    location = Column(String(200))
    
    users = relationship("User", back_populates="branch")
    transactions = relationship("Transaction", back_populates="branch")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    total_amount = Column(Float)
    order_type = Column(String(50)) # 'Dine-in', 'Takeaway', 'Online'
    payment_method = Column(String(50))

    branch = relationship("Branch", back_populates="transactions")

class ExternalFactor(Base):
    __tablename__ = "external_factors"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    weather_condition = Column(String(50))
    temperature = Column(Float)
    local_events = Column(Boolean, default=False)

class OperationalInput(Base):
    __tablename__ = "operational_inputs"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id"))
    date = Column(Date, index=True)
    number_of_staff = Column(Integer)
    seating_capacity = Column(Integer)
    table_occupancy_rate = Column(Float)
