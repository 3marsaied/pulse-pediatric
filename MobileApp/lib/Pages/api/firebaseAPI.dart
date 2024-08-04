import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:project_name/routes.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Function to add FCM token to the server
Future<void> addFcmToken(String fcmToken, int userId, String token) async {
  final url = Uri.parse(routes.addFcmToken);
  final headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
  };
  final body = jsonEncode({
    "fcmToken": fcmToken,
    "userId": userId,
  });

  var response = await http.post(url, headers: headers, body: body);
  print("add fcmToken ${response.statusCode}");
  print("add fcmToken ${response.body}");
}

// Firebase API class to handle FCM initialization
class FirebaseAPI {
  final _firebaseMessaging = FirebaseMessaging.instance;

  Future<void> initNotification() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    int? userId = prefs.getInt('userId');

    if (token == null || userId == null) {
      print('Token or userId is missing in shared preferences');
      return;
    }

    await _firebaseMessaging.requestPermission();

    final fcmToken = await _firebaseMessaging.getToken();
    if (fcmToken != null) {
      addFcmToken(fcmToken, userId, token);
      print("fcmToken: $fcmToken");
    } else {
      print('Failed to get FCM token');
    }
  }
}
