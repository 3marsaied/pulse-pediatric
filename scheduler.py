import json
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import Integer, cast
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
from DataBase import SessionLocal
import models
import requests
from google.oauth2 import service_account
import google.auth.transport.requests

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
        print(f"formatted date {formatted_now}")
        two_hours_from_now = now + timedelta(hours=2)
        formatted_hour = two_hours_from_now.hour
        print(f"formatted hour {formatted_hour}")

        appointments = session.query(models.Appointment).filter(
            models.Appointment.appointmentDate == formatted_now,
            cast(models.Appointment.fromTime, Integer) <= formatted_hour
        ).all()
        
        if not appointments:
            print("No appointments found")
            session.close()
            return
        
        for appointment in appointments:
            fcms = session.query(models.fcm).filter(models.fcm.userId == appointment.parentId).all()
            send_notification(appointment, fcms)
        
        session.close()
    except SQLAlchemyError as e:
        print(f"An error occurred while querying appointments: {e}")

def send_notification(appointment, fcms):
    # Define the required scope for FCM
    scopes = ['https://www.googleapis.com/auth/firebase.messaging']
    # Load the credentials from the service account key file with the defined scopes
    credentials = service_account.Credentials.from_service_account_file('firebase_key.json', scopes=scopes)
    auth_request = google.auth.transport.requests.Request()
    credentials.refresh(auth_request)
    access_token = credentials.token

    for fcm in fcms:
        token = fcm.fcmToken
        message = f"You have an appointment scheduled on {appointment.appointmentDate} from {appointment.fromTime} to {appointment.toTime}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        payload = {
            'message': {
                'notification': {
                    'title': 'Appointment Reminder',
                    'body': message,
                },
                'token': token,
            }
        }
        response = requests.post('https://fcm.googleapis.com/v1/projects/pulse-pediatric/messages:send', headers=headers, json=payload)
        if response.status_code == 200:
            print("Notification sent successfully")
        else:
            print("Failed to send notification")
            print(response.text)

def keep_awake():
    print("")

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_last_year_appointments, 'cron', year='*', month='1', day='1', hour='0', minute='0')
    scheduler.add_job(send_notifications, 'cron', minute='*')
    scheduler.add_job(keep_awake, 'interval', seconds=1)
    scheduler.start()

if __name__ == "__main__":
    start_scheduler()
