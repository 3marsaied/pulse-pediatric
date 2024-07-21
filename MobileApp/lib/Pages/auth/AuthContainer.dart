import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'package:project_name/Pages/doctor/DoctorPortal.dart';
import 'package:project_name/Pages/auth/StartingScreen.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// A StatefulWidget that determines the authentication state and navigates accordingly.
class AuthContainer extends StatefulWidget {
  /// Constructor for the AuthContainer widget.
  final String? role;
  const AuthContainer({
    super.key,
    this.role,
  });

  @override
  State<AuthContainer> createState() => _AuthContainerState();
}

/// The state for the AuthContainer widget.
class _AuthContainerState extends State<AuthContainer> {
  late String? access_token; // Variable to store the access token
  late String? role = widget.role;
  late int? userId;

  @override
  void initState() {
    super.initState();
    var status =  Permission.storage.request();
    // Retrieve token from shared preferences when the widget initializes
    SharedPreferences.getInstance().then((sharedPrefValue) {
      setState(() {
        // Store the token in the access_token variable
        access_token = sharedPrefValue.getString('token');
        role = sharedPrefValue.getString('role');
        userId = sharedPrefValue.getInt('userId');
      });
    });
  }


  @override
  Widget build(BuildContext context) {
    if (access_token == null) {
      return const StartingScreen();
    } else {
      if(role == 'customer'){
        return  PatientPortal(
          userId: userId,
          token: access_token,
        );
      }
      else if(role == 'doctor'){
        return  DoctorPortal(
          doctorId: userId,
          token: access_token,
        );
      }
      else{
        return const StartingScreen();
      }
    }
  }
}


