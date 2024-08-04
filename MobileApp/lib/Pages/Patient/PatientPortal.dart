import 'dart:convert';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:project_name/Pages/Patient/AddAppointment.dart';
import 'package:project_name/Pages/Patient/Drawer/Drawer.dart';
import 'package:project_name/Pages/Patient/Drawer/EditUser.dart';
import 'package:project_name/Pages/auth/StartingScreen.dart';
import 'package:project_name/Pages/features/AppointmentView.dart';
import 'package:project_name/routes.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PatientPortal extends StatefulWidget {
  final String? token;
  final int? userId;
  const PatientPortal({super.key, required this.token, required this.userId});

  @override
  State<PatientPortal> createState() => _PatientPortalState();
}

class _PatientPortalState extends State<PatientPortal> {
  late String? user_name = '';
  late String? userName = '';
  late String? userEmail = '';
  late String? userPhone = '';
  late String? userPic = '';
  late int userId = 0;
  late String? firstName = '';
  late String? lastName = '';
  late int? age = 0;
  List<dynamic> Datas = [];
  bool isLoading = true; // Variable to track loading state

  @override
  void initState() {
    super.initState();
    getUserData(); // Fetch user data and perform any other initial async operations
  }

  Future<void> getUserData() async {
    final url = Uri.parse(routes.getUser(widget.userId!));
    final headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    try {
      final response = await http.get(url, headers: headers);
      print("response status: " + response.statusCode.toString());
      if (response.statusCode == 200) {
        // If the server returns a 200 OK response, parse the JSON.
        Map<String, dynamic> data = jsonDecode(response.body);
        setState(() {
          String capitalize(String text) {
            return text.split(" ").map((str) => str[0].toUpperCase() + str.substring(1)).join(" ");
          }
          user_name = "Mr.${capitalize(data['firstName'])} ${capitalize(data['lastName'])}";
          userId = data['userId'];
          userName = data['userName'];
          userEmail = data['email'];
          firstName = data['firstName'];
          lastName = data['lastName'];
          userPhone = data['phone'];
          age = data['age'];
          userPic = data['profilePicture'];
          // Assume more asynchronous operations here
        });
      } else {
        // If the server did not return a 200 OK response, throw an exception.
        print('Request failed with status: ${response.statusCode}.');
      }
    } catch (e) {
      // Catch any exceptions thrown during the request and print them.
      print('Exception occurred: $e');
    } finally {
      setState(() {
        isLoading = false; // Data loading complete
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        automaticallyImplyLeading: false,
        title: Center(
          child: const Text(
            "Welcome Back",
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
      ),
      floatingActionButton: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: () async {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => EditUser(
                    token: widget.token,
                    userId: userId,
                    userName: userName,
                    email: userEmail,
                    firstName: firstName,
                    lastName: lastName,
                    phone: userPhone,
                    age: age,
                    pic: userPic,
                  ),
                ),
              );
            },
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Container(
              width: 30,
              height: 30,
              child: Container(
              width: 30,
              height: 30,
              child: Image(
                image: AssetImage('assets/icon/editProfile.png'),
              ),
            ),
            ),
            backgroundColor: Color(0xFFFFB561),
          ),
          SizedBox(height: 10),
          FloatingActionButton(
            onPressed: () async {
              final SharedPreferences prefs = await SharedPreferences.getInstance();
              await prefs.remove('accessToken');
              await prefs.remove('role');
              await prefs.remove('userId');
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const StartingScreen()),
              );
            },
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Container(
              width: 30,
              height: 30,
              child: Image(
                image: AssetImage('assets/icon/out.png'),
              ),
            ),
            backgroundColor: Color(0xFFFFB561),
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator()) // Show loading indicator
          : Enddrawer(
              userPic: userPic,
              user_name: user_name!,
              parentId: widget.userId!,
              token: widget.token,
              userName: userName!,
              email: userEmail,
              phone: userPhone,
              firstName: firstName,
              lastName: lastName,
              age: age,
            ),
    );
  }
}
