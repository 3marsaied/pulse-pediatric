from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from DataBase import SessionLocal
import models

def delete_last_year_appointments():
    current_year = datetime.now().year
    last_year = current_year - 1
    try:
        session = SessionLocal()
        session.query(models.Appointment).filter(models.Appointment.appointmentDate < datetime(current_year, 1, 1)).delete()
        session.commit()
        session.close()
        print(f"Deleted appointments from the year {last_year}")
    except SQLAlchemyError as e:
        print(f"An error occurred while deleting appointments: {e}")

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_last_year_appointments, 'cron', year='*', month='1', day='1', hour='0', minute='0')
    scheduler.start()

if __name__ == "__main__":
    start_scheduler()
