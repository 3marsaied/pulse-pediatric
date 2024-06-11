from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
from DataBase import SessionLocal
import models
import requests

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

def send_notifications():
    try:
        session = SessionLocal()
        now = datetime.now()
        formatted_now = now.strftime("%Y-%m-%d")
        two_hours_from_now = now + timedelta(hours=2)
        formatted_hour = two_hours_from_now.hour
        appointments = session.query(models.Appointment).filter(
            models.Appointment.appointmentDate >= formatted_now,
            models.Appointment.From <= formatted_hour
        ).all()
        
        for appointment in appointments:
            fcnTokens = session.query(models.fcm).filter(models.fcm.userId == appointment.parentId).all()
            # Send notification for each appointment
            send_notification(appointment, fcnTokens)
        
        session.close()
    except SQLAlchemyError as e:
        print(f"An error occurred while querying appointments: {e}")

def send_notification(appointment, fcmTokens):
    # Add your notification logic here
    # Example: Sending a notification to the user associated with the appointment
    for fcm_token in fcmTokens:
        message = f"You have an appointment scheduled at {appointment.appointmentDate} from {appointment.From} to {appointment.To}"
        api_key = 'AIzaSyAggWWiMWAbKw834_37RWzz391j2VNHVmU'  # Replace with your actual API key (current_key)
        headers = {
            'Content-Type': 'application/json',
        }
        payload = {
            'notification': {
                'title': 'Appointment Reminder',
                'body': message,
            },
            'to': fcm_token,
        }
        response = requests.post('https://fcm.googleapis.com/fcm/send', headers=headers, params={'key': api_key}, json=payload)
        if response.status_code == 200:
            print("Notification sent successfully")
        else:
            print("Failed to send notification")
            print(response.text)

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_last_year_appointments, 'cron', year='*', month='1', day='1', hour='0', minute='0')
    scheduler.add_job(send_notifications, 'cron', minute='*')  # Run every minute
    scheduler.start()
